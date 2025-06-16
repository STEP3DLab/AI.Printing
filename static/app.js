document.getElementById('estimate-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    const form = e.target;
    const data = new FormData(form);
    try {
        const resp = await fetch('/estimate', {
            method: 'POST',
            body: data
        });
        const json = await resp.json();
        if (!resp.ok) {
            alert(json.error || 'Ошибка сервера');
            return;
        }
    document.getElementById('tech-header').textContent = json.technology === 'fdm' ? 'FDM печать' : 'DLP печать';
    document.getElementById('print-cost').textContent = json.cost.toFixed(2);
        const tableBody = document.getElementById('result-table');
        tableBody.innerHTML = '';
        const row = document.createElement('tr');
        row.innerHTML = `<td>${json.x_dim.toFixed(2)}</td><td>${json.y_dim.toFixed(2)}</td><td>${json.z_dim.toFixed(2)}</td><td>${json.scale.toFixed(3)}</td><td>${json.v_scaled.toFixed(2)}</td>`;
        tableBody.appendChild(row);
        document.getElementById('results').style.display = 'block';
    } catch (err) {
        alert('Ошибка: ' + err.message);
    }
});
