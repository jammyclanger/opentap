var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

var simplify = require('simplify-commerce');
var path = require('path');

var router = express.Router();

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, '../../../frontend')));

client = simplify.getClient({
    publicKey: 'sbpb_ODMzZWJjNjQtOWNlMS00MTA3LWI0YzktNTVhYTViZmY2Mjdk',
    privateKey: 'EpE2V87prm4EccZGl05ur5P8qw/CxeeZELxdJ9+K5oV5YFFQL0ODSXAOkNtXTToq'
});

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '../../../frontend', 'index.html'));
});

router.param('amount', function(req, res, next, amount) { 
    console.log('in amount router param');
    req.details = {
        number: amount,
        type: 'beer'
    };

    return next();
});

router.route('/buy/:amount').get(function(req, res, next) {
    console.log('in buy amount', req.details.number);
    var number = req.details.number;
    var amount = number * 570;
    var description = "Buying " + req.details.type;

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
            console.error("Error Message: " + errData.data.error.message);
            // handle the error

            return res.status(400).send({status : 'bad', message: errData.data.error.message});
        }
        console.log("Payment Status: " + data.paymentStatus);

        return res.send({status : 'ok', price: amount, number: number});
    });
});

io.on('connection', function(socket){
    console.log('a user connected');
    socket.on('disconnect', function(){
        console.log('user disconnected');
    });
    socket.on('join', function(data) {
        console.log(data);
        socket.emit('messages', 'Hello from server');
    });
});

http.listen(4200, function(){
    console.log('listening on *:4200');
});

module.exports = router;