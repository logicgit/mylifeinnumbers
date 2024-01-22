var express = require('express');
var app = express();
var port = 8080;

// route our app
var router = require('./app/routes');
app.use('/', router);

// setting static files location
app.use(express.static(__dirname + '/My_Life_In_Numbers_files'));
app.use(express.static(__dirname + '/styles'));
app.use(express.static(__dirname + '/Scripts'));

// start the server
app.listen(port, function() {
  console.log('app started');
});
