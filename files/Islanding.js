//Node.js GPIO Script for Protection Manager, should be concurrently run
const Gpio = require('onoff').Gpio
//Islanding Button
const ISL = new Gpio(24, 'in', 'both') //assign new pin + add OR Gate


//Islanding/Connecting Function
const Island = function() {
  if (ISL.readSync() == 1){
    ISL.writeSync(0)
  }
  else {
    ISL.writeSync(1)
  }
}

module.exports = {
  Island
}
