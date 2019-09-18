const Gpio = require('onoff').Gpio;
const led = new Gpio(26, 'out');
const button = new Gpio(14, 'in', 'rising', {debounceTimeout: 10});
const buttonup = new Gpio(14, 'in', 'falling', {debounceTimeout: 10})

button.watch((err, value) => {
  if (err) {
    throw err;
  }

  led.writeSync(value);
});

process.on('SIGINT', () => {
  led.unexport();
  button.unexport();
});
