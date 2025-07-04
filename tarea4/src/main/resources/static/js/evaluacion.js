let actividadActualId = null;
let modal;

document.addEventListener('DOMContentLoaded', function() {
    modal = new bootstrap.Modal(document.getElementById('evaluacionModal'));

    cargarActividades();
    
    document.getElementById('confirmarEvaluacion').addEventListener('click', evaluarActividad);
});

function cargarActividades() {
    fetch('/api/actividades/para-evaluar')
        .then(response => response.json())
        .then(data => {
            const tabla = document.getElementById('actividadesTable');
            tabla.innerHTML = '';

            data.forEach(actividad => {
                const row = document.createElement('tr');
                
                row.innerHTML = `
                    <td>${actividad.id}</td>
                    <td>${formatFecha(actividad.fechaInicio)}</td>
                    <td>${actividad.sector}</td>
                    <td>${actividad.nombre}</td>
                    <td>${actividad.temas}</td>
                    <td class="nota-promedio">${actividad.notaPromedio}</td>
                    <td>
                        <span class="evaluar-btn" 
                              onclick="mostrarModalEvaluacion(${actividad.id}, '${actividad.nombre}')">
                            evaluar
                        </span>
                    </td>
                `;
                
                tabla.appendChild(row);
            });
        })
        .catch(error => console.error('Error al cargar actividades:', error));
}

function mostrarModalEvaluacion(id, nombre) {
    actividadActualId = id;
    document.getElementById('actividadNombre').textContent = nombre;
    modal.show();
}

function evaluarActividad() {
    const nota = parseInt(document.getElementById('notaInput').value);
    
    fetch(`/api/actividades/${actividadActualId}/evaluar`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nota: nota })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al evaluar');
        }
        return response.json();
    })
    .then(data => {
        const rows = document.querySelectorAll('#actividadesTable tr');
        rows.forEach(row => {
            if (row.cells[0].textContent == actividadActualId) {
                row.cells[5].textContent = data.nuevoPromedio;
            }
        });
        
        modal.hide();
    })
    .catch(error => {
        console.error('Error:', error);
        alert(error.message);
    });
}

function formatFecha(fechaStr) {
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString('es-CL');
}

window.mostrarModalEvaluacion = mostrarModalEvaluacion;