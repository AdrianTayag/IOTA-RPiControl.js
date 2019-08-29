const ina219 = require('ina219')
ina219.init(0x45)
ina219.calibrate32V1A(function(){ console.log("RPi Tracker calibrated")})
var i = 1
var x, y
while (i == 1) {
  ina219.getBusVoltage_V(respondV)
  setTimeout(power, 1000)
}

const power() {
  ina219.getCurrent_mA(respondA)
}

async function respondV (voltage) {
  x = voltage
}

async function respondA (current) {
  y = current * x //milliwatts
  console.log(y)
}
