const ina219 = require('ina219')
const ina219_1 = require('ina219')
const fs = require('fs')
ina219.init(0x45)
ina219_1.init(0x44)
ina219.calibrate32V1A(function(){ console.log("RPi Tracker calibrated")})
ina219_1.calibrate32V1A(function(){ console.log("RPi Tracker 2 calibrated")})
const power = []
const power_1 = []
var x, y
var z = 0

function measure() {
  ina219.getBusVoltage_V(respondV)
  ina219.getCurrent_mA(respondA)
  ina219_1.getBusVoltage_V(respondV)
  ina219_1.getCurrent_mA(respondA_1)
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

function respondA_1 (current) {
  y = current * x //milliwatts
  power_1.push(y)
  console.log('1st ', y)
}

var record = setInterval(measure, 500)
