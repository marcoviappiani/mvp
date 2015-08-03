var marcoApp = angular.module('marcoApp',[]);

marcoApp.controller('QuestionCtrl', ['$scope', function($scope){
  $scope.question = 'placeholder for picture of Marco';
  $scope.option1 = 'Marco';
  $scope.option2 = 'Bob';
  $scope.option3 = 'John';
  $scope.option4 = 'Tom';


  $scope.choose = function(selection) {
    $scope.selection = selection;
  }
}]);