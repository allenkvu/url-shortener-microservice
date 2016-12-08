var express = require('express');
var path = require('path');
var app = express();

var port = process.env.PORT || 8080;
var routes = require('./routes/index.js');

app.get('/', function(req, res) {
  var fileName = path.join(__dirname, 'index.html');
  res.sendFile(fileName, function (err) {
    if (err) {
      console.log(err);
      res.status(err.status).end();
    }
    else {
      console.log('Sent:', fileName);
    }
  });
});

routes(app);

app.listen(port, function () {
  console.log('Example app listening on port'  + port + '!')
});