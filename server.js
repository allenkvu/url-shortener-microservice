var express = require('express');
var path = require('path');
var app = express();

var port = process.env.PORT || 8080;
var routes = require('./routes/index.js');

app.get('/', function(req, res) {

});

routes(app);

app.listen(port, function () {
  console.log('Example app listening on port'  + port + '!')
});