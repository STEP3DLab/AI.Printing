import streamlit as st
import numpy as np
import tempfile
import io

# Try to import trimesh first; fall back to numpy-stl if not available
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

def load_mesh(file_bytes):
    """Load STL and return bounding box dimensions (mm) and volume (mm^3)."""
    if MESH_BACKEND == 'trimesh':
        try:
            mesh = trimesh.load(io.BytesIO(file_bytes), file_type='stl')
            bbox = mesh.bounding_box.extents
            volume = mesh.volume
            return bbox, volume
        except Exception as e:
            st.error(f"Ошибка при чтении STL: {e}")
            return None, None
    elif MESH_BACKEND == 'numpy-stl':
        try:
            with tempfile.NamedTemporaryFile(delete=False, suffix='.stl') as tmp:
                tmp.write(file_bytes)
                tmp.flush()
                m = npmesh.Mesh.from_file(tmp.name)
            bbox_dims = m.max_ - m.min_
            volume, _, _ = m.get_mass_properties()
            return bbox_dims, volume
        except Exception as e:
            st.error(f"Ошибка при чтении STL: {e}")
            return None, None
    else:
        st.error("Невозможно импортировать библиотеки для работы с STL.")
        return None, None

def compute_costs(volume_cm3, params):
    cost_fdm = volume_cm3 * params['price_filament'] + volume_cm3 * params['time_coef_fdm'] * params['price_machine_hour']
    cost_dlp = volume_cm3 * params['price_resin'] + volume_cm3 * params['time_coef_dlp'] * params['price_machine_hour']
    return cost_fdm, cost_dlp

side_text = """
## Справка
1. Загрузите STL-файл модели.
2. Укажите желаемый наибольший габарит (мм). Масштаб будет рассчитан автоматически.
3. При необходимости измените параметры стоимости.
4. Итоговые цены учитывают материал и машинное время.
"""

st.sidebar.markdown(side_text)

st.title("3D-Print Cost Estimator")

uploaded_file = st.file_uploader("Загрузите STL-файл", type=['stl'])

if uploaded_file is not None:
    file_bytes = uploaded_file.read()
    dims, volume_mm3 = load_mesh(file_bytes)
    if dims is None:
        st.stop()

    x_dim, y_dim, z_dim = dims
    orig_max_dim = float(max(dims))
    volume_cm3 = volume_mm3 / 1000.0  # 1 cm^3 = 1000 mm^3

    target_dim = st.number_input(
        "Целевой наибольший габарит модели, мм",
        min_value=0.0,
        value=orig_max_dim,
        format="%f"
    )

    if target_dim <= 0:
        st.warning("Укажите положительное значение габарита")
        st.stop()

    scale = target_dim / orig_max_dim
    scaled_volume_cm3 = volume_cm3 * (scale ** 3)

    st.header("Параметры стоимости")
    col1, col2 = st.columns(2)
    with col1:
        price_filament = st.number_input("Цена филамента, ₽/см³", min_value=0.0, value=4.0, step=0.1)
        time_coef_fdm = st.number_input("Коэфф. машинного времени FDM, ч/см³", min_value=0.0, value=0.04, step=0.01)
    with col2:
        price_resin = st.number_input("Цена смолы, ₽/см³", min_value=0.0, value=14.0, step=0.1)
        time_coef_dlp = st.number_input("Коэфф. машинного времени DLP, ч/см³", min_value=0.0, value=0.02, step=0.01)
    price_machine_hour = st.number_input("Цена машинного часа, ₽/ч", min_value=0.0, value=150.0, step=1.0)

    params = {
        'price_filament': price_filament,
        'price_resin': price_resin,
        'time_coef_fdm': time_coef_fdm,
        'time_coef_dlp': time_coef_dlp,
        'price_machine_hour': price_machine_hour,
    }

    cost_fdm, cost_dlp = compute_costs(scaled_volume_cm3, params)

    st.subheader("Параметры модели")
    table = {
        "Размер X, мм": [round(x_dim, 2)],
        "Размер Y, мм": [round(y_dim, 2)],
        "Размер Z, мм": [round(z_dim, 2)],
        "Масштаб": [round(scale, 3)],
        "Объём, см³": [round(scaled_volume_cm3, 2)]
    }
    st.table(table)

    st.subheader("Расчёт стоимости")
    colF, colD = st.columns(2)
    colF.metric("FDM печать (₽)", f"{cost_fdm:,.2f}")
    colD.metric("DLP печать (₽)", f"{cost_dlp:,.2f}")
else:
    st.info("Загрузите STL-файл для начала")
