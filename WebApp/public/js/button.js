var socket = io();
const gridLayout = document.getElementById("layout");
const but_arr = [];
var button = {};
var mouseDown = 0;

document.body.onmousedown = function() { 
  mouseDown = 1;
}
document.body.onmouseup = function() {
  mouseDown = 0;
}

function createButtons(row, col){
 var count = 0;
 for(var i=0; i<row; i++){
  //Create array of objects button
  but_arr[i] = []
   for(var j=0; j<col; j++){
      const newBut = document.createElement("Button");

      //Create attributes for the object button
      button = {
      id: "but_"+ i + "_" + j,
      active: false
    };
      //Add object to the array at that position
      but_arr[i][j] = button;
      //Dynamically add the buttons in the HTML with the attributes
      newBut.setAttribute("class", "but");
      newBut.setAttribute("id", count);
      newBut.setAttribute("onClick", "changeColor(this.id)");
      newBut.setAttribute("draggable", false);
      //Insert them into the div
      gridLayout.appendChild(newBut);

      count++;
   }
 }
 document.getElementById("layout").style.gridTemplateColumns = "repeat("+row+", 40px)";
 addListeners();
}

//Function call
createButtons(16,16);

console.log(but_arr);

function changeColor(elid){
  var row = Math.floor(elid/16);
  var col = elid % 16;
  const buttonEraser = document.getElementsByName('eraser')[0];
  let color = document.getElementById('colorPicker').value;
 // var color = "#B4A5A5";

  console.log(row, col);
  console.log(elid);
  
  //Select color from color picker
  if(buttonEraser.id == "but-eraser-clicked"){
    color = "#B4A5A5";
    deactivateButton(row,col);

  }else if(buttonEraser.id == "but-eraser-default"){
    color = document.getElementById('colorPicker').value;
    activateButton(row, col);
  }

  document.getElementById(elid).style.background = color ;

  emitSignal(elid, row, col, color, "true");

  console.log(but_arr[row][col].active);
}

//Function to Reset all the buttons
function reset(){

  elements = document.getElementsByClassName("but");

  for(var i=0; i<elements.length; i++){
    elements[i].style.background = "#B4A5A5";
  }

  //Set each button object to false
  for(var i=0; i<16; i++){
    for(var j=0; j<16; j++){
      but_arr[i][j].active = false;
    }
  }

}

//Function to Check if the button is active
function isActive(row, col){
  console.log(but_arr[row][col].active);
  return but_arr[row][col].active;
}

function activateButton(row, col){
  but_arr[row][col].active = true;
}

function deactivateButton(row, col){
  but_arr[row][col].active = false;
}

function applyAll(){

  elements = document.getElementsByClassName("but");
  color = document.getElementById('colorPicker').value;
  for(var i=0; i<elements.length; i++){
    elements[i].style.background = color;
  }

  for(var i=0; i<16; i++){
    for(var j=0; j<16; j++){
      but_arr[i][j].active = true;
      emitSignal("0", i, j, color, true);
    }
  }
}

function emitSignal(elid, _row, _col, _color, _status){
  socket.emit('lights', {id:elid, row: _row, col: _col, color: _color, status: _status})
}

function addListeners(){
  elements = document.getElementsByClassName("but");

  for(var i=0; i<elements.length; i++){
    elements[i].addEventListener('mouseover', function(){

      if (mouseDown == 1) {

        changeColor(this.id);

    }
    }, true);
  }
}

function eraser(elid){
  const eraserButton = document.getElementById(elid);

  if(elid == "but-eraser-default"){
    eraserButton.removeAttribute('id');
    eraserButton.setAttribute("id", "but-eraser-clicked");
  }else if(elid == "but-eraser-clicked"){
    eraserButton.removeAttribute('id');
    eraserButton.setAttribute("id", "but-eraser-default");
  }
}
