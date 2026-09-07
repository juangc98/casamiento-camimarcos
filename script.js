document.addEventListener('DOMContentLoaded', () => {
    const radioRestriccion = document.querySelectorAll('input[name="restriccion"]');
    const campoOtro = document.getElementById('campo-otro');
    const inputDetalleRestriccion = document.getElementById('detalle-restriccion');
    const formulario = document.getElementById('formulario-asistencia');

    // Lógica para mostrar/ocultar el input de "Otro"
    radioRestriccion.forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (e.target.value === 'Otro') {
                campoOtro.style.display = 'flex';
                inputDetalleRestriccion.required = true;
            } else {
                campoOtro.style.display = 'none';
                inputDetalleRestriccion.required = false;
                inputDetalleRestriccion.value = ''; // Limpia el valor si cambia de opción
            }
        });
    });

    // Lógica para el envío del formulario a Google Sheets
    formulario.addEventListener('submit', (e) => {
        e.preventDefault(); // Evita que recargue la página

        // Recolecta los datos
        const formData = new FormData(formulario);
        
        // ACÁ VA LA URL DE TU WEB APP DE GOOGLE APPS SCRIPT
        const scriptURL = 'https://script.google.com/macros/s/AKfycbyT4w-V9P5jaDkw8jJeYFl4g5wlkFxiO0CtTsoerPxY9US27CLY1FoUysAqeKtvPnr5/exec'; 

        // Cambiar el texto del botón mientras envía
        const btnEnviar = formulario.querySelector('.btn-enviar');
        const textoOriginal = btnEnviar.textContent;
        btnEnviar.textContent = 'ENVIANDO...';
        btnEnviar.disabled = true;

        fetch(scriptURL, { method: 'POST', body: formData })
            .then(response => {
                alert('¡Gracias por confirmar tu asistencia!');
                formulario.reset();
                campoOtro.style.display = 'none';
                btnEnviar.textContent = textoOriginal;
                btnEnviar.disabled = false;
            })
            .catch(error => {
                console.error('Error!', error.message);
                alert('Hubo un error al enviar. Por favor intentá de nuevo.');
                btnEnviar.textContent = textoOriginal;
                btnEnviar.disabled = false;
            });
    });
});