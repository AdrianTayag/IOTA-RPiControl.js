let Protecc = require ("./faults.js")
let SC = require ("./disablepermit.js")
var stat1 = {}
var stat2 = {}

const Mam = require('../lib/mam.client.js')
const { asciiToTrytes, trytesToAscii } = require('@iota/converter')
const mode = 'public'
const provider = 'https://nodes.devnet.iota.org'
const mamExplorerLink = `https://mam-explorer.firebaseapp.com/?provider=${encodeURIComponent(provider)}&mode=${mode}&root=`
let mamState = Mam.init(provider, 'PWFNYIZBTOWDYLVKFKMSSPBLZRAQOISTDBEOMRDOISKJPKUKZWSUGOHMRPW9ZBHTVCISXLMJOLRAIDFYJ')


// Publish to tangle
const publish = async packet => {
    const trytes = asciiToTrytes(JSON.stringify(packet))
    const message = Mam.create(mamState, trytes)
    mamState = message.state
    var d2 = new Date()
    console.log('Attaching... ', d2.getSeconds(), d2.getMilliseconds())
    await Mam.attach(message.payload, message.address, 3, 9)
    var d3 = new Date()
    console.log('Published... ', d3.getSeconds(), d3.getMilliseconds(), '\n')
    //console.log('Root: ', message.root, '\n')
    return message.root
}

const publishAll = async () => {
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
  console.log('...')
}

var d = new Date()
console.log('Starting ', d.getSeconds(), d.getMilliseconds())
publishAll()
  .then(async root => {
    const result = await Mam.fetch(root, mode,null,logData)
    d1 = new Date()
    console.log('Fetched... ', d1.getSeconds(), d1.getMilliseconds())
    console.log(root)
    //var status
    //result.messages.forEach(message => status =  JSON.parse(trytesToAscii(message)))
    //console.log(status)
    //console.log(`Verify with MAM Explorer:\n${mamExplorerLink}${root}\n`)
  })
