function generarEnlaces() {
    const evento = {
        titulo: "Wed | Cami y Marcos",
        descripcion: "17:30 en Espacio Tigre.",
        ubicacion: "Espacio Tigre, Buenos Aires",
        // UTC: Argentina UTC-3 → 17:30 local = 20:30 UTC
        inicio: "20261128T203000Z",
        fin: "20261129T070000Z",
        // Outlook needs ISO-8601 with dashes
        inicioIso: "2026-11-28T20:30:00Z",
        finIso: "2026-11-29T07:00:00Z"
    };

    const tituloEnc = encodeURIComponent(evento.titulo);
    const descEnc = encodeURIComponent(evento.descripcion);
    const ubiEnc = encodeURIComponent(evento.ubicacion);

    const btnGoogle = document.getElementById('btnGoogle');
    const btnOutlook = document.getElementById('btnOutlook');
    const btnApple = document.getElementById('btnApple');

    // Google Calendar
    btnGoogle.href = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${tituloEnc}&dates=${evento.inicio}/${evento.fin}&details=${descEnc}&location=${ubiEnc}`;

    // Outlook (ISO dates work more reliably on mobile)
    btnOutlook.href = `https://outlook.live.com/calendar/0/deeplink/compose?path=/calendar/action/compose&rru=addevent&subject=${tituloEnc}&startdt=${encodeURIComponent(evento.inicioIso)}&enddt=${encodeURIComponent(evento.finIso)}&body=${descEnc}&location=${ubiEnc}`;

    // .ics for Apple Calendar / other apps
    const icsStructure = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//CasamientoCamiYMarcos//Calendario//ES",
        "CALSCALE:GREGORIAN",
        "METHOD:PUBLISH",
        "BEGIN:VEVENT",
        "UID:casamiento-cami-marcos-20261128@espacio-tigre",
        `DTSTAMP:${evento.inicio}`,
        `DTSTART:${evento.inicio}`,
        `DTEND:${evento.fin}`,
        `SUMMARY:${evento.titulo}`,
        `DESCRIPTION:${evento.descripcion}`,
        `LOCATION:${evento.ubicacion}`,
        "END:VEVENT",
        "END:VCALENDAR"
    ].join("\r\n");

    const dataUrl = "data:text/calendar;charset=utf-8," + encodeURIComponent(icsStructure);
    btnApple.href = dataUrl;
    btnApple.setAttribute("download", "Casamiento_Cami_y_Marcos.ics");

    btnApple.addEventListener("click", function (e) {
        const isIOS =
            /iPad|iPhone|iPod/.test(navigator.userAgent) ||
            (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

        // iOS Safari ignores blob downloads; let the data: link open Calendar
        if (isIOS) {
            return;
        }

        e.preventDefault();
        const blob = new Blob([icsStructure], { type: "text/calendar;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "Casamiento_Cami_y_Marcos.ics";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const radioRestriccion = document.querySelectorAll('input[name="restriccion"]');
    const campoOtro = document.getElementById("campo-otro");
    const inputDetalleRestriccion = document.getElementById("detalle-restriccion");
    const formulario = document.getElementById("formulario-asistencia");
    const mensajeExito = document.getElementById("mensaje-exito");
    const btnOtroInvitado = document.getElementById("btn-otro-invitado");

    radioRestriccion.forEach((radio) => {
        radio.addEventListener("change", (e) => {
            if (e.target.value === "Otro") {
                campoOtro.style.display = "flex";
                inputDetalleRestriccion.required = true;
            } else {
                campoOtro.style.display = "none";
                inputDetalleRestriccion.required = false;
                inputDetalleRestriccion.value = "";
            }
        });
    });

    formulario.addEventListener("submit", (e) => {
        e.preventDefault();

        const formData = new FormData(formulario);
        const scriptURL =
            "https://script.google.com/macros/s/AKfycbyT4w-V9P5jaDkw8jJeYFl4g5wlkFxiO0CtTsoerPxY9US27CLY1FoUysAqeKtvPnr5/exec";

        const btnEnviar = formulario.querySelector(".btn-enviar");
        const textoOriginal = btnEnviar.textContent;
        btnEnviar.textContent = "ENVIANDO...";
        btnEnviar.disabled = true;

        fetch(scriptURL, { method: "POST", body: formData })
            .then(() => {
                formulario.hidden = true;
                mensajeExito.hidden = false;
                formulario.reset();
                campoOtro.style.display = "none";
                btnEnviar.textContent = textoOriginal;
                btnEnviar.disabled = false;
            })
            .catch((error) => {
                console.error("Error!", error.message);
                alert("Hubo un error al enviar. Por favor intentá de nuevo.");
                btnEnviar.textContent = textoOriginal;
                btnEnviar.disabled = false;
            });
    });

    if (btnOtroInvitado) {
        btnOtroInvitado.addEventListener("click", () => {
            window.location.reload();
        });
    }

    generarEnlaces();
});
