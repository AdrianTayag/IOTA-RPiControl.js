const Gpio = require('onoff').Gpio
const island = new Gpio(23, 'in', 'both')
const SD = new Gpio(10, 'out')
const ina219 = require('ina219')
ina219.init(0x45)
ina219.calibrate32V1A(function(){ console.log("RPi Tracker calibrated")})
const createCsvWriter = require('csv-writer').createObjectCsvWriter
const csvWriter = createCsvWriter({ path: './Measurement.csv' })
const power = ["Measured"]
var x, y
var trig

const Mam = require('../lib/mam.client.js')
const { asciiToTrytes, trytesToAscii } = require('@iota/converter')
const mode = 'public'
const provider = 'https://nodes.devnet.iota.org'
const mamExplorerLink = `https://mam-explorer.firebaseapp.com/?provider=${encodeURIComponent(provider)}&mode=${mode}&root=`

// Initialise MAM State
let mamState = Mam.init(provider)
// Publish to tangle
const publish = async packet => {
    const trytes = asciiToTrytes(JSON.stringify(packet))
    const message = Mam.create(mamState, trytes)
    mamState = message.state
    await Mam.attach(message.payload, message.address, 3, 9)
    console.log('Published at ', (new Date()).toLocaleString(), packet, '\n')
    console.log('Root: ', message.root, '\n')
    return message.root
}

const publishAll = async () => {
  console.log('Publishing to IOTA...')
  const root = await publish({
    message: 'Microsource toggled / Islanding toggled',
    timestamp: (new Date()).toLocaleString(),
    'remark': trig  //insert variable depending on commands
  })
  return root
}

//callback
const logData = data => {
  if (trig == 4){
    SD.writeSync(1)
    //Protecc.Island()
  }
}

function measure() {
  ina219.getBusVoltage_V(respondV)
  ina219.getCurrent_mA(respondA)
}

function respondV (voltage) {
  x = voltage
}

function respondA (current) {
  y = current * x //milliwatts
  power.push(y)
}

island.watch((err, value) => {
  if (err) {
    throw err
  }
  console.log('Island pressed at')
  console.log(new Date()).toLocaleString()
  var record = setInterval(measure, 500)
  trig = 4
  publishAll()
    .then(async root => {
      console.log('fetching...')
      const result = await Mam.fetch(root, mode, null, logData)
      var command
      result.messages.forEach(message => command =  JSON.parse(trytesToAscii(message)))
      console.log(`Verify with MAM Explorer:\n${mamExplorerLink}${root}\n`)
      console.log(new Date()).toLocaleString()
      clearInterval(record)
      csvWriter.writeRecords(records)       // returns a promise
        .then(() => {
          console.log('Done saving.')
        })
    })
})
