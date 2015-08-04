var marcoApp = angular.module('marcoApp',[]);

marcoApp.controller('QuestionCtrl', ['$scope', 'GameHandler', function($scope, GameHandler){

  GameHandler.newGame();
  $scope.question = GameHandler.generateQuestion(); 
  $scope.score = GameHandler.getScore();
  $scope.gameOver = GameHandler.isGameOver();
  // console.log($scope.question);

  $scope.choose = function(selection) {
    $scope.selection = selection;
    $scope.isCorrect = $scope.selection === $scope.question.solution.name;
    GameHandler.updateScore($scope.isCorrect);

    $scope.score = GameHandler.getScore();
    $scope.question = GameHandler.generateQuestion();
    $scope.gameOver = GameHandler.isGameOver();
  }
}]);


// These will need to be removed if app is ever publisher somewhere
// loading the flashcard should wait for the image to load (check if any delays)
marcoApp.factory('GameGenerator', function() {
  var allPossiblePeople = [
    {name: 'Adam', image: 'assets/img/Adam.jpeg'},
    {name: 'Alex', image: 'assets/img/AlexCast.jpeg'},
    {name: 'Alex', image: 'assets/img/AlexLeo.jpeg'},
    {name: 'Andrew', image: 'assets/img/Andrew.jpeg'},
    {name: 'Ben', image: 'assets/img/BenB.jpeg'},
    {name: 'Brian', image: 'assets/img/Brian.jpeg'},
    {name: 'Chris', image: 'assets/img/Chris.jpeg'},
    {name: 'Cody', image: 'assets/img/Cody.jpeg'},
    {name: 'David', image: 'assets/img/David.jpeg'},
    {name: 'Fred', image: 'assets/img/Fred.png'},
    // {name: 'Jennie', image: 'assets/img/Jennie.png'},
    {name: 'Jonathan', image: 'assets/img/Jonathan.jpeg'},
    {name: 'Kenneth', image: 'assets/img/Kenneth.jpeg'},
    {name: 'Kiri', image: 'assets/img/Kiri.jpeg'},
    {name: 'Lina', image: 'assets/img/Lina.jpeg'},
    // {name: 'Mack', image: 'assets/img/Mack.jpeg'},
    {name: 'Marco', image: 'assets/img/Marco.jpeg'},
    {name: 'Marcus', image: 'assets/img/Marcus.jpeg'},
    // {name: 'Mark', image: 'assets/img/Mark.png'},
    {name: 'Nate', image: 'assets/img/Nate.jpeg'},
    {name: 'Omar', image: 'assets/img/Omar.png'},
    // {name: 'Rob', image: 'assets/img/RobHayes.jpeg'},
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

