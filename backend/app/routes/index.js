var express = require('express');
var router = express.Router();
var path = require('path');

/* GET home page. */
router.get('/', function(req, res, next) {
  //res.render('index', { title: 'OpenTap' });
  res.sendFile(path.join(__dirname, '../../../frontend', 'index.html'));
});

router.get('/yo', function(req, res, next) {
   res.render('magic', { title: 'hey', magicmagic: 'this is true magic' });
});

router.get('/quynh', function(req, res, next) {
   res.send({ alcohol: 'Beer', price: '5.70', currency: 'GBP', age: 'OK'});
});

module.exports = router;
