
var mraa = require("mraa");
var fs = require('fs');
var lcd = require('jsupm_i2clcd');
var display = new lcd.Jhd1313m1(0, 0x3E, 0x62);
var http = require('http');
var serverIp = 'http://192.168.42.20:4200';
var digital_pin_D2 = new mraa.Gpio(2);
digital_pin_D2.dir(mraa.DIR_IN);

var digital_pin_D6 = new mraa.Gpio(6);
digital_pin_D6.dir(mraa.DIR_OUT);
var Futures = require('futures');   

function startSensorWatch(socket) {
    'use strict';
    var touch_sensor_value = 0, last_t_sensor_value;
    digital_pin_D6.write(0);
    setInterval(function () {
        touch_sensor_value = digital_pin_D2.read();
        if (touch_sensor_value === 1 && last_t_sensor_value === 0) {
            console.log("Buzz ON!!!");
            //socket.emit('orderRaised', { information: "orderRaised"});
            digital_pin_D6.write(1);
            sleep(100);
            digital_pin_D6.write(0);
            manageLCD(1);
        } else if (touch_sensor_value === 0 && last_t_sensor_value === 1) {
            console.log("Buzz OFF!!!");
            //socket.emit('buzzerPress', { information: "Buzzer Off"});
            digital_pin_D6.write(0);
        }
        last_t_sensor_value = touch_sensor_value;
    }, 1);
}

function postOrderRaised(orderStatus) {
    //lazy post
    console.log('postOrderRaised');
    http.get(serverIp + '/buy/' + orderStatus).on('error', function(e) {
        console.log('shit got real.');
    });
    console.log("DONE");
}


function startResponsePoll() {
    console.log('startResponsePoll');
    display.write('.');
    var exec = require('child_process').exec;
    var child;
    var command="curl "+serverIp+ '/status';
    child = exec(command,
                function (error, stdout, stderr) {
        console.log(stdout);
        sleep(1000);
        if(stdout==0)startResponsePoll();
        else manageLCD(parseInt(stdout));
       });
    
}

//0 - is tap to order 
//      1 beer: £5.50
//1 - Processing order...
//2 - Order on its way!
function manageLCD(buttonState) {
    console.log("GOT HERE");
    if (buttonState === 0) {
        display.clear();
        display.setColor(255, 240, 240); //white
        display.setCursor(0, 2);
        display.write('Tap to order');
        display.setCursor(1, 1);
        display.write('1 Beer:   5.50');
    } else if (buttonState === 1) {
        postOrderRaised(1);
        display.clear();
        display.setColor(255, 50, 0); //orange
        display.setCursor(0, 0);
        display.write('Processing your');
        display.setCursor(1, 4);
        display.write('Order');
        startResponsePoll();
    } else if (buttonState === 2) {
        display.setColor(0, 255, 0);
        display.setCursor(0, 0);
        display.write('Enjoy your beer');
        digital_pin_D6.write(1);
        sleep(300);
        digital_pin_D6.write(0);
        display.clear();
        display.setCursor(0, 0);
        var Counter=0;
        while(Counter<50){
            Counter++;
            display.scroll(true);
            display.write('Thank You for using OpenTap');
            sleep(100);
        }
        manageLCD(0);
    } else if (buttonState === 3) {
        display.clear();
        display.setColor(255, 0, 0);
        display.setCursor(0, 4);
        display.write('No Money');
        display.setCursor(1, 4);
        display.write('No Beer');
        digital_pin_D6.write(1);
        sleep(100);
        digital_pin_D6.write(0);
        sleep(100);
        digital_pin_D6.write(1);
        sleep(100);
        digital_pin_D6.write(0);
        sleep(100);
        digital_pin_D6.write(1);
        sleep(100);
        digital_pin_D6.write(0);
        sleep(100);
        digital_pin_D6.write(1);
        sleep(100);
        digital_pin_D6.write(0);
        sleep(100);
        manageLCD(0);
        console.log('setting screen red');
    }



    //    display.setCursor(1, 1);
    //    display.write('hi there');
    //    
    //    display.setCursor(0,0);
    //    display.write('more text');
}


//Create Socket.io server

var app = http.createServer(function (req, res) {
    //    'use strict';
    //    res.writeHead(200, {'Content-Type': 'text/plain'});
    //    res.end('<h1>Hello world from Intel IoT platform!</h1>');

    //    THis will take out the index.html
    fs.readFile(__dirname + '/index.html',
        function (err, data) {
            if (err) {
                res.writeHead(500);
                return res.end('Error loading index.html');
            }

            res.writeHead(200);
            res.end(data);
        });


}).listen(1337);

var io = require('socket.io')(app);

console.log("Sample Reading Touch Sensor");

//Attach a 'connection' event handler to the server
io.on('connection', function (socket) {
    'use strict';
    console.log('a user connected');
    //Emits an event along with a message
    socket.emit('news', { hello: 'world' });

    manageLCD(0);

    //Start watching Sensors connected to Galileo board
    startSensorWatch(socket);

    //Attach a 'disconnect' event handler to the socket
    socket.on('disconnect', function () {
        console.log('user disconnected');
    });
});
//
////var serverIo = require('socket.io')();
////var serverSocket = serverIo.connect(serverIp);
//
//var serverSocket = io(serverIp);
////serverSocket.emit()

//var socket = require('socket.io-client')('http://25.73.188.26:4200/');
//socket.on('connect', function (socket) {
//    'use strict';
////    console.log('a user connected');
//    //Emits an event along with a message
////    socket.emit('news', { hello: 'world' });
//
//    //Start watching Sensors connected to Galileo board
//    startSensorWatch(socket);
//
//    //Attach a 'disconnect' event handler to the socket
////    socket.on('disconnect', function () {
////        console.log('user disconnected');
////    });
//});
function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds) {
            break;
        }
    }
}





    
    
    
    
//    while (Count < 5) {
//        console.log('callback of get response from server for order');
//        display.write(".");
//        //if (ServerResponse !== 0) return ServerResponse;
//        var sequence = Futures.sequence();
//        sequence
//            .then(function(next){
//                http.get(serverIp + '/status', function(res) {
//                    console.log('Response from server poll: ' + res);
//                    res.on("data", function(chunk) {
//                        console.log("body: " + chunk);
//                    })
//                }).on('error', function(e) {
//                    return 3; //error at the web service
//                });
//            })
//            .then(function(next, res) {
//                if (res !== 0) {
//                    return res;
//                }
//            })
//        sleep(2000);
//        Count++;
//    }
//    display.write(".");
//    var invalidResponse = null;
//     http.get(serverIp + '/status', function (res) {
//            console.log('Response from server poll: ' + res);
//            res.on("data", function (chunk) {
//                console.log("body: " + chunk);
//                invalidResponse = chunk;
//            })
//        }).on('error', function (e) {
//            return 3; //error at the web service
//        });
//    while (invalidResponse === null) {        
//       console.log('jeesus');
//        sleep(100);
//    }
//    if (invalidResponse === 0) {
//        startResponsePoll();
//    } else {
//        return invalidResponse;
//    }    
//    display.write(".");
//    http.get(serverIp + '/status', function (res) {
//    console.log('Response from server poll: ' + res);
//        res.on("data", function (chunk) {
//            console.log("body: " + chunk);
//            return chunk;
//        })
//    }).on('error', function (e) {
//        return 3; //error at the web service
//    });