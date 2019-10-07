//Node.js GPIO Script for Protection Manager, should be concurrently run
const Gpio = require('onoff').Gpio
//Islanding Button
const SD = new Gpio(10, 'out') //assign new pin + add OR Gate


//Islanding/Connecting Function
const Island = function() {
  if (err) {
    throw err
  }
  if (SD.readSync() == 1){
    SD.writeSync(0)
  }
  else {
    SD.writeSync(1)
  }
}

module.exports = {
  Island
}

Island()
