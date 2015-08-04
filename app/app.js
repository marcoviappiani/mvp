var marcoApp = angular.module('marcoApp',[]);

marcoApp.controller('QuestionCtrl', ['$scope', 'GameHandler', function($scope, GameHandler){

  GameHandler.newGame();
  $scope.question = GameHandler.generateQuestion(); 
  // console.log($scope.question);
  $scope.score = GameHandler.getScore();
  $scope.gameOver = GameHandler.isGameOver();
  
  $scope.choose = function(selection) {
    $scope.selection = selection;
    $scope.isCorrect = $scope.selection === $scope.question.solution.name;
    GameHandler.updateScore($scope.isCorrect);

    $scope.score = GameHandler.getScore();
    $scope.question = GameHandler.generateQuestion();
    $scope.gameOver = GameHandler.isGameOver();
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
  //Game Variable definitions
  var gameSettings = {
    optionsNum: 4,
    scoreIncrement : 1
  };

  var questions;
  var uniqueNames;
  var gameOver;
  var score;

  var newGame = function() {
    questions = GameGenerator.generateList();
    uniqueNames = GameGenerator.uniqueNames();
    gameOver = false;
    score = 0;
  };

  var isGameOver = function() {
    return gameOver;
  }

  var generateOptions = function(name) {
    var i;
    var options = [];
    var currOption;
    var solutionPosition = _.random(gameSettings.optionsNum - 1); //here is where we place the position

    //fill Options
    while(options.length < gameSettings.optionsNum) {
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
      gameOver = true;
      return {};
    }
  };

  var updateScore = function(answerCorrect){
    if(answerCorrect) {
      score += gameSettings.scoreIncrement;
    }
  };

  var getScore = function(){
    return score;
  };

  return {  
    newGame: newGame,
    generateQuestion: generateQuestion,
    isGameOver: isGameOver,
    updateScore: updateScore,
    getScore: getScore
  };

}]);

