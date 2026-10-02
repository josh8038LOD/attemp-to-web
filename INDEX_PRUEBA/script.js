

//-- Acciones de formulario 
const cotizacionForm = document.getElementById('cotizacionForm');
const cotizacionMensaje = document.getElementById('cotizacionMensaje');
const cotArchivo = document.getElementById('cot-archivo');
const cotArchivoNombre = document.getElementById('cot-archivo-nombre');
const hiddenIframe = document.getElementById('hidden_iframe')
let formularioEnviado = false;
// 1. Mostrar el nombre del archivo seleccionado
cotArchivo?.addEventListener('change', () => {
    const file = cotArchivo.files?.[0];
    cotArchivoNombre.textContent = file ? `Archivo seleccionado: ${file.name}` : '';
});

cotizacionForm.addEventListener('submit', function (e) {

    // Oculta el mensaje de éxito previo si lo hubiera
    cotizacionMensaje.classList.add('hidden');

    // Validar el archivo 
    const file = cotArchivo.files?.[0];
    if (file) {
        const tamanoMaximoBytes = 10 * 1024 * 1024;
        if (file.size > tamanoMaximoBytes) {
            alert('El archivo es demasiado pesado. El tamaño máximo permitido es de 10 MB.');
            e.preventDefault();
            return;
        }

        const extensionesValidas = ['.pdf', '.dwg', '.dxf', '.jpg', '.jpeg', '.png'];
        const nombreArchivo = file.name.toLowerCase();
        const esValida = extensionesValidas.some(ext => nombreArchivo.endsWith(ext));

        if (!esValida) {
            alert('Formato de archivo no válido. Solo se permiten archivos PDF, DWG, DXF, JPG o PNG.');
            e.preventDefault();
            return;
        }
    }

    formularioEnviado = true;
});

hiddenIframe.addEventListener('load', function () {
    if (formularioEnviado) {
        // Mostrar mensaje de éxito
        cotizacionMensaje.classList.remove('hidden');

        // Limpiar el formulario
        cotizacionForm.reset();
        if (cotArchivoNombre) cotArchivoNombre.textContent = '';

        // Reiniciar la variable
        formularioEnviado = false;

        // Opcional: Ocultar el mensaje verde después de 5 segundos
        setTimeout(() => {
            cotizacionMensaje.classList.add('hidden');
        }, 5000);
    }
});

// --- Cursor personalizado---
const cursorDot = document.getElementById('cursorDot');
if (cursorDot && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    let x = window.innerWidth / 2, y = window.innerHeight / 2;
    let tx = x, ty = y;

    window.addEventListener('mousemove', (e) => {
        tx = e.clientX;
        ty = e.clientY;
    });

    (function seguirCursor() {
        x += (tx - x) * 0.22;
        y += (ty - y) * 0.22;
        cursorDot.style.left = `${x}px`;
        cursorDot.style.top = `${y}px`;
        requestAnimationFrame(seguirCursor);
    })();

    const interactivos = 'a, button, input, textarea, select, label, [role="button"]';
    document.addEventListener('mouseover', (e) => {
        if (e.target.closest(interactivos)) cursorDot.classList.add('is-hover');
    });
    document.addEventListener('mouseout', (e) => {
        if (e.target.closest(interactivos)) cursorDot.classList.remove('is-hover');
    });
}

// --- Fondo ---
function initStarfield(canvas, density = 0.00018) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w, h, stars = [];

    function resize() {
        w = canvas.width = canvas.offsetWidth;
        h = canvas.height = canvas.offsetHeight;
        const cantidad = Math.max(30, Math.floor(w * h * density));
        stars = Array.from({ length: cantidad }, () => ({
            x: Math.random() * w,
            y: Math.random() * h,
            r: Math.random() * 1.4 + 0.3,
            phase: Math.random() * Math.PI * 2,
            speed: 0.4 + Math.random() * 0.8,
            tono: Math.random()
        }));
    }

    function draw(t) {
        ctx.clearRect(0, 0, w, h);
        for (const s of stars) {
            const parpadeo = 0.5 + 0.5 * Math.sin(t * 0.001 * s.speed + s.phase);
            const alfa = 0.25 + parpadeo * 0.65;
            let color;
            if (s.tono < 0.34) color = `rgba(176,188,199,${alfa})`;
            else if (s.tono < 0.67) color = `rgba(255,255,255,${alfa})`;
            else color = `rgba(120,175,225,${alfa})`;
            ctx.beginPath();
            ctx.fillStyle = color;
            ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
            ctx.fill();
        }
        requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener('resize', resize);
    requestAnimationFrame(draw);
}

initStarfield(document.getElementById('heroStars'), 0.00018);
initStarfield(document.getElementById('sedesStars'), 0.00012);

// --- Modo ---
const temaToggle = document.getElementById('temaToggle');
const temaIconoSol = document.getElementById('temaIconoSol');
const temaIconoLuna = document.getElementById('temaIconoLuna');

function actualizarIconoTema() {
    const esOscuro = document.documentElement.classList.contains('dark');
    temaIconoSol?.classList.toggle('hidden', esOscuro);
    temaIconoLuna?.classList.toggle('hidden', !esOscuro);
}
actualizarIconoTema();

temaToggle?.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('tema', document.documentElement.classList.contains('dark') ? 'oscuro' : 'claro');
    actualizarIconoTema();
});

// --- Galerías de imágenes ---

const imagenes =
    document.querySelectorAll(".imagen");

let posiciones = [
    0,
    1,
    2,
    3,
    4
];

function actualizarCarrusel() {

    imagenes.forEach((imagen, indice) => {

        imagen.className =
            "imagen pos" + posiciones[indice];

    });

}

function mover(direccion) {

    if (direccion === 1) {

        posiciones.unshift(
            posiciones.pop()
        );

    } else {

        posiciones.push(
            posiciones.shift()
        );

    }
    actualizarCarrusel();
}
