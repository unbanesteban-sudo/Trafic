// LAS 5 ESQUINAS
// calle = por donde voy yo, cruce = la otra calle, lado = de donde viene el otro auto
// videoAvanzar y videoCeder = el video que se ve segun lo que elija
let esquinas = [
  { calle: "San Luis", cruce: "Rivadavia", lado: "derecha", videoAvanzar: "videos/1-avanzar.mp4", videoCeder: "videos/1-ceder.mp4" },
  { calle: "Rivadavia", cruce: "Elordi", lado: "derecha", videoAvanzar: "videos/2-avanzar.mp4", videoCeder: "videos/2-ceder.mp4" },
  { calle: "Santa Cruz", cruce: "Alem", lado: "izquierda", videoAvanzar: "videos/3-avanzar.mp4", videoCeder: "videos/3-ceder.mp4" },
  { calle: "Belgrano", cruce: "Alberdi", lado: "izquierda", videoAvanzar: "videos/4-avanzar.mp4", videoCeder: "videos/4-ceder.mp4" },
  { calle: "Eguinoa", cruce: "Nolasco", lado: "derecha", videoAvanzar: "videos/5-avanzar.mp4", videoCeder: "videos/5-ceder.mp4" }
];

// LO QUE VA GUARDANDO EL JUEGO
let nombre = "";
let numero = 0;      // en que esquina estoy (la primera es la 0)
let puntos = 0;
let bien = 0;
let mal = 0;
let yaRespondio = false;


// 1. EMPEZAR

function empezar() {
  nombre = document.getElementById("nombre").value;

  if (nombre == "") {
    document.getElementById("avisoNombre").textContent = "Primero escribí tu nombre.";
    return;
  }

  document.getElementById("jugador").textContent = nombre;
  document.getElementById("pantallaInicio").style.display = "none";
  document.getElementById("pantallaJuego").style.display = "block";
  document.getElementById("videoFondo").pause(); // freno el video del inicio

  mostrarEsquina();
}


// 2. MOSTRAR LA ESQUINA

function mostrarEsquina() {
  let esquina = esquinas[numero];

  document.getElementById("numeroSituacion").textContent = "Situación " + (numero + 1) + " de 5";
  document.getElementById("esquina").textContent = esquina.calle + " y " + esquina.cruce;
  document.getElementById("situacion").textContent = "Circulo por " + esquina.calle + ". Un auto viene por " + esquina.cruce + " desde mi " + esquina.lado + ".";

  document.getElementById("pregunta").style.display = "none";
  document.getElementById("resultado").style.display = "none";
  yaRespondio = false;

  // el video siempre empieza con el de avanzar
  document.getElementById("video").src = esquina.videoAvanzar;
  document.getElementById("video").play();
}

// se ejecuta todo el tiempo mientras el video avanza
function pararEnDos() {
  let video = document.getElementById("video");

  // cuando llega al segundo 2, lo freno y muestro la pregunta
  if (video.currentTime >= 2 && yaRespondio == false) {
    video.pause();
    document.getElementById("pregunta").style.display = "block";
  }
}


// 3. RESPONDER ("avanzar" o "ceder")

function responder(opcion) {
  if (yaRespondio) {
    return;
  }
  yaRespondio = true;
  document.getElementById("pregunta").style.display = "none";

  let esquina = esquinas[numero];

  // regla de la derecha: si viene por la derecha cedo, si no avanzo
  let correcta = "avanzar";
  if (esquina.lado == "derecha") {
    correcta = "ceder";
  }

  let color;

  if (opcion == correcta) {
    puntos = puntos + 10;
    bien = bien + 1;
    color = "lightgreen";
    document.getElementById("textoResultado").textContent = "¡Muy bien, " + nombre + "!";
  } else if (opcion == "avanzar") {
    mal = mal + 1;
    color = "red";
    document.getElementById("textoResultado").textContent = "¡Chocaste!";
  } else {
    mal = mal + 1;
    color = "red";
    document.getElementById("textoResultado").textContent = "Frenaste de más, te tocan bocina.";
  }

  document.getElementById("textoResultado").style.color = color;

  if (correcta == "ceder") {
    document.getElementById("explicacion").textContent = "Había que ceder el paso: el auto que viene por " + esquina.cruce + " está a mi derecha y tiene prioridad.";
  } else {
    document.getElementById("explicacion").textContent = "Había que avanzar: el auto que viene por " + esquina.cruce + " está a mi izquierda, la prioridad es mía.";
  }

  document.getElementById("puntaje").textContent = puntos;

  // agrego la respuesta a la lista del final
  let item = document.createElement("li");
  item.textContent = esquina.calle + " y " + esquina.cruce + ": " + opcion;
  item.style.color = color;
  document.getElementById("historial").appendChild(item);

  // el video: si avanza sigue el mismo, si cede cambio al otro video
  if (opcion == "ceder") {
    document.getElementById("video").src = esquina.videoCeder;
  }
  document.getElementById("video").play();
}

// cuando termina el video, muestro el resultado
function terminoVideo() {
  document.getElementById("resultado").style.display = "block";
}


// 4. SIGUIENTE ESQUINA

function siguiente() {
  numero = numero + 1;

  if (numero < 5) {
    mostrarEsquina();
  } else {
    terminar();
  }
}


// 5. TERMINAR

function terminar() {
  document.getElementById("pantallaJuego").style.display = "none";
  document.getElementById("pantallaFinal").style.display = "block";

  let porcentaje = Math.round(bien * 100 / 5);

  document.getElementById("tituloFinal").textContent = "¡Terminaste, " + nombre + "!";
  document.getElementById("puntosFinal").textContent = puntos;
  document.getElementById("porcentaje").textContent = porcentaje + "%";

  // grafica de torta con la libreria Chart.js: bien contra mal
  new Chart(document.getElementById("grafico"), {
    type: "doughnut",
    data: {
      labels: ["Bien", "Mal"],
      datasets: [{
        data: [bien, mal],
        backgroundColor: ["green", "red"]
      }]
    }
  });
}


// LOS BOTONES Y EL VIDEO

document.getElementById("botonJugar").onclick = empezar;
document.getElementById("botonA").onclick = function () { responder("avanzar"); };
document.getElementById("botonB").onclick = function () { responder("ceder"); };
document.getElementById("botonSiguiente").onclick = siguiente;
document.getElementById("botonReiniciar").onclick = function () { location.reload(); }; // recarga la pagina
document.getElementById("botonConectar").onclick = conectarArduino;
document.getElementById("video").ontimeupdate = pararEnDos;  // mientras el video avanza
document.getElementById("video").onended = terminoVideo;     // cuando el video termina


// ARDUINO
// El Arduino manda una letra por USB: "A" = avanzo, "B" = cedo el paso.
// Solo funciona en Google Chrome o Edge.

async function conectarArduino() {
  let puerto = await navigator.serial.requestPort(); // elijo el puerto USB
  await puerto.open({ baudRate: 9600 });            // misma velocidad que el Arduino
  document.getElementById("estadoArduino").textContent = "¡Arduino conectado!";

  let lector = puerto.readable.pipeThrough(new TextDecoderStream()).getReader();

  // me quedo escuchando lo que manda el Arduino
  while (true) {
    let dato = await lector.read();

    if (dato.value.includes("A")) {
      responder("avanzar");
    }
    if (dato.value.includes("B")) {
      responder("ceder");
    }
  }
}
