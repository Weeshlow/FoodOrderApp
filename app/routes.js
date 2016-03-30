var Food = require('./models/afood.js');

function getFood(res) {
    Food.find(function (err, food) {

        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err) {
            res.send(err);
        }

        res.json(food); // return all food in JSON format
    });
}
;

module.exports = function (app) {

    // api ---------------------------------------------------------------------
    // get all food
    app.get('/api/food', function (req, res) {
        // use mongoose to get all food in the database
        getFood(res);
    });

    // create food and send back all food after creation
    app.post('/api/food', function (req, res) {

        // create a food, information comes from AJAX request from Angular
        Food.create({
            name: req.body.name,
            price: req.body.price,
            done: false
        }, function (err, food) {
            if (err)
                res.send(err);

            // get and return all the food after you create another
            getFood(res);
        });

    });

    // delete a food
    app.delete('/api/food/:food_id', function (req, res) {
        Food.remove({
            _id: req.params.food_id
        }, function (err, food) {
            if (err)
                res.send(err);

            getFood(res);
        });
    });

    // application -------------------------------------------------------------
    app.get('*', function (req, res) {
        res.sendFile(__dirname + '/public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
    });
};