//Node.js GPIO Script for Protection Manager, should be concurrently run
const Gpio = require('onoff').Gpio
//Breakers, connect to normally closed (NC)
const PCC = new Gpio(22, 'out')
const SD = new Gpio(10, 'out')
const B1 = new Gpio(9, 'out')
const B2 = new Gpio(11, 'out')
const B3 = new Gpio(5, 'out')
const B4 = new Gpio(6, 'out')
//Zone Fault Triggers
const Z1 = new Gpio(25, 'in', 'both', {debounceTimeout: 10})
const Z2 = new Gpio(8, 'in', 'both', {debounceTimeout: 10})
const Z3 = new Gpio(7, 'in', 'both', {debounceTimeout: 10})
const Z4 = new Gpio(12, 'in', 'both', {debounceTimeout: 10})
const Z5 = new Gpio(16, 'in', 'both', {debounceTimeout: 10})
const Z6 = new Gpio(20, 'in', 'both', {debounceTimeout: 10})
const Z7 = new Gpio(21, 'in', 'both', {debounceTimeout: 10})
//Islanding Button
const ISL = new Gpio(24, 'in', 'both', {debounceTimeout: 10})

const PCstatus = function() {
  var br1, br2, br3, br4, pcc1, sd1
  br1 = B1.readSync()
  br2 = B2.readSync()
  br3 = B3.readSync()
  br4 = B4.readSync()
  pcc1 = PCC.readSync()
  sd1 = SD.readSync()
  var stats = {
    message: 'Protection Coordinator Report',
    timestamp: ((new Date()).toLocaleString()),
    'SAFETY': {
      'B1': br1,
      'B2': br2,
      'B3': br3,
      'B4': br4,
    },
    'PCC': pcc1,
    'SD': sd1
  }
  console.log(stats)
  return stats
}

ISL.watch((err,value) =>{
  if (err) {
    throw err
  }
  console.log("Islanding.")
  SD.writeSync(value)
})
  //Fault Watcher
Z1.watch((err, value) => {
  if (err) {
    throw err
  }
  console.log("Z1 isolated.")
  PCC.writeSync(value)
  Island(value)
})

Z2.watch((err, value) => {
  if (err) {
    throw err
  }
  console.log("Z2 isolated.")
  SD.writeSync(value)
  B1.writeSync(value)
})

Z3.watch((err, value) => {
  if (err) {
    throw err
  }
  console.log("Z3 isolated.")
  B1.writeSync(value)
  B2.writeSync(value)
})

Z4.watch((err, value) => {
  if (err) {
    throw err
  }
  console.log("Z4 isolated.")
  B2.writeSync(value)
})

Z5.watch((err, value) => {
  if (err) {
    throw err
  }
  console.log("Z5 isolated.")
  B3.writeSync(value)
  B4.writeSync(value)
})

Z6.watch((err, value) => {
  if (err) {
    throw err
  }
  console.log("Z6 isolated.")
  B4.writeSync(value)
})

Z7.watch((err, value) => {
  if (err) {
    throw err
  }
  console.log("Z7 isolated.")
  PCC.writeSync(value)
  Island(value)
})

module.exports = {
  PCstatus
}
