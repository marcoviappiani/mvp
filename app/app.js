var marcoApp = angular.module('marcoApp',[]);

marcoApp.controller('QuestionCtrl', ['$scope', 'GameHandler', function($scope, GameHandler){

  GameHandler.newGame();
  $scope.question = GameHandler.generateQuestion(); 
  // console.log($scope.question);

  $scope.choose = function(selection) {
    $scope.selection = selection;
    $scope.isCorrect = $scope.selection === $scope.question.solution.name;
    $scope.question = GameHandler.generateQuestion();
  }

  // $scope.question = 'placeholder for picture of Marco';  
  // $scope.option1 = 'Marco';
  // $scope.option2 = 'Bob';
  // $scope.option3 = 'John';
  // $scope.option4 = 'Tom';
  // $scope.solution = 'Marco';

}]);



marcoApp.factory('GameGenerator', function() {
  var allPossiblePeople = [
    {name: 'Marco', image: 'Marcoimage'},
    {name: 'Tom', image: 'Tomimage'},
    {name: 'John', image: 'Johnimage'},
    {name: 'Bob', image: 'Bobimage'},
    {name: 'Carl', image: 'Carlimage'},
    {name: 'Tim', image: 'Timimage'},
    {name: 'Fred', image: 'Fredimage'},
    {name: 'Fred', image: 'AnotherFredimage'}
  ];

  var generateList = function() {
    return _.shuffle(allPossiblePeople);
  };

  var uniqueNames = function() {
    return _.uniq(_.map(allPossiblePeople, function(person){
      return person.name;
    }));
  };

  return {
    generateList: generateList,
    uniqueNames: uniqueNames
  };
});


marcoApp.factory('GameHandler', ['GameGenerator', function(GameGenerator){

  var questions;
  var uniqueNames;

  var newGame = function() {
    questions = GameGenerator.generateList();
    uniqueNames = GameGenerator.uniqueNames();
  };

  var generateOptions = function(name) {
    var optionsNum = 4;
    var i;
    var options = [];
    var currOption;
    var solutionPosition = _.random(optionsNum - 1); //here is where we place the position

    //fill Options
    while(options.length < optionsNum) {
      //check if we need to add the solution
      if(options.length === solutionPosition) {
        options.push(name);
      } else {
        i =_.random(uniqueNames.length - 1);
        currOption = uniqueNames[i];
        if(currOption !== name && _.indexOf(options,currOption) === -1) {
          options.push(currOption);
        }
      }
    }
    return options;
  };

  var generateQuestion = function() {
    var question = {};

    if(questions.length >0) {
      question.gameOver = false;
      question.solution = questions.pop();
      question.options = generateOptions(question.solution.name);  //['Marco', 'Bob', 'John', 'Tom']
      console.log(question);
      return question;
    } else {
      console.log('ran out of questions');
      return {gameOver: true};
    }
  };

  return {  
    newGame: newGame,
    generateQuestion: generateQuestion
  };

}]);

