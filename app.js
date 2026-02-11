// Número inicial o almacenado
let numero = localStorage.getItem("qrNumber") || "00";

const numeroEl = document.getElementById("numero");
const qrEl = document.getElementById("qr");

let qr = new QRious({
  element: document.createElement("canvas"),
  size: 250,
  value: numero
});

qrEl.appendChild(qr.element);

function actualizarUI() {
  numeroEl.textContent = numero;
  qr.value = numero;
  localStorage.setItem("qrNumber", numero);
}

actualizarUI();

// Restar
function restar() {
  let n = parseInt(numero, 10);
  n = Math.max(0, n - 1);
  numero = n.toString().padStart(11, "0");
  actualizarUI();
}

// Sumar
function sumar() {
  let n = parseInt(numero, 10);
  n = n + 1;
  numero = n.toString().padStart(11, "0");
  actualizarUI();
}

// Copiar
function copiar() {
  navigator.clipboard.writeText(numero)
    .catch(() => alert("Error al copiar"));
}

// -------- SCANNER --------

let html5QrCode;

function iniciarScanner() {

  const reader = document.getElementById("reader");
  reader.style.display = "block";

  html5QrCode = new Html5Qrcode("reader");

  Html5Qrcode.getCameras().then(devices => {
    if (devices.length) {

      // Intentar usar cámara trasera
      const backCamera = devices.find(d =>
        d.label.toLowerCase().includes("back")
      );

      const cameraId = backCamera ? backCamera.id : devices[0].id;

      html5QrCode.start(
        cameraId,
        {
          fps: 10,
          qrbox: 250
        },
        (decodedText) => {

          if (/^\d+$/.test(decodedText)) {
            numero = decodedText.padStart(11, "0");
            actualizarUI();
          } else {
            alert("El QR no contiene solo números");
          }

          html5QrCode.stop();
          reader.style.display = "none";
        }
      );
    }
  }).catch(() => {
    alert("Error accediendo a la cámara");
  });
}

// Registrar SW
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js");
}
