//Node.js GPIO Script for Protection Manager, should be concurrently run
const Gpio = require('onoff').Gpio
//Breakers, connect to normally closed (NC)
const PCC = new Gpio(22, 'out')
const SD = new Gpio(10, 'out')
const B1 = new Gpio(9, 'out')
//Zone Fault Triggers
const Z1 = new Gpio(25, 'in', 'both')
const Z2 = new Gpio(8, 'in', 'both')
//Islanding Button
const ISL = new Gpio(24, 'in', 'both')

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

const runtime = function() {
  ISL.watch((err,value) =>{
    if (err) {
      throw err
    }
    console.log("ISL Pressed.")
    SD.writeSync(value)
  })
  //Fault Watcher
  Z1.watch((err, value) => {
    if (err) {
      throw err
    }
    console.log("Z1 Pressed.")
    PCC.writeSync(value)
    Island(value)
  })

  Z2.watch((err, value) => {
    if (err) {
      throw err
    }
    console.log("Z2 Pressed.")
    SD.writeSync(value)
    B1.writeSync(value)
  })
}

runtime()

module.exports = {
  PCstatus,
  Island
}
