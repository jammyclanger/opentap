var express = require('express');
var app = express();

app.get('/', function (req, res) {
<<<<<<< HEAD
    res.send('SUP!');
=======
  res.sendFile(path.join(__dirname, '../../frontend', 'index.html'));
>>>>>>> 6ad889d924e75140e761d240e33d8d366dc2d830
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});