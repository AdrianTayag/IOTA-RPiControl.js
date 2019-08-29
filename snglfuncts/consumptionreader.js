const ina219 = require('ina219')
ina219.init(0x45)
ina219.calibrate32V1A(function(){ console.log("RPi Tracker calibrated")})
var x, y

function measure() {
  ina219.getBusVoltage_V(respondV)
  ina219.getCurrent_mA(respondA)
}

function respondV (voltage) {
  x = voltage
}

function respondA (current) {
  y = current * x //milliwatts
  console.log(y)
}

setInterval(measure, 1000)
