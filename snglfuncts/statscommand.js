let Protecc = require ("./faults.js")
let SC = require ("./disablepermit.js")
var d = new Date()
var stat1 = {}
var stat2 = {}

const Mam = require('../lib/mam.client.js')
const { asciiToTrytes, trytesToAscii } = require('@iota/converter')
const mode = 'public'
const provider = 'https://nodes.devnet.iota.org'
const mamExplorerLink = `https://mam-explorer.firebaseapp.com/?provider=${encodeURIComponent(provider)}&mode=${mode}&root=`
let mamState = Mam.init(provider)


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
  stat1 = Protecc.PCstatus()
  stat2 = SC.status()
  const root = await publish({
    message: 'Microsource toggled / Islanding toggled',
    timestamp: ((new Date()).toLocaleString()),
    'PC': stat1,
    'MS': stat2  //insert variable depending on commands
  }) //Stats combined
  return root
}

// Callback used to pass data out of the fetch
const logData = data => {
  d = new Date()
  console.log('Fetched and parsed at ', d, '\n', JSON.parse(trytesToAscii(data)), '\n')
}

console.log(d)
publishAll()
  .then(async root => {
    const result = await Mam.fetch(root, mode)
    var status
    result.messages.forEach(message => status =  JSON.parse(trytesToAscii(message)))
    console.log(status)
    console.log(`Verify with MAM Explorer:\n${mamExplorerLink}${root}\n`)
  })
