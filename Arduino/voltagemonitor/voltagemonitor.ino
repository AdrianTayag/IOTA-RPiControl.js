int but = 0;
int timer = 0;
void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
}

void loop() {
  // put your main code here, to run repeatedly:
  int sensorValue = analogRead(A0);
  int button = digitalRead(A1);
  float voltage= sensorValue * (5.0 / 1023.0);
  if (button == HIGH && but == 0) {
    but = 1;
    Serial.println("button pressed.");
  }
  if (but == 1 && voltage > 4.0){
    Serial.println(timer);
    but = 0;
  }
  if (but == 1) {
    timer = timer + 1;
  }
  delay(1);
}
