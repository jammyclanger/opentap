var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'OpenTap' });
});

router.get('/yo', function(req, res, next) {
   res.render('magic', { title: 'hey', magicmagic: 'this is true magic' });
});


module.exports = router;
