//Node.js GPIO Script for Protection Manager, should be concurrently run
const Gpio = require('onoff').Gpio
//Breakers, connect to normally closed (NC)
const PCC = new Gpio(22, 'out')
const SD = new Gpio(10, 'out')
const B1 = new Gpio(9, 'out')
//Zone Fault Triggers
const Z1 = new Gpio(25, 'in', 'both', {debounceTimeout: 10})
const Z2 = new Gpio(8, 'in', 'both', {debounceTimeout: 10})
//Islanding Button
const ISL = new Gpio(24, 'in', 'both', {debounceTimeout: 10})

var d = new Date()

const PCstatus = function() {
  var br1, br2, br3, br4, pcc1, sd1
  br1 = B1.readSync()
  pcc1 = PCC.readSync()
  sd1 = SD.readSync()
  var stats = {
    message: 'Protection Coordinator Report',
    timestamp: (new Date()).toLocaleString(),
    'SAFETY': {
      'B1': br1,
    },
    'PCC': pcc1,
    'SD': sd1,
  }
  console.log(stats)
  return stats
}

//Islanding/Connecting Function
const Island = function(x) {
  SD.writeSync(x)
}

ISL.watch((err,value) =>{
  if (err) {
    throw err
  }
  d = new Date()
  console.log(d)
  console.log("ISL Pressed.")
  SD.writeSync(value)
  d = new Date()
  console.log(d)
})
//Fault Watcher
Z1.watch((err, value) => {
  if (err) {
    throw err
  }
  d = new Date()
  console.log(d)
  console.log("Z1 Pressed.")
  PCC.writeSync(value)
  Island(value)
  d = new Date()
  console.log(d)
})

Z2.watch((err, value) => {
  if (err) {
  throw err
  }
  d = new Date()
  console.log(d)
  console.log("Z2 Pressed.")
  SD.writeSync(value)
  B1.writeSync(value)
  d = new Date()
  console.log(d)
})


module.exports = {
  PCstatus,
  Island
}
