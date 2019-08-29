const ina219 = require('ina219')
ina219.init(0x45)
ina219.calibrate32V1A(function(){ console.log("RPi Tracker calibrated")})
var i = 1
var x, y
while (i == 0) {
  ina219.getBustVoltage_V(respondV)
  ina219.getCurrent_mA(respondA)
}

async function respondV (voltage) {
  x = voltage
}

async function respondA (current) {
  y = current * x //milliwatts
  console.log(y)
  await sleep(1000);
}

function sleep(ms){
    return new Promise(resolve=>{
        setTimeout(resolve,ms)
    })
}
