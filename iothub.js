var five = require('johnny-five')
var Particle = require("particle-io")
var Protocol = require('azure-iot-device-mqtt').Mqtt;
var Client = require('azure-iot-device').Client;
var Message = require('azure-iot-device').Message;
var config = require('./config')

var connectionString = config.connectionString2;

var client = Client.fromConnectionString(connectionString, Protocol);

var TOKEN = config.token;
var PHOTON_NAME = config.deviceId;

var board = new five.Board({
  io: new Particle({
    token: TOKEN,
    deviceId: PHOTON_NAME
  })
});

board.on('ready', function () {

    var connectCallback = function (err) {
        if (err) {
            console.error('Could not connect: ' + err.message);
        } else {
            console.log('Client connected');

           client.on('error', function (err) {
                console.error(err.message);
            });

            client.on('disconnect', function () {
                clearInterval(sendInterval);
                client.removeAllListeners();
                client.open(connectCallback);
            });
        }
    };


    button = new five.Button('D1');
 this.pinMode('D0', this.MODES.OUTPUT)


 // Inject the `button` hardware into
 // the Repl instance's context;
 // allows direct command line access
 board.repl.inject({
     button: button
 });

 // "down" the button is pressed
 button.on("down", function () {
     board.digitalWrite('D0', 1)

     var time = new Date();
     var data = JSON.stringify({ deviceId: PHOTON_NAME, message: "button pressed", time:time });
     var message = new Message(data);

      client.sendEvent(message, printResultFor('send'));
 });


 // "up" the button is released
 button.on("up", function () {
     board.digitalWrite('D0', 0)
 });

    client.open(connectCallback);
})

function printResultFor(op) {
    return function printResult(err, res) {
        if (err) console.log(op + ' error: ' + err.toString());
        if (res) console.log(op + ' status: ' + res.constructor.name);
    };
}
