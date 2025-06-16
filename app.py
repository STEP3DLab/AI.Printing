from flask import Flask, render_template, request, jsonify
import io
import tempfile

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

app = Flask(__name__)


def load_mesh(file_bytes):
    """Load STL and return bounding box dimensions (mm) and volume (mm^3)."""
    if MESH_BACKEND == 'trimesh':
        mesh = trimesh.load(io.BytesIO(file_bytes), file_type='stl')
        bbox = mesh.bounding_box.extents
        volume = mesh.volume
        return bbox, volume
    elif MESH_BACKEND == 'numpy-stl':
        with tempfile.NamedTemporaryFile(delete=False, suffix='.stl') as tmp:
            tmp.write(file_bytes)
            tmp.flush()
            m = npmesh.Mesh.from_file(tmp.name)
        bbox_dims = m.max_ - m.min_
        volume, _, _ = m.get_mass_properties()
        return bbox_dims, volume
    else:
        raise RuntimeError('No STL backend available')


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/estimate', methods=['POST'])
def estimate():
    file = request.files.get('stl_file')
    if file is None or file.filename == '':
        return jsonify(error='Файл STL обязателен'), 400
    if not file.filename.lower().endswith('.stl'):
        return jsonify(error='Неверный формат файла'), 400
    try:
        bbox, volume_mm3 = load_mesh(file.read())
    except Exception as e:
        return jsonify(error=f'Ошибка при чтении STL: {e}'), 400

    try:
        target_dim = float(request.form.get('target_dim', ''))
        if target_dim <= 0:
            raise ValueError
    except Exception:
        return jsonify(error='Некорректное значение габарита'), 400

    def get_param(name, default):
        try:
            val = float(request.form.get(name, default))
            if val < 0:
                raise ValueError
            return val
        except Exception:
            raise ValueError(f'Некорректное значение: {name}')

    try:
        price_filament = get_param('price_filament', 4)
        price_resin = get_param('price_resin', 14)
        time_coef_fdm = get_param('time_coef_fdm', 0.04)
        time_coef_dlp = get_param('time_coef_dlp', 0.02)
        price_machine_hour = get_param('price_machine_hour', 150)
    except ValueError as e:
        return jsonify(error=str(e)), 400

    max_dim = max(bbox)
    scale = target_dim / max_dim
    volume_cm3 = volume_mm3 / 1000.0
    scaled_volume_cm3 = volume_cm3 * (scale ** 3)

    cost_fdm = scaled_volume_cm3 * price_filament + scaled_volume_cm3 * time_coef_fdm * price_machine_hour
    cost_dlp = scaled_volume_cm3 * price_resin + scaled_volume_cm3 * time_coef_dlp * price_machine_hour

    return jsonify({
        'x_dim': bbox[0],
        'y_dim': bbox[1],
        'z_dim': bbox[2],
        'scale': scale,
        'v_scaled': scaled_volume_cm3,
        'cost_fdm': cost_fdm,
        'cost_dlp': cost_dlp
    })


if __name__ == '__main__':
    app.run()
