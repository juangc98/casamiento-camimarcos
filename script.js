// Agregá esta función a tu archivo script.js
function generarEnlaces() {
    // 1. DATOS DEL CASAMIENTO
    const evento = {
        titulo: "Casamiento Cami y Marcos",
        descripcion: "17:30 en Espacio Tigre.",
        ubicacion: "Espacio Tigre, Buenos Aires",
        // Formato: YYYYMMDDTHHMMSSZ (En UTC)
        // Argentina es UTC-3. 17:30 hs (local) = 20:30 hs (UTC)
        inicio: "20261128T203000Z", 
        // Fin aproximado: 29 de Noviembre a las 04:00 AM (local) = 07:00 AM (UTC)
        fin: "20261129T070000Z"     
    };

    // Codificar textos para que las URLs no se rompan por los espacios o caracteres especiales
    const tituloEnc = encodeURIComponent(evento.titulo);
    const descEnc = encodeURIComponent(evento.descripcion);
    const ubiEnc = encodeURIComponent(evento.ubicacion);

    // 2. ENLACE GOOGLE CALENDAR
    const urlGoogle = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${tituloEnc}&dates=${evento.inicio}/${evento.fin}&details=${descEnc}&location=${ubiEnc}`;
    document.getElementById('btnGoogle').href = urlGoogle;

    // 3. ENLACE OUTLOOK WEB
    const urlOutlook = `https://outlook.live.com/calendar/0/deeplink/compose?path=/calendar/action/compose&rru=addevent&subject=${tituloEnc}&startdt=${evento.inicio}&enddt=${evento.fin}&body=${descEnc}&location=${ubiEnc}`;
    document.getElementById('btnOutlook').href = urlOutlook;

    // 4. ENLACE APPLE (Genera un archivo .ics que abre Apple Calendar o Outlook de escritorio)
    document.getElementById('btnApple').addEventListener('click', function(e) {
        e.preventDefault();
        
        // Estructura estándar del archivo iCalendar (.ics)
        const icsStructure = [
            "BEGIN:VCALENDAR",
            "VERSION:2.0",
            "PRODID:-//CasamientoCamiYMarcos//Calendario//ES",
            "BEGIN:VEVENT",
            `DTSTAMP:${evento.inicio}`,
            `DTSTART:${evento.inicio}`,
            `DTEND:${evento.fin}`,
            `SUMMARY:${evento.titulo}`,
            `DESCRIPTION:${evento.descripcion}`,
            `LOCATION:${evento.ubicacion}`,
            "END:VEVENT",
            "END:VCALENDAR"
        ].join("\r\n");

        // Crear un archivo virtual y forzar la descarga
        const blob = new Blob([icsStructure], { type: "text/calendar;charset=utf-8" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "Casamiento_Cami_y_Marcos.ics";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    });
}

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

    const mensajeExito = document.getElementById('mensaje-exito');
    const btnOtroInvitado = document.getElementById('btn-otro-invitado');

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
                formulario.hidden = true;
                mensajeExito.hidden = false;
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

    btnOtroInvitado.addEventListener('click', () => {
        window.location.reload();
    });

    generarEnlaces();
});