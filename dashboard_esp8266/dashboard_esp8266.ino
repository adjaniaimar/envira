#include <DHT.h>

// PIN CONFIG
#define DHTPIN   D4       // DHT11 DATA -> D4 (GPIO2)
#define DHTTYPE  DHT11
#define POT_PIN  A0       // POTENTIOMETER WIPER -> A0

DHT dht(DHTPIN, DHTTYPE);

// SENSOR VARIABLES
float temperature = 0;
float humidity = 0;
int   potValue = 0;

unsigned long lastRead = 0;
const unsigned long READ_INTERVAL = 2000; // SENSOR READ EVERY 2 SEC

// SETUP
void setup() {
  Serial.begin(115200);
  dht.begin();
  delay(500);
  Serial.println("ENVIRA ready - sending data every 2 seconds over Serial (USB).");
}

// LOOP
void loop() {
  unsigned long now = millis();
  if (now - lastRead >= READ_INTERVAL) {
    lastRead = now;

    float h = dht.readHumidity();
    float t = dht.readTemperature();

    // RECHECK DHT11
    if (!isnan(h) && !isnan(t)) {
      temperature = t;
      humidity = h;
    } else {

    }

    potValue = analogRead(POT_PIN);

    // SEND DATA IN JSON FORMAT
    String json = "{";
    json += "\"temperature\":" + String(temperature, 1) + ",";
    json += "\"humidity\":" + String(humidity, 1) + ",";
    json += "\"pot\":" + String(potValue) + ",";
    json += "\"uptime\":" + String(millis() / 1000);
    json += "}";
    Serial.println(json);
  }
}
