const ina219 = require('ina219')
ina219.init(0x45)
ina219.calibrate32V1A(function(){ console.log("RPi Tracker calibrated")})
const createCsvWriter = require('csv-writer').createObjectCsvWriter
var path = './trial' + (process.argv[3]) + '.csv'
const csvWriter = createCsvWriter({ path: path })
const power = ["Measured"]
var x, y, z

function measure() {
  ina219.getBusVoltage_V(respondV)
  ina219.getCurrent_mA(respondA)
  z = z+1
  console.log(z)
  if (z > 60) {
    clearInterval(record)
    csvWriter.writeRecords(records)       // returns a promise
      .then(() => {
        console.log('Done saving.')
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

var record = setInterval(measure, 500)
