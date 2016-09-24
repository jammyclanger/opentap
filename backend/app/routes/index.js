var express = require('express');
var simplify = require('simplify-commerce');
var router = express.Router();
var app = express();

client = simplify.getClient({
    publicKey: 'sbpb_ODMzZWJjNjQtOWNlMS00MTA3LWI0YzktNTVhYTViZmY2Mjdk',
    privateKey: 'EpE2V87prm4EccZGl05ur5P8qw/CxeeZELxdJ9+K5oV5YFFQL0ODSXAOkNtXTToq'
});

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'OpenTap' });
});

router.get('/quynh', function(req, res, next) {
    res.send({ alcohol: 'Beer', price: '5.70', currency: 'GBP'});
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

            return res.send({status : 'not'});
        }
        console.log("Payment Status: " + data.paymentStatus);

        return res.send({status : 'ok', price: amount, number: number});
    });
});

module.exports = router;
