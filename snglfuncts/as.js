/* d = new Date()
console.log(d.getSeconds(), d.getMilliseconds())
console.log('wat')
console.log('wat')
console.log('wat')
console.log('wat')
console.log('wat')
d = new Date()
console.log(d)

var stat = {}
const stats1 = {
  message: 'Protection Coordinator Report',
  timestamp: (new Date()).toLocaleString(),
  'SAFETY': {
    'B1': 'a',
    'B2': 'aa',
    'B3': 'aaa',
    'B4': 'aaaa',
  }
}

const stats2 = {
  message: 'Protection Coordinator Report',
  timestamp: (new Date()).toLocaleString(),
  'SAFETY': {
    'B1': 'b',
    'B2': 'ba',
    'B3': 'baa',
    'B4': 'baaa',
  }
}

stat['PC'] = stats1
stat['MS'] = stats2
console.log(stat) */

var ping = require('ping');

var hosts = ['https://nodes.devnet.iota.org'];
hosts.forEach(function(host){
    ping.sys.probe(host, function(isAlive){
        var msg = isAlive ? 'host ' + host + ' is alive' : 'host ' + host + ' is dead';
        console.log(msg);
    });
});
