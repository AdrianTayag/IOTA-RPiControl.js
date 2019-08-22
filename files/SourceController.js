//Node.js GPIO Script for Protection Manager, not needed to be concurrently run.
const Gpio = require('onoff').Gpio
const ina219_1 = require('ina219')
const ina219_2 = require('ina219')
const ina219_3 = require('ina219')
//INA219
const MS_1_ADDR = 0x40
const MS_2_ADDR = 0x41
const MS_3_ADDR = 0x44 //45 for RPi measurement
//Relay
const ms1 = new Gpio(13, 'out')
const ms2 = new Gpio(19, 'out')
const ms3 = new Gpio(26, 'out')

var b1, b2, b3
var x = Array(3)
var y = Array(3)

//triggers called MS relay, input is 1 2 3
const trigger = function(x){
  if (x.readSync() = 0){
    x.writeSync(1)
  }
  else {
    x.writeSync(0)
  }
}

//measures MS outputs
const status = function() {
  var i = 0
  var o = 0

  ina219_1.init(MS_1_ADDR)
  ina219_2.init(MS_2_ADDR)
  ina219_3.init(MS_3_ADDR)
  ina219_1.calibrate32V1A(function(){ console.log("MS-1 calibrated")})
  ina219_2.calibrate32V1A(function(){ console.log("MS-2 calibrated")})
  ina219_3.calibrate32V1A(function(){ console.log("MS-3 calibrated")})
  ina219_1.getBustVoltage_V(respondV)
  ina219_1.getCurrent_mA(respondA)
  ina219_2.getBustVoltage_V(respondV)
  ina219_2.getCurrent_mA(respondA)
  ina219_3.getBustVoltage_V(respondV)
  ina219_3.getCurrent_mA(respondA)
  b1 = ms1.readSync()
  b2 = ms2.readSync()
  b3 = ms3.readSync()

  var stats = {
    message: 'Protection Coordinator Report',
    timestamp: (new Date()).toLocaleString()
    'MS1_V': x[0],
    'MS1_P': y[0],
    'MS2_V': x[1],
    'MS2_P': y[1],
    'MS3_V': x[2],
    'MS3_P': y[2],
    'MS Breakers': {
      'MS-1': b1
      'MS-2': b2
      'MS-3': b3
    }
  }
  console.log(stats)
  //console.log(stats)
  return stats
}
//callbacks for ina219
function respondV (voltage) {
  x[i] = voltage
  i += 1
}

function respondA (current) {
  y[o] = current * x[o] //milliwatts
  o += 1
}

module.exports = {
  status,
  trigger
}
