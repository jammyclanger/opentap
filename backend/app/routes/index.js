var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

var simplify = require('simplify-commerce');
var path = require('path');

var counter = 1;

var status = "0";

var router = express.Router();

var globalSocket;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, '../../../frontend')));

client = simplify.getClient({
    publicKey: 'sbpb_ODMzZWJjNjQtOWNlMS00MTA3LWI0YzktNTVhYTViZmY2Mjdk',
    privateKey: 'EpE2V87prm4EccZGl05ur5P8qw/CxeeZELxdJ9+K5oV5YFFQL0ODSXAOkNtXTToq'
});

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '../../../frontend', 'index.html'));
});

app.get('/status', function(req, res) {
    // TODO: Actually from the mastercard place.
    console.log("Edison wants to chat :)");
    if (status == "2") {
        res.send("2");
        status = "0";
    } else {
        res.send(status);
    }
});

app.get('/price', function(req, res) {
    res.send("5.50");
});

app.param('amount', function(req, res, next, amount) { 
    console.log('in amount router param');
    req.details = {
        number: amount,
        type: 'beer'
    };

    return next();
});

app.route('/buy/:amount').get(function(req, res, next) {
    console.log('in buy amount', req.details.number);

    var theId = counter;
    counter++;

    var number = req.details.number;
    var price = 550;
    var amount = number * price;
    var description = "Buying " + req.details.type;

    var tenders = ['Saci', 'Jaime', 'Quynh', 'Lorenzo', 'Butler', 'Sandra'];
    var server = tenders[Math.round(Number(Math.random() * (4 - 0) + 0))];
    var tableNumber = Math.round(Number(Math.random() * (20 - 1) + 1));
    var quantity = req.details.number;

    globalSocket.emit('order', { id: theId, quantity: quantity, item: 'London Pride', price: price, tender: server, table: tableNumber });

    setTimeout(function(){
        globalSocket.emit('characteristic', { id: theId, age: 'OK', discount: 0.3 });

    }, 3000);

    setTimeout(function(){
        client.payment.create({
            amount : amount,
            description : description,
            card : {
                expMonth : "11",
                expYear : "19",
                cvc : "123",
                number : "5555555555554444"
            },
            currency : "GBP"
        }, function(errData, data){
            if(errData){

                globalSocket.emit('errors', 'Payment was not successful');
            }
            status = "2";
            globalSocket.emit('payment', {id: theId, status: 'OK'});
            
            return res.send("" + price);
        });
    }, 2000);

});

io.on('connection', function(socket){
    globalSocket = socket;
    console.log('a user connected');
    socket.on('disconnect', function(){
        console.log('user disconnected');
    });
    socket.on('join', function(data) {
        console.log(data);
        socket.emit('messages', 'Hello from server');
    });
    socket.on('approve', function(data) {
        console.log(data);
    });

    socket.on('buy', function(data) {
        console.log('in buy amount', data.number);
        var theId = counter;
        counter++;

        var number = data.number;
        var price = 570;
        var amount = number * price;
        var description = "Buying " + data.type;

        var tenders = ['Saci', 'Jaime', 'Quynh', 'Butler', 'Sandra'];
        var server = tenders[Math.round(Number(Math.random() * (4 - 0) + 0))];
        var tableNumber = Math.round(Number(Math.random() * (20 - 1) + 1));
        var quantity = Math.round(Number(Math.random() * (5 - 1) + 1));
        var price = Math.round(Number(Math.random() * (700 - 350) + 350));

        socket.emit('order', { id: theId, quantity: quantity, item: 'London Pride', price: price, tender: server, table: tableNumber });

        setTimeout(function(){
            socket.emit('characteristic', { id: theId, age: 'OK', discount: 0.3 });

        }, 3000);

        setTimeout(function(){
            client.payment.create({
                amount : amount,
                description : description,
                card : {
                    expMonth : "11",
                    expYear : "19",
                    cvc : "123",
                    number : "5555555555554444"
                },
                currency : "GBP"
            }, function(errData, data){
                if(errData){
                    // TODO Put this back
                    socket.emit('payment', {id: theId, status: 'OK'});
                    //socket.emit('errors', 'Payment was not successful');
                }

                socket.emit('payment', {id: theId, status: 'OK'});
            });
        }, 6000);

    });
});

http.listen(4200, function(){
    console.log('listening on *:4200');
});

module.exports = router;