//Global variables
var gameStatus = 0;  // 0 = no game has started  1 = game is going   2 = game ended, game can restart game 
var winnerStatus = false;

//Clases
class Chip{
    constructor(rowNum){
        this.rowNum = rowNum;
        this.selected = false;
        this.owner = null;
    }
}
class Column{
    constructor(colNum){
        this.colNum = colNum;
        this.arrayOfChips = [];
        this.htmlTag = document.getElementById("col"+colNum);
        //Fill the array
        this.createChips();
    }
}
Column.prototype.createChips = function(){
    var chip;
    for(var i = 0; i<6; i++){
    chip = new Chip(i);
    this.arrayOfChips.push(chip);
    this.createButtons(chip);
    }
}
Column.prototype.createButtons = function(chip){
    var btn = document.createElement("Button");
    btn.id = this.colNum + "" + chip.rowNum;
    btn.className = "chip normal";
    this.appendButton(btn);
}
Column.prototype.appendButton = function(btn){
    this.htmlTag.appendChild(btn);
}
//Board Class
class Board{
    constructor(){
        this.arrayOfColumns = [];
        this.createBoard();
        this.rowMax = 6;
        this.colMax = 7;
    }
}
Board.prototype.createBoard = function(){
    var col;
    for(var i = 0; i < 7; i++){
        col = new Column(i);
        this.arrayOfColumns.push(col);
    }
}
Board.prototype.playTurn = function(event, turn){ 
    var colNumber = parseInt(event.currentTarget.id[3]);  //Determines the actual number of the column where played
    var itemChecked = null;
    for(var i = 5; i >= 0; i--){  //Finds the lowest (highest index) chip
        if(this.arrayOfColumns[colNumber].arrayOfChips[i].selected === false){
            this.arrayOfColumns[colNumber].arrayOfChips[i].selected = true;
            itemChecked = document.getElementById(colNumber+""+i);
            this.arrayOfColumns[colNumber].arrayOfChips[i].owner = turn;
            break;
        }
    }
    if(itemChecked === null) console.log("the column is full");
    else this.updateChipClass(itemChecked,turn);
}
Board.prototype.updateChipClass = function(itemChecked,turn){
    $(itemChecked).removeClass("normal");
    $(itemChecked).addClass("clicked"+turn);
}
class Player{
    contructor (turn, color){
        this.turn = turn;
        this.color = color; 
    }
}
class scoreBoard{
    constructor(colMax,rowMax){
        //DOM elements
            this.instBrdH2 = $('#instBrdH2');
            this.instBrdImg = $('#instBrdImg');
            //Chip counters
            this.p1uDOM = $('#player1used');
            this.p1aDOM = $('#player1available');
            this.p2uDOM = $('#player2used');
            this.p2aDOM = $('#player2available');
            //Time to play
            this.timeBoard =  $('#remainingTime');
        //Variables
        this.p1used = 0;
        this.p1available = colMax*rowMax/2;
        this.p2used = 0;
        this.p2available = colMax*rowMax/2;

        //Update values at game start
        this.updateChipsUsed();
    }
}
scoreBoard.prototype.updateChipsUsed = function(){
    this.p1uDOM.text("Used: "+this.p1used);
    this.p1aDOM.text("Available: "+this.p1available);
    this.p2uDOM.text("Used: "+this.p2used);
    this.p2aDOM.text("Available: "+this.p2available);
}
scoreBoard.prototype.updateInstruction = function(turn, won){
    //won = false: change turn  true: report win
    if(won){
        // Change the H2
        this.instBrdH2.text(turn+" WINS!!!!");
        this.instBrdH2.addClass(turn+"WinsH2");
        // this.instBrdH2.removeClass("startingH2"); Maybe not needed

        // Change the Img
        this.instBrdH2.text(turn+" WINS!!!! Click here to play again");
        this.instBrdImg.addClass(turn+"WinsImg");
        // this.instBrdImg.removeClass("startingImg"); Maybe not needed
    }else{
        var str = (turn === "Player") ? ("It is the "+turn+"'s turn") : ("It is "+turn+"' turn");
        this.instBrdH2.text(str);
    }
}
scoreBoard.prototype.updateTimerDOM = function (time){
    this.timeBoard.text(time);
}
class Game{
    constructor(initialTurn){
        this.board = new Board();
        this.player1 = new Player("Player", "red");
        this.player2 = new Player("Sis", "yellow");
        this.scoreBoard = new scoreBoard(this.board.colMax,this.board.rowMax);
        this.turn = initialTurn;
        this.won = false;
        this.scoreBoard.updateInstruction(this.turn,this.won);  //Set first player to play
        this.interval;
        this.createTimer(this.turn);
        this.lostTurnFlag = false;
        
        //Audios
        this.music = new Audio();
        this.music.src = "./src/startSong.mp3";
        this.music.play();
        // this.music.loop = true;
        this.winSound = new Audio();
        this.winSound.src = "./src/win.mp3";
        this.loseSound = new Audio();
        this.loseSound.src = "./src/lose.mp3";
    }
}
Game.prototype.createTimer = function(turn){
    var counter = 10;
    var that = this;
    this.interval = setInterval(function(){
        counter--;
        console.log(counter);
        that.scoreBoard.updateTimerDOM(counter);
        if(counter <= 0){
            clearInterval(that.interval);
            that.lostTurnFlag = true;
            that.swapTurns();
        }
    },1000)
}
Game.prototype.turnSequence = function(event){
    this.board.playTurn(event,this.turn);
    this.runCheck();
        if(this.won){
            clearInterval(this.interval);
            this.initiateWinSequence();
        }
        else this.swapTurns();
}   
Game.prototype.initiateWinSequence = function(){
    winnerStatus = this.won;
    gameStatus = 2;
    this.music.pause();

    if(this.turn == "Sis") this.loseSound.play();
    else this.winSound.play();

    this.scoreBoard.updateInstruction(this.turn,this.won);
    
    var time = 4;
    var that = this;
    var timeOut = setInterval(function(){
        time--;
        if(time <= 0){
            clearInterval(timeOut);
            that.scoreBoard.instBrdH2.text("Press HERE to go again");
        }
    },1000);
}
Game.prototype.swapTurns = function (){
    clearInterval(this.interval);
    //Adjust Chips
    if(this.turn === "Player"){
        if(!this.lostTurnFlag){
            this.scoreBoard.p1used++;
            this.scoreBoard.p1available--;
        }
        this.turn = "Sis"  //SwapsTurn
    }
    else{
        if(!this.lostTurnFlag){
            this.scoreBoard.p2used++;
            this.scoreBoard.p2available--;
        }
        this.turn = "Player"  //SwapsTurn
    }
    this.lostTurnFlag = this.lostTurnFlag === true ? false : false;

    this.createTimer(this.turn);
    this.scoreBoard.updateInstruction(this.turn,this.won)  
    this.scoreBoard.updateChipsUsed();
}
Game.prototype.runCheck = function (){  //If there is a winner, changes the value of won to TRUE
    this.verticalCheck();
    this.horizontalCheck();
    this.diagonalCheckLtoRBottom();
    this.diagonalCheckLtoRTop();
    this.diagonalCheckRtoLBottom();
    this.diagonalCheckRtoLTop();
}
Game.prototype.verticalCheck = function(){
    for(var i = 0; i<7; i++){
        for(var j = 0; j<3; j++){  //j max is 5-3 = 2
            if( this.board.arrayOfColumns[i].arrayOfChips[j].owner === this.turn &&
                this.board.arrayOfColumns[i].arrayOfChips[j+1].owner === this.turn &&
                this.board.arrayOfColumns[i].arrayOfChips[j+2].owner === this.turn &&
                this.board.arrayOfColumns[i].arrayOfChips[j+3].owner === this.turn) 
                this.won = true;
        }    
    }
}
Game.prototype.horizontalCheck = function(){
    for(var i = 0; i<4; i++){
        for(var j = 0; j<6; j++){
            if( this.board.arrayOfColumns[i].arrayOfChips[j].owner === this.turn &&
                this.board.arrayOfColumns[i+1].arrayOfChips[j].owner === this.turn &&
                this.board.arrayOfColumns[i+2].arrayOfChips[j].owner === this.turn &&
                this.board.arrayOfColumns[i+3].arrayOfChips[j].owner === this.turn) 
                this.won = true;
        }    
    }
}
Game.prototype.diagonalCheckLtoRBottom = function(){
    var count;
    for(var rowStart = 0; rowStart < this.board.rowMax - 3; rowStart++){
        count = 0;
        var row;
        var col;
        for(row = rowStart, col = 0; row < this.board.rowMax && col < this.board.colMax; row++, col++ ){
            if(this.board.arrayOfColumns[col].arrayOfChips[row].owner == this.turn){
                count++;
                if(count >= 4) this.won = true;
            } 
            else{count = 0;}
        }
    }
}
Game.prototype.diagonalCheckLtoRTop = function(){
    var count;
    for(var colStart = 1; colStart < this.board.colMax - 3; colStart++){
        count = 0;
        var row; 
        var col;
        for(row = 0, col = colStart; row < this.board.rowMax && col < this.board.colMax; row++, col++ ){
            if(this.board.arrayOfColumns[col].arrayOfChips[row].owner == this.turn){
                count++;
                if(count >= 4) this.won = true;
            }
            else {count = 0;}
        }
    }
}
Game.prototype.diagonalCheckRtoLBottom = function(){
    var count;
    for(var rowStart = 1; rowStart < this.board.rowMax - 3; rowStart++){
        count = 0;
        var row;
        var col;
        for(row = rowStart, col = 6; row < this.board.rowMax; row++, col-- ){
            if(this.board.arrayOfColumns[col].arrayOfChips[row].owner == this.turn){
                count++;
                if(count >= 4) this.won = true;
            } 
            else{count = 0;}
        }
   }
}
Game.prototype.diagonalCheckRtoLTop = function(){
    var count;
    for(var colStart = 3; colStart < this.board.colMax; colStart++){
        count = 0;
        var row; 
        var col;
        for(row = 0, col = colStart; row < this.board.rowMax && col >= 0; row++, col-- ){
            if(this.board.arrayOfColumns[col].arrayOfChips[row].owner == this.turn){
                count++;
                if(count >= 4) this.won = true;
            }
            else {count = 0;}
        }
    }
}
//Main function
function startGame(){
    gameStatus = 1;
    game = new Game("Player");
}
function restartGame(){
    gameStatus = 2;
    winnerStatus = false;
    game = "";
    console.log("restart");
    window.location.reload(startGame());
}
//Event listeners
$(document).ready(function() {
    // startGame();  //Eliminar comment para probar director
    $(".column").click(function(event){
      if(!winnerStatus){  //If there is no winner, keep playing
        game.turnSequence(event);
      }
    });
    $("#instBrdH2").click(function(){
        if(gameStatus == 0){  //If there is NOT a game going on, start a new one.
            startGame();
        } else if(gameStatus == 2){
            restartGame();
        }
    });
});