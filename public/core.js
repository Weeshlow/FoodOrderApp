var foodApp = angular
    .module('foodApp', []);

function mainController($scope, $http) {
    $scope.formData = {};

    // when landing on the page, get all food and show them
    $http.get('/api/food')
        .success(function(data) {
            $scope.food = data;
            console.log(data);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

    // when submitting the add form, send the text to the node API
    $scope.createFood = function() {
        $http.post('/api/food', $scope.formData)
            .success(function(data) {
                $scope.formData = {}; // clear the form so our user is ready to enter another
                $scope.food = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

    // delete a food after checking it
    $scope.deleteFood = function(id) {
        $http.delete('/api/food/' + id)
            .success(function(data) {
                $scope.food = data;
                console.log(data);
            })
            .error(function(data) {
                console.log('Error: ' + data);
            });
    };

}
