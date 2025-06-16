import io
import tempfile
import streamlit as st

# Try to import trimesh first; fall back to numpy-stl
try:
    import trimesh
    MESH_BACKEND = 'trimesh'
except Exception:
    trimesh = None
    try:
        from stl import mesh as npmesh
        MESH_BACKEND = 'numpy-stl'
    except Exception:
        npmesh = None
        MESH_BACKEND = None

# ====== Constants for materials and pricing ======
FDM_MATERIALS = {
    'PLA (1.24 г/см³)': 1.24,
    'ABS (1.1 г/см³)': 1.10,
    'PETG (1.27 г/см³)': 1.27,
    'TPU (1.2 г/см³)': 1.20,
}

DLP_MATERIALS = {
    'Стандартная смола (1.2 г/см³)': 1.20
}

FDM_PRICE_PER_G = 10  # руб/грамм
DLP_PRICE_PER_CM3 = 50  # руб/см³
FDM_MIN_COST = 500
DLP_MIN_COST = 1000
SUPPORT_COEF = 1.1  # +10% объёма на поддержки


# ====== Mesh loading and basic properties ======
def load_mesh(file_bytes):
    """Load an STL file and return bounding box in mm and volume in cm³."""
    if MESH_BACKEND == 'trimesh':
        mesh = trimesh.load(io.BytesIO(file_bytes), file_type='stl')
        if not mesh.is_watertight:
            raise ValueError('Модель не является замкнутой (watertight)')
        bbox = mesh.bounding_box.extents
        volume_cm3 = mesh.volume / 1000.0  # mm³ -> cm³
        return bbox, volume_cm3
    elif MESH_BACKEND == 'numpy-stl':
        with tempfile.NamedTemporaryFile(delete=False, suffix='.stl') as tmp:
            tmp.write(file_bytes)
            tmp.flush()
            m = npmesh.Mesh.from_file(tmp.name)
        if not m.is_closed():
            raise ValueError('Модель не является замкнутой (watertight)')
        bbox = m.max_ - m.min_
        volume_mm3, _, _ = m.get_mass_properties()
        volume_cm3 = volume_mm3 / 1000.0
        return bbox, volume_cm3
    else:
        raise RuntimeError('Нет библиотеки для обработки STL')


# ====== Streamlit interface ======
st.set_page_config(page_title='3D-печать калькулятор')
st.title('Калькулятор стоимости 3D-печати')

uploaded = st.file_uploader('Загрузите STL-файл', type='stl')

if uploaded:
    try:
        bbox, volume_cm3 = load_mesh(uploaded.read())
    except Exception as e:
        st.error(f'Ошибка загрузки STL: {e}')
        st.stop()

    st.write(f'Объём модели: **{volume_cm3:.2f} см³**')
    st.write(
        f'Габариты (мм): X={bbox[0]:.2f}, Y={bbox[1]:.2f}, Z={bbox[2]:.2f}'
    )

    tech = st.selectbox('Технология печати', ['FDM', 'DLP'])

    if tech == 'FDM':
        material_name = st.selectbox('Материал', list(FDM_MATERIALS.keys()))
        density = FDM_MATERIALS[material_name]
        infill = st.slider('Заполнение модели (%)', 10, 100, 20)
        add_supports = st.checkbox('Добавить 10% объёма на поддержки')

        real_volume = volume_cm3 * (SUPPORT_COEF if add_supports else 1.0)
        mass_g = real_volume * density * (infill / 100.0)
        cost = mass_g * FDM_PRICE_PER_G
        min_cost = FDM_MIN_COST
    else:  # DLP
        material_name = st.selectbox('Материал', list(DLP_MATERIALS.keys()))
        density = DLP_MATERIALS[material_name]
        add_supports = st.checkbox('Добавить 10% объёма на поддержки')
        real_volume = volume_cm3 * (SUPPORT_COEF if add_supports else 1.0)
        mass_g = real_volume * density
        cost = real_volume * DLP_PRICE_PER_CM3
        min_cost = DLP_MIN_COST

    if cost < min_cost:
        st.warning(
            f'Расчётная стоимость меньше минимальной. Минимальный заказ: {min_cost} ₽.'
        )
        cost = min_cost

    st.subheader('Результаты')
    st.write(
        f'**Материал:** {material_name}, плотность {density} г/см³'
    )
    st.write(f'**Масса:** {mass_g:.2f} г')
    st.write(f'**Стоимость печати:** {cost:.2f} ₽')
    st.write(f'**Учтённый объём (с поддержками):** {real_volume:.2f} см³')
else:
    st.info('Для начала загрузите STL-файл')
