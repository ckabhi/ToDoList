var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mysql = require('mysql');
var cors = require("cors");
var port = 8081;

// models
var models = require("./models");

// routes
var toDoRoutes = require('./routes/todoRoutes');
//Sync Database
models.sequelize.sync().then(function() {
    console.log('connected to database')
}).catch(function(err) {
    console.log(err)
});

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// register routes
app.use('/user', toDoRoutes);

// index path
app.get('/', function(req, res){
    console.log('app listening on port: '+port);
    res.send('server is working');
});

app.listen(port, function(){
    console.log('app listening on port: '+port);
});
