//Global variables
var board;
var player1;
var player2;
var currentTurn;

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
    }
}
Board.prototype.createBoard = function(){
    var col;
    for(var i = 0; i<7; i++){
        col = new Column(i);
        this.arrayOfColumns.push(col);
    }
}
Board.prototype.playTurn = function (event){
    var colNumber = parseInt(event.currentTarget.id[3]);  //Determines the actual number of the column where played
    var itemChecked = null;
    for(var i = 5; i >= 0; i--){
        if(this.arrayOfColumns[colNumber].arrayOfChips[i].selected === false){
            this.arrayOfColumns[colNumber].arrayOfChips[i].selected = true;
            itemChecked = document.getElementById(colNumber+""+i);
            this.arrayOfColumns[colNumber].arrayOfChips[i].owner = currentTurn;
            break;
        }
    }
    if(itemChecked === null) console.log("the column is full");
    else this.updateChipClass(itemChecked);
}
Board.prototype.updateChipClass = function (itemChecked){
    $(itemChecked).removeClass("normal");
    $(itemChecked).addClass("clicked"+currentTurn);
    this.checkWinner();
}
Board.prototype.checkWinner = function (){
    if(
    this.verticalCheck() ||
    this.horizontalCheck() ||
    this.diagonalCheckLtoRBottom() ||
    this.diagonalCheckLtoRTop() ||
    this.diagonalCheckLtoRBottom() ||
    this.diagonalCheckLtoRTop())
        console.log(currentTurn + " won"); 
    else{
        currentTurn = currentTurn === "P1" ? "P2" : "P1"
        console.log(currentTurn);
        return false;
    }
}
Board.prototype.verticalCheck = function(){
    var won = false;
    for(var i = 0; i<7; i++){
        for(var j = 0; j<3; j++){  //j max is 5-3 = 2
            if(this.arrayOfColumns[i].arrayOfChips[j].owner === currentTurn &&
                this.arrayOfColumns[i].arrayOfChips[j+1].owner === currentTurn &&
                this.arrayOfColumns[i].arrayOfChips[j+2].owner === currentTurn &&
                this.arrayOfColumns[i].arrayOfChips[j+3].owner === currentTurn) won = true;
        }    
    }
    return won;
}
Board.prototype.horizontalCheck = function(){
    var won = false;
    for(var i = 0; i<4; i++){
        for(var j = 0; j<6; j++){
            if(this.arrayOfColumns[i].arrayOfChips[j].owner === currentTurn &&
                this.arrayOfColumns[i+1].arrayOfChips[j].owner === currentTurn &&
                this.arrayOfColumns[i+2].arrayOfChips[j].owner === currentTurn &&
                this.arrayOfColumns[i+3].arrayOfChips[j].owner === currentTurn) won = true;
        }    
    }
    return won;
}
Board.prototype.diagonalCheckLtoRBottom = function(){
    var won = false;
    var rowMax = 6;
    var colMax = 7;
    for(var rowStart = 0; rowStart < rowMax - 3; rowStart++){
        count = 0;
        var row;
        var col;
        for(row = rowStart, col = 0; row < rowMax && col < colMax; row++, col++ ){
            if(this.arrayOfColumns[col].arrayOfChips[row].owner == currentTurn){
                count++;
                if(count >= 4) won = true;
            } 
            else{count = 0;}
        }
    }
    return won;
}
Board.prototype.diagonalCheckRtoLTop = function(){
    var won = false;
    var rowMax = 6;
    var colMax = 7;
    for(var colStart = 1; colStart < colMax - 3; colStart++){
        count = 0;
        var row; 
        var col;
        for(row = 0, col = colStart; row < rowMax && col < colMax; row++, col++ ){
            if(this.arrayOfColumns[col].arrayOfChips[row].owner == currentTurn){
                count++;
                if(count >= 4) won = true;
            }
            else {count = 0;}
        }
    }
    return won;
}
//Pendiente
Board.prototype.diagonalCheckLtoRBottom = function(){
    var won = false;
    var rowMax = 6;
    var colMax = 7;
    for(var rowStart = 1; rowStart < rowMax - 3; rowStart++){
        count = 0;
        var row;
        var col;
        for(row = rowStart, col = 6; row < rowMax; row++, col-- ){
            if(this.arrayOfColumns[col].arrayOfChips[row].owner == currentTurn){
                count++;
                if(count >= 4) won = true;
            } 
            else{count = 0;}
        }
   }
   return won;
}
Board.prototype.diagonalCheckLtoRTop = function(){
    var won = false;
    var rowMax = 6;
    var colMax = 7;
    for(var colStart = 3; colStart < colMax; colStart++){
        count = 0;
        var row; 
        var col;
        for(row = 0, col = colStart; row < rowMax && col >= 0; row++, col-- ){
            if(this.arrayOfColumns[col].arrayOfChips[row].owner == currentTurn){
                count++;
                if(count >= 4) won = true;
            }
            else {count = 0;}
        }
    }
    return won;
}
class Player{
    contructor (turn, color){
        this.turn = turn;
        this.color = color; 
    }
}
//Main function
function startGame(){
    board = new Board();
    player1 = new Player(true, "red");
    player2 = new Player(false, "black");
    currentTurn = "P1";
}
function gameSequence(){
    
}
startGame();

//Event listeners
$(document).ready(function() {
    $(".column").click(function(event){
      board.playTurn(event,currentTurn);
    });
});