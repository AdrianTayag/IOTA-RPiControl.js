const Gpio = require('onoff').Gpio
const island = new Gpio(23, 'in', 'both', {debounceTimeout: 10})
let Islanding = require("./islanding.js") //Island
var trig

const Mam = require('../lib/mam.client.js')
const { asciiToTrytes, trytesToAscii } = require('@iota/converter')
const mode = 'public'
const provider = 'https://nodes.devnet.iota.org'
const mamExplorerLink = `https://mam-explorer.firebaseapp.com/?provider=${encodeURIComponent(provider)}&mode=${mode}&root=`

// Initialise MAM State
let mamState = Mam.init(provider, 'ZGUZDLLCSKMHHFTYLATBVSADVPKEGJOUOOJXAMGEOGKKNWWEBKPEOJKGYPFLHMWLFXKRQRYLL9QQRPGKR')
// Publish to tangle
const publish = async packet => {
    const trytes = asciiToTrytes(JSON.stringify(packet))
    const message = Mam.create(mamState, trytes)
    mamState = message.state
    await Mam.attach(message.payload, message.address, 3, 9)
    var d3 = new Date()
    console.log('Published at ', d3, packet, '\n')
    console.log('Root: ', message.root, '\n')
    return message.root
}

const publishAll = async () => {
  console.log('Publishing to IOTA...')
  const root = await publish({
    message: 'Microsource toggled / Islanding toggled',
    timestamp: ((new Date()).toLocaleString()),
    'remark': trig  //insert variable depending on commands
  })
  return root
}

//callback
const remark = function(x) {
  if (x == 4){
    Islanding.Island()
  }
  else {
  }
}

island.watch((err, value) => {
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
