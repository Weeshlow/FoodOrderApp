// set up ========================
var express = require('express');
var app = express();                               // create our app w/ express
var mongoose = require('mongoose');                     // mongoose for mongodb
var morgan = require('morgan');             // log requests to the console (express4)
var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)

// configuration =================

mongoose.connect('mongodb://localhost/fooddb');     // connect to mongoDB database locally

app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended': 'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({type: 'application/vnd.api+json'})); // parse application/vnd.api+json as json
app.use(methodOverride());


// define model =================
var Food = mongoose.model('Food', {
    name: String,
    price: Number
});

// routes ======================================================================

// api ---------------------------------------------------------------------
// get all food
app.get('/api/food', function (req, res) {

    // use mongoose to get all food in the database
    Food.find(function (err, food) {

        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err)
            res.send(err);

        res.json(food); // return all food in JSON format
    });
});

// create food and send back all food after creation
app.post('/api/food', function (req, res) {

    // create a food, information comes from AJAX request from Angular
    Food.create({
        text: req.body.text,
        done: false
    }, function (err, food) {
        if (err)
            res.send(err);

        // get and return all the food after you create another
        Food.find(function (err, food) {
            if (err)
                res.send(err);
            res.json(food);
        });
    });

});

// delete a food
app.delete('/api/food/:food_id', function (req, res) {
    Food.remove({
        _id: req.params.food_id
    }, function (err, food) {
        if (err)
            res.send(err);

        // get and return all the food after you create another
        Food.find(function (err, food) {
            if (err)
                res.send(err);
            res.json(food);
        });
    });
});


// application -------------------------------------------------------------
app.get('*', function(req, res) {
    res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
});

// listen (start app with node server.js) ======================================
app.listen(8080);
console.log("App listening on port 8080");
