var marcoApp = angular.module('marcoApp',[]);

marcoApp.controller('QuestionCtrl', ['$scope', 'QuestionGenerator', 'PeopleGenerator', function($scope, QuestionGenerator, PeopleGenerator){

  $scope.question = QuestionGenerator.generateQuestion(); 
  // console.log($scope.question);

  $scope.choose = function(selection) {
    $scope.selection = selection;
    $scope.isCorrect = $scope.selection === $scope.question.solution;
  }

  // $scope.question = 'placeholder for picture of Marco';  
  // $scope.option1 = 'Marco';
  // $scope.option2 = 'Bob';
  // $scope.option3 = 'John';
  // $scope.option4 = 'Tom';
  // $scope.solution = 'Marco';

}]);



marcoApp.factory('PeopleGenerator', function() {
  var allPossiblePeople = [
    ['Marco', 'Marcoimage'],
    ['Tom', 'Tomimage'],
    ['John', 'Johnimage'],
    ['Bob', 'Bobimage'],
    ['Carl', 'Carlimage'],
    ['Tim', 'Timimage'],
    ['Fred', 'Fredimage'],
    ['Fred', 'AnotherFredimage']
  ];

  var generateList = function() {
    return _.shuffle(allPossiblePeople);
  };

  var uniqueNames = function() {
    return _.uniq(_.map(allPossiblePeople, function(person){
      return person[0];
    }));
  };

  return {
    generateList: generateList,
    uniqueNames: uniqueNames
  };
});


marcoApp.factory('QuestionGenerator',function(){
  var optionNum = 4;

  var generateQuestion = function() {
    var question = {};
    question.options = ['Marco', 'Bob', 'John', 'Tom'];
    question.image = 'placeholder for picture of Marco';
    question.solution = 'Marco';

    // question.choose = function(selection) {
    //   return question.solution === selection;
    // };

    return question;
  };

  return {  
    generateQuestion: generateQuestion,
  };

});

