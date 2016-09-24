var express = require('express');
var app = express();

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '../../frontend', 'index.html'));
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});