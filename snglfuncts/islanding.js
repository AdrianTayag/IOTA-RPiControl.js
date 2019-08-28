//Node.js GPIO Script for Protection Manager, should be concurrently run
const Gpio = require('onoff').Gpio
//Islanding Button
const ISL = new Gpio(24, 'in', 'both') //assign new pin + add OR Gate


//Islanding/Connecting Function
const Island = function(x) {
  SD.writeSync(x)
}

module.exports = {
  Island
}
