var five = require("johnny-five");
var Particle = require("particle-io");
var config = require('./config')

var TOKEN = config.token;
var DEVICE_ID = config.deviceId;

var board = new five.Board({
  io: new Particle({
    token: TOKEN,
    deviceId: DEVICE_ID
  })
});

var rightWheel, leftWheel, speed;

board.on("ready", function() {
  console.log('ready');

  rightWheel = new five.Motor({
    pins: { pwm: "D0", dir: "D4" },
    invertPWM: true
  });

  leftWheel = new five.Motor({
    pins: { pwm: "D1", dir: "D5" },
    invertPWM: true
  });

  speed = 255;
});

var keyMap = {
  'up': reverse,
  'down': forward,
  'left': left,
  'right': right,
  'space': stop,
  'q': exit
};

var stdin = process.stdin;
stdin.setRawMode(true);
stdin.resume();

stdin.on("keypress", function(chunk, key) {
    if (!key || !keyMap[key.name]) return;

    leftWheel.rev(0);
    rightWheel.rev(0);

    keyMap[key.name]();
});

function reverse() {
  console.log('reverse')
  leftWheel.rev(speed);
  rightWheel.rev(speed);
}

function forward() {
  console.log('forward')
  leftWheel.fwd(speed);
  rightWheel.fwd(speed);
}

function stop() {
  console.log('stop')
  leftWheel.stop();
  rightWheel.stop();
}

function left() {
  console.log('left')
  leftWheel.rev(Math.floor(speed / 2));
  rightWheel.fwd(Math.floor(speed / 2));
}

function right() {
  console.log('right')
  leftWheel.fwd(Math.floor(speed / 2));
  rightWheel.rev(Math.floor(speed / 2));
}

function exit() {
  console.log('exit')
  leftWheel.rev(0);
  rightWheel.rev(0);
  setTimeout(process.exit, 1000);
}
