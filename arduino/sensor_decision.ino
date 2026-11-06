// ============================================
//  Sensor de decisión - Proyecto Normas de Tránsito
//  Manda "A" (paso) o "B" (paro) a la página web
// ============================================
//
// Conexión:
//  - Sensor/pulsador 1 (PASO)         -> pin 2 y GND
//  - Sensor/pulsador 2 (PARO)         -> pin 3 y GND
//  (se usa INPUT_PULLUP, así que no hacen falta resistencias:
//   el pin lee LOW cuando el sensor se activa)
//
// Si usan sensores infrarrojos de obstáculo, conecten la salida OUT
// al pin 2 y al pin 3 (también se activan en LOW).
//
// IMPORTANTE: cerrar el Monitor Serie antes de conectar la página.

const int PIN_AVANZO = 2;
const int PIN_CEDO = 3;

void setup() {
  Serial.begin(9600);                 // misma velocidad que la página
  pinMode(PIN_AVANZO, INPUT_PULLUP);
  pinMode(PIN_CEDO, INPUT_PULLUP);
}

void loop() {
  if (digitalRead(PIN_AVANZO) == LOW) {
    Serial.println("A");
    delay(1000);                      // espera para no mandar muchas veces
  }

  if (digitalRead(PIN_CEDO) == LOW) {
    Serial.println("B");
    delay(1000);
  }
}
