let SC = require ("./SourceController.js")  //status , trigger
let Islanding = require("./Islanding.js") //Island

const Gpio = require('onoff').Gpio
const MS1t = new Gpio(14, 'in', 'rising', {debounceTimeout: 10})
const MS2t = new Gpio(15, 'in', 'rising', {debounceTimeout: 10})
const MS3t = new Gpio(18, 'in', 'rising', {debounceTimeout: 10})
const ISL = new Gpio(23, 'in', 'rising', {debounceTimeout: 10})
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
    var d2 = new Date()
    console.log('Attaching... ', d2.getSeconds(), d2.getMilliseconds())
    await Mam.attach(message.payload, message.address, 3, 9)
    var d3 = new Date()
    console.log('Published... ', d3.getSeconds(), d3.getMilliseconds(), packet, '\n')
    //console.log('Root: ', message.root, '\n')
    return message.root
}

const publishAll = async () => {
  //console.log('Publishing to IOTA...')
  const root = await publish({
    message: 'Microsource toggled / Islanding toggled',
    timestamp: ((new Date()).toLocaleString()),
    'remark': trig  //insert variable depending on commands
  })
  return root
}

//callback
const logData = data => {
  console.log('...')
}

const remark = function(x) {
  if (x == 4){
    Islanding.Island()
  }
  else {
    SC.trigger(x) //use fetched data, not stored variable
    //SC.status()
  }
}

MS1t.watch((err, value) => {
  if (err) {
    throw err
  }
  var d = new Date()
  console.log('MS1t... ', d.getSeconds(), d.getMilliseconds())
  trig = 1
  publishAll()
    .then(async root => {
      const result = await Mam.fetch(root, mode, null, logData)
      var d4 = new Date()
      console.log('Fetched... ', d4.getSeconds(), d4.getMilliseconds())
      var command
      result.messages.forEach(message => command =  JSON.parse(trytesToAscii(message)))
      toggle = command.remark
      remark(toggle)
      //console.log(`Verify with MAM Explorer:\n${mamExplorerLink}${root}\n`)
    })
})

MS2t.watch((err, value) => {
  if (err) {
    throw err
  }
  var d = new Date()
  console.log('MS2t... ', d.getSeconds(), d.getMilliseconds())
  trig = 2
  publishAll()
    .then(async root => {
      const result = await Mam.fetch(root, mode, null, logData)
      var d4 = new Date()
      console.log('Fetched... ', d4.getSeconds(), d4.getMilliseconds())
      var command
      result.messages.forEach(message => command =  JSON.parse(trytesToAscii(message)))
      toggle = command.remark
      remark(toggle)
      //console.log(`Verify with MAM Explorer:\n${mamExplorerLink}${root}\n`)
    })
})

MS3t.watch((err, value) => {
  if (err) {
    throw err
  }
  var d = new Date()
  console.log('MS3t... ', d.getSeconds(), d.getMilliseconds())
  trig = 3
  publishAll()
    .then(async root => {
      const result = await Mam.fetch(root, mode, null, logData)
      var d4 = new Date()
      console.log('Fetched... ', d4.getSeconds(), d4.getMilliseconds())
      var command
      result.messages.forEach(message => command =  JSON.parse(trytesToAscii(message)))
      toggle = command.remark
      remark(toggle)
      //console.log(`Verify with MAM Explorer:\n${mamExplorerLink}${root}\n`)
    })
})

ISL.watch((err, value) => {
  if (err) {
    throw err
  }
  var d = new Date()
  console.log('Islanding... ', d.getSeconds(), d.getMilliseconds())
  trig = 4
  publishAll()
    .then(async root => {
      const result = await Mam.fetch(root, mode, null, logData)
      var d4 = new Date()
      console.log('Fetched... ', d4.getSeconds(), d4.getMilliseconds())
      var command
      result.messages.forEach(message => command =  JSON.parse(trytesToAscii(message)))
      toggle = command.remark
      remark(toggle)
      //console.log(`Verify with MAM Explorer:\n${mamExplorerLink}${root}\n`)
    })
})
