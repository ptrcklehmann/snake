/*//////////////////////////////////////////
VARIABLES
___________________________________________*/
var snake;
var snakeLength;
var snakeSize;
var snakeDirection;


var food;
var foodName = 'watermelon';

var score = 0;

var context;
var screenWidth;
var screenHeight;

var gameState;
var gameOverMenu;
var playButton;
var restartButton;
var playHUD;
var scoreboard;


/*//////////////////////////////////////////
EXECUTING GAME CODE
___________________________________________*/
gameInit();
snakeInit();
foodInit();
setInterval(gameLoop,1000/10);


/*//////////////////////////////////////////
GAME FUNCTIONS
___________________________________________*/
function gameInit(){ //Initialize the whole game
    var canvas = document.getElementById('game_screen');
    context = canvas.getContext('2d');
    // Enable 2d drawing on the canvas
    // get the screen w and h and set up the canvas size for the whole of the window
    screenWidth = window.innerWidth;
    screenHeight = window.innerHeight;
    //set the canvas size for the actual screen size
    canvas.width = screenWidth;
    canvas.height = screenHeight;

    document.addEventListener('keydown',keyboardHandler);

    gameOverMenu = document.getElementById('game_over');
    centerMenuPosition(gameOverMenu);

    mainMenu = document.getElementById('main_menu');
    centerMenuPosition(mainMenu);

    playButton = document.getElementById('play');
    playButton.addEventListener('click', gameRestart);

    restartButton = document.getElementById('restart_button');
    restartButton.addEventListener('click', gameRestart);

    playHUD = document.getElementById('playHUD');
    scoreboard = document.getElementById('scoreboard');

    setState("main");
}

function gameLoop(){ // Make sure game is working at all times
            gameDraw();
            drawScoreBoard();
          if (gameState == "play"){
            snakeDraw();
            snakeUpdate();
            foodDraw();
  }

}

function gameDraw(){// Draw the game on the screen
    context.fillStyle = "rgb(222, 203, 126)";
    context.fillRect(0, 0, screenWidth, screenHeight); //fills up the whole screen with a retangle
}

function gameRestart(){
    snakeInit();
    foodInit();
    hideMenu(gameOverMenu);
    hideMenu(mainMenu);
    setState('play');

}

/*//////////////////////////////////////////
SNAKE FUNCTIONS
___________________________________________*/

function snakeInit(){ //Initialize the snake arrays
    snake = [];
    snakeLength = 3;
    snakeSize = 23;
    snakeDirection = "down";
    score = 0;

    for (var i = snakeLength - 1; i >= 0; i--){
        snake.push({ //creates a new part of the snake
          x: i,
          y:0
        });
    }
}

function snakeDraw(){ //Draw the snake on the canvas
    for (var i = 0; i < snake.length; i++){
      context.fillStyle = "rgb(103, 129, 22)";
      context.shadowColor = "rgb(142, 157, 30)";
      context.shadowBlur = 4;
      context.fillRect(snake[i].x * snakeSize, snake[i].y * snakeSize, snakeSize, snakeSize);

    }
}

function snakeUpdate() {
  var snakeHeadX = snake[0].x;
  var snakeHeadY = snake[0].y;

  if (snakeDirection == "down"){ //move snake acordingly to which key is pressed
    snakeHeadY++;
  }
  else if (snakeDirection == "up"){
    snakeHeadY--;
  }
  else if (snakeDirection == "right"){
    snakeHeadX++;
  }
  else if (snakeDirection == "left"){
    snakeHeadX--;
  }

    checkFoodColisions(snakeHeadX, snakeHeadY);//this checks if there was a food colision
    //and passes the arguments so the loval variables work in the actual function


    checkSnakeColisions(snakeHeadX, snakeHeadY);


  var snakeTail = snake.pop();
  snakeTail.x = snakeHeadX;
  snakeTail.y = snakeHeadY;
  snake.unshift(snakeTail);


  checkWallColisions(snakeHeadX, snakeHeadY);

  console.log("x" + snakeHeadX);
  console.log("y" + snakeHeadY);
}

/*//////////////////////////////////////////
FOOD FUNCTIONS
___________________________________________*/
function foodInit(){
    food = {
    x: 0,
    y: 0
  };
  setFoodPosition();
}
function foodMixer() { // stores a different food inside the variable
  var foodMix = ['watermelon', 'coffee', 'egg', 'pint', 'pizza', 'doughnut', 'orange'];
  var index = Math.floor(Math.random() * 6) + 1;
  foodName = foodMix[index];
}

function foodDraw() {

    var img = document.getElementById(foodName);
    context.drawImage(img, food.x * snakeSize, food.y * snakeSize, snakeSize + 3, snakeSize + 3);

    //context.fillStyle = "rgb(251, 3, 98)";
    //context.fillRect(food.x * snakeSize, food.y * snakeSize, snakeSize, snakeSize);
}
function setFoodPosition(){
    var randomX = Math.floor(Math.random()*(screenWidth - 10));
    var randomY = Math.floor(Math.random()*(screenHeight - 10));

    food.x = Math.floor(randomX / snakeSize); // this puts the food on the same grid position as the snake
    food.y = Math.floor(randomY / snakeSize);
}

/*//////////////////////////////////////////
INPUT FUNCTIONS
 __________________________________________*/
function keyboardHandler (event){
  //console.log(event);
  if (event.keyCode == 40 && snakeDirection != "up"){ //check if the key is pressed down
    snakeDirection = "down";                          //and if the snake direction is not up usw.
  }
  else if (event.keyCode == 39 && snakeDirection != "left"){
    snakeDirection = "right";
  }
  else if (event.keyCode == 37 && snakeDirection != "right"){
    snakeDirection = "left";
  }
  else if (event.keyCode == 38 && snakeDirection != "down"){
    snakeDirection = "up";
  }
}

/*//////////////////////////////////////////
COLISION HANDLING
 __________________________________________*/
function checkFoodColisions (snakeHeadX, snakeHeadY){
    if (snakeHeadX == food.x && snakeHeadY == food.y){
    snake.push({
      x:0,
      y:0
    });
    setFoodPosition();
    foodMixer();
    snakeLength++;
    score += 1000;

  }
}

function checkWallColisions(snakeHeadX, snakeHeadY) {

    if (snakeHeadX * snakeSize >= screenWidth || snakeHeadX * snakeSize < 0){
    setState("game over");

    }

    if (snakeHeadY * snakeSize >= screenHeight|| snakeHeadY * snakeSize < 0){
      setState("game over");

    }

}
function checkSnakeColisions(snakeHeadX, snakeHeadY){
    for (var i = 1; i < snakeLength; i++ ){ //starts with 1 because it's not necessary to check the head
      if(snakeHeadX == snake[i].x && snakeHeadY == snake[i].y){
        setState("game over");

        return;
      }
    }
}

/*//////////////////////////////////////////
GAME STATE HANDLING
 __________________________________________*/
 function setState(state) {
   gameState = state; //set the state of the game
   showMenu(state); // show menu
 }

 /*//////////////////////////////////////////
 MENU FUNCTIONS
  __________________________________________*/
 function displayMenu(menu) { //shows game over menu
   menu.style.visibility = "visible";

 }
 function hideMenu(menu){
   menu.style.visibility = "hidden"; //hides the menu
 }

 function showMenu(state) { // show menu depending on the state
   if (state == "game over"){ // game over or play state
     displayMenu(gameOverMenu);
   }
   else if (state == "play"){
     displayMenu(playHUD);
   }
   else if (state == "main"){
     displayMenu(mainMenu);
   }
 }
 function centerMenuPosition(menu) {
   menu.style.top = (screenHeight/2) - (menu.offsetHeight /2)+ "px";
   menu.style.left = (screenWidth/2) - (menu.offsetWidth /2) + "px";

 }
 function drawScoreBoard() {
   scoreboard.innerHTML = 'score: ' + score;
 }
