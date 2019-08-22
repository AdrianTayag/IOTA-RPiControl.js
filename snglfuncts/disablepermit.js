//Node.js GPIO Script for Protection Manager, not needed to be concurrently run.
const Gpio = require('onoff').Gpio
//Relay
const ms1 = new Gpio(13, 'out')
const ms2 = new Gpio(19, 'out')
const ms3 = new Gpio(26, 'out')
var b1, b2, b3

//triggers called MS relay, input is 1 2 3
const trigger = function(x){
  if (x.readSync() = 1){
    x.writeSync(0)
  }
  else {
    x.writeSync(1)
  }
}

//measures MS outputs
const status = function() {
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
