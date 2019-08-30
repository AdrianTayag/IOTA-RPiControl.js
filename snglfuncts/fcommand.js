const Gpio = require('onoff').Gpio
const island = new Gpio(23, 'in', 'both')
const sd = new Gpio(10, 'out')
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
  console.log('.....')
  const trytes = asciiToTrytes(JSON.stringify(packet))
  const message = Mam.create(mamState, trytes)
  mamState = message.state
  await Mam.attach(message.payload, message.address, 3, 9)
  console.log('Published at ', Date(hour, minute, second, millisecond).toLocaleString(), packet, '\n')
  console.log('Root: ', message.root, '\n')
  return message.root
}

const publishAll = async () => {
  console.log('Publishing to IOTA...')
  const root = await publish({
    message: 'Microsource toggled / Islanding toggled',
    timestamp: (new Date(hour, minute, second, millisecond)).toLocaleString(),
    'remark': trig  //insert variable depending on commands
  })
  console.log('.')
  return root
}

//callback
const logData = data => {
  if (trig == 4){
    sd.writeSync(0)
    //Protecc.Island()
  }
}

sd.writeSync(1)

island.watch((err, value) => {
  if (err) {
    throw err
  }
  console.log('Island pressed')
  trig = 4
  publishAll()
    .then(async root => {
      console.log('fetching...')
      const result = await Mam.fetch(root, mode, null, logData)
      var command
      result.messages.forEach(message => command =  JSON.parse(trytesToAscii(message)))
      console.log(`Verify with MAM Explorer:\n${mamExplorerLink}${root}\n`)
      console.log(new Date(hour, minute, second, millisecond)).toLocaleString()
    })
})
