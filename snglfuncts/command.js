let SC = require ("./disablepermit.js")

const Gpio = require('onoff').Gpio
const MS1t = new Gpio(14, 'in', 'rising', {debounceTimeout: 10})
const MS2t = new Gpio(15, 'in', 'rising', {debounceTimeout: 10})
const MS3t = new Gpio(18, 'in', 'rising', {debounceTimeout: 10})
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
    console.log('Published at ', Date().toLocaleString(), packet, '\n');
    console.log('Root: ', message.root, '\n');
    return message.root
}

const publishAll = async () => {
  const root = await publish({
    message: 'Microsource toggled',
    timestamp: (new Date()).toLocaleString(),
    'remark': trig  //insert variable depending on commands
  })
  return root
}

//callback
const logData = data => {
  if (trig == 4){
    Protecc.Island()
  }  else{
    SC.trigger(trig) //use fetched data, not stored variable
  }
}

MS1t.watch((err, value) => {
  if (err) {
    throw err
  }
  trig = 1
  publishAll()
    .then(async root => {
      const result = await Mam.fetch(root, mode, null, logData)
      var command
      result.messages.forEach(message => command =  JSON.parse(trytesToAscii(message)))
      console.log(`Verify with MAM Explorer:\n${mamExplorerLink}${root}\n`);
    })
})
MS2t.watch((err, value) => {
  if (err) {
    throw err
  }
  trig = 2
  publishAll()
    .then(async root => {
      const result = await Mam.fetch(root, mode, null, logData)
      var command
      result.messages.forEach(message => command =  JSON.parse(trytesToAscii(message)))
      console.log(`Verify with MAM Explorer:\n${mamExplorerLink}${root}\n`);
    })
})
MS3t.watch((err, value) => {
  if (err) {
    throw err
  }
  trig = 3
  publishAll()
    .then(async root => {
      const result = await Mam.fetch(root, mode, null, logData)
      var command
      result.messages.forEach(message => command =  JSON.parse(trytesToAscii(message)))
      console.log(`Verify with MAM Explorer:\n${mamExplorerLink}${root}\n`);
    })
})