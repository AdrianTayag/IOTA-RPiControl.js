//Node.js GPIO Script for Protection Manager, not needed to be concurrently run.
const Gpio = require('onoff').Gpio
//Relay
const ms1 = new Gpio(13, 'out')
const ms2 = new Gpio(19, 'out')
const ms3 = new Gpio(26, 'out')
var b1, b2, b3

//triggers called MS relay, input is 1 2 3
const trigger = function(x){
  console.log(x)
  if (x == 1){
  if (ms1.readSync() == 1){
    ms1.writeSync(0)
  }
  else {
    ms1.writeSync(1)
  }
  }
  if (x == 2){
  if (ms2.readSync() == 1){
    ms2.writeSync(0)
  }
  else {
    ms2.writeSync(1)
  }
  }
  if (x == 3){
  if (ms3.readSync() == 1){
    ms3.writeSync(0)
  }
  else {
    ms3.writeSync(1)
  }
  }}
//measures MS outputs
const status = function() {
  console.log("reporting")
  b1 = ms1.readSync()
  b2 = ms2.readSync()
  b3 = ms3.readSync()

  var stats = {
    message: 'Protection Coordinator Report',
    timestamp: (new Date()).toLocaleString(),
    'MS Breakers': {
      'MS-1': b1,
      'MS-2': b2,
      'MS-3': b3,
    }
  }
  console.log(stats)
  return stats
}
module.exports = {
  status,
  trigger
}
