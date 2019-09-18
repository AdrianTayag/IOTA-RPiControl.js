var ina219_1 = require('ina219');
var ina219_2 = require('ina219');

ina219_1.init(0x40);
ina219_2.init(0x44);
//ina219.enableLogging(true);

/* ina219.calibrate32V1A(function () {

  ina219.getBusVoltage_V(function (volts) {

    console.log("Voltage: " + volts);
    ina219.getCurrent_mA(function (current){

      console.log("Current (mA): " + current );
    });
  });
}); */

var i = 0
var o = 0
var x = Array(9)
var y = Array(9)

ina219_1.calibrate32V1A(function(){ console.log("MS-1 calibrated")})
ina219_2.calibrate32V1A(function(){ console.log("MS-2 calibrated")})
ina219_1.getBusVoltage_V(respondV)
ina219_1.getCurrent_mA(respondA)
console.log(x)
console.log(y)
ina219_2.getBusVoltage_V(respondV)
ina219_2.getCurrent_mA(respondA)
console.log(x)
console.log(y)

function respondV (voltage) {
  x[i] = voltage
  i += 1
}

function respondA (current) {
  console.log(current)
  y[o] = current
  o += 1
}
