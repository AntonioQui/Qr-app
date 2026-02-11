// Número inicial o almacenado
let numero = localStorage.getItem("qrNumber") || "00512146078";

const numeroEl = document.getElementById("numero");
const qrEl = document.getElementById("qr");

// QR generator
let qr = new QRious({
  element: document.createElement("canvas"),
  size: 250,
  value: numero
});
qrEl.appendChild(qr.element);

// Mostrar número en pantalla
function actualizarUI() {
  numeroEl.textContent = numero;
  qr.value = numero;
  localStorage.setItem("qrNumber", numero);
}

actualizarUI();

// Restar 1
function restar() {
  let n = parseInt(numero, 10);
  n = n - 1;

  // Mantener ceros a la izquierda
  numero = n.toString().padStart(11, "0");

  actualizarUI();
}

// Sumar 1
function sumar() {
  let n = parseInt(numero, 10);
  n = n + 1;

  // Mantener ceros a la izquierda
  numero = n.toString().padStart(11, "0");

  actualizarUI();
}

// Copiar al portapapeles
function copiar() {
  navigator.clipboard.writeText(numero)
    .catch(() => alert("Error al copiar"));
}

// Registrar service worker (PWA)
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js");
}
let html5QrCode;

// Iniciar cámara
function iniciarScanner() {

  const reader = document.getElementById("reader");
  reader.style.display = "block";

  html5QrCode = new Html5Qrcode("reader");

  Html5Qrcode.getCameras().then(devices => {
    if (devices && devices.length) {

      let cameraId = devices[0].id; // Cámara trasera normalmente

      html5QrCode.start(
        cameraId,
        {
          fps: 10,
          qrbox: 250
        },
        (decodedText) => {
          // 🔥 Cuando detecta un QR

          numero = decodedText.padStart(11, "0");
          actualizarUI();

          html5QrCode.stop();
          reader.style.display = "none";
        },
        (errorMessage) => {
          // errores de escaneo (puedes ignorarlos)
        }
      );
    }
  }).catch(err => {
    alert("Error accediendo a la cámara");
  });
}
