var marcoApp = angular.module('marcoApp',[]);

marcoApp.controller('GameCtrl', ['$scope', 'GameHandler', 'TimerFactory', '$interval', function($scope, GameHandler, TimerFactory, $interval){

  // $scope.data = GameHandler.getData();
  // $scope.timerData = TimerFactory.getData()
  $scope.gameStarted = false;

  $scope.startGame = function() {
    GameHandler.newGame();
    $scope.question = GameHandler.generateQuestion(); 
    $scope.score = GameHandler.getScore();
    $scope.gameStarted = true;
    $scope.gameOver = GameHandler.isGameOver();

    $scope.counter = TimerFactory.getCounter();

    //this $interval is a hack to fix the fact that $scope doesn't seem to be updating during the interval.
    // TODO: find the root cause and a better solution
    $interval(function() {
      $scope.counter = TimerFactory.getCounter(); 
      if($scope.counter === 0) {
        GameHandler.endGame();
        $scope.gameOver = GameHandler.isGameOver();
      }
    }, 1000);
  };


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
//pictures are not all of the same size! need to handle that in some way
marcoApp.factory('GameGenerator', function() {
  var allPossiblePeople = [
    {name: 'Adam', image: 'assets/img/Adam.jpeg'},
    {name: 'Alex', image: 'assets/img/AlexCast.jpeg'},
    {name: 'Alex', image: 'assets/img/AlexLeo.jpeg'},
    {name: 'Andres', image: 'assets/img/Andres.png'},
    {name: 'Andrew', image: 'assets/img/Andrew.jpeg'},
    // {name: 'Ben', image: 'assets/img/BenB.jpeg'},
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


marcoApp.factory('GameHandler', ['GameGenerator', 'GameSettings', 'TimerFactory', function(GameGenerator,GameSettings, TimerFactory){
  //Game Variable definitions
  var gameSettings = GameSettings;
  var questions;
  var uniqueNames;
  var gameOver;
  var score;

  //object that groups all data --not really used
  var getData = function() {
    return {
      counter: TimerFactory.getCounter(),
      questions: questions,
      uniqueNames: uniqueNames,
      gameOver: gameOver,
      score: score
    };
  };

  var getCounter = function() {
    return TimerFactory.getCounter();
  };

  var newGame = function() {
    questions = GameGenerator.generateList();
    uniqueNames = GameGenerator.uniqueNames();
    gameOver = false;
    score = 0;
    TimerFactory.startCounter(function(count) {
      if(count ===0) {
        gameOver = true;
        console.log('timer updated');
      }
    });
  };

  var isGameOver = function() {
    return gameOver;
  }

  var endGame = function() {
    gameOver = true;
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
      question.solution = questions.pop();
      question.options = generateOptions(question.solution.name);  //['Marco', 'Bob', 'John', 'Tom']
      // console.log(question);
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
    endGame: endGame,
    updateScore: updateScore,
    getScore: getScore,
    getCounter: getCounter,
    getData: getData
  };

}]);

marcoApp.factory('TimerFactory',['GameSettings', '$interval', function(GameSettings,$interval){
  var count = 0;
  var delay = GameSettings.timerDelay;
  var timer;

  var getCounter = function() {
    console.log('we are into the getCounter');
    return count;
  };

  var getData = function() {
    return {
      count: count
    };
  }


  var startCounter = function(callback) {
    
    var incrementTimer = function() {
      count--;
      callback(count);
      // console.log(callback.toString());
      console.log(count);
    };

    if(timer) {
      $interval.cancel(timer);
    }
    count = GameSettings.timerLength;
    timer = $interval(incrementTimer, delay, count, true);
  };


  var stopCounter = function() {
    if(timer) {
      $interval.cancel(timer);
    }
  };

  return {
    startCounter: startCounter,
    stopCounter: stopCounter,
    getCounter: getCounter,
    getData: getData
  };

}]);

//Settings used throughout the App
marcoApp.factory('GameSettings', function() {
  return {
    optionsNum: 4,
    scoreIncrement : 1,
    timerLength: 30,
    timerDelay: 1000
  };
});

