const Gpio = require('onoff').Gpio;
const led = new Gpio(26, 'out');
const button = new Gpio(19, 'in', 'both');

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
