const ina219 = require('ina219')
const fs = require('fs')
ina219.init(0x45)
ina219.calibrate32V1A(function(){ console.log("RPi Tracker calibrated")})
const power = []
var x, y
var z = 0

function measure() {
  ina219.getBusVoltage_V(respondV)
  ina219.getCurrent_mA(respondA)
  z = z+1
  console.log(z)
  if (z == 600) {
    clearInterval(record)
    fs.writeFile('trial.csv', power, (err) => {
      if (err) throw err
      console.log('The file has been saved!')
    })
  }
}

function respondV (voltage) {
  x = voltage
}

function respondA (current) {
  y = current * x //milliwatts
  power.push(y)
  console.log(y)
}

var record = setInterval(measure, 100)
