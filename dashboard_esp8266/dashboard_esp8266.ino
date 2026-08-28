#include <DHT.h>

// PIN CONFIG
#define DHTPIN   D4       // DHT11 DATA -> D4 (GPIO2)
#define DHTTYPE  DHT11
#define POT_PIN  A0       // WIPER POTENSIO -> A0

DHT dht(DHTPIN, DHTTYPE);

// SENSOR VARIABLE
float suhu = 0;
float kelembapan = 0;
int   nilaiPot = 0;

unsigned long lastRead = 0;
const unsigned long INTERVAL_BACA = 2000; // SENSOR READ EVERY 2 SEC

// SETUP
void setup() {
  Serial.begin(115200);
  dht.begin();
  delay(500);
  Serial.println("ENVIRA siap - kirim data tiap 2 detik lewat Serial (USB).");
}

// LOOP
void loop() {
  unsigned long sekarang = millis();
  if (sekarang - lastRead >= INTERVAL_BACA) {
    lastRead = sekarang;

    float h = dht.readHumidity();
    float t = dht.readTemperature();

    // RECHECK DHT11
    if (!isnan(h) && !isnan(t)) {
      suhu = t;
      kelembapan = h;
    } else {

    }

    nilaiPot = analogRead(POT_PIN);

    // SEND DATA IN JSON FORMAT
    String json = "{";
    json += "\"suhu\":" + String(suhu, 1) + ",";
    json += "\"kelembapan\":" + String(kelembapan, 1) + ",";
    json += "\"pot\":" + String(nilaiPot) + ",";
    json += "\"uptime\":" + String(millis() / 1000);
    json += "}";
    Serial.println(json);
  }
}
