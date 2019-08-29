const ina219 = require('ina219')
ina219.init(0x45)
ina219.calibrate32V1A(function(){ console.log("RPi Tracker calibrated")})
var i = 1
var x, y
while (i == 1) {
  ina219.getBusVoltage_V(respondV)
  ina219.getCurrent_mA(respondA)
  await sleep(5000)
}

async function respondV (voltage) {
  x = voltage
}

async function respondA (current) {
  y = current * x //milliwatts
  console.log(y)
}

function sleep(ms){
    return new Promise(resolve=>{
        setTimeout(resolve,ms)
    })
}
