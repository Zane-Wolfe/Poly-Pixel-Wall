var socket = io();
const gridLayout = document.getElementById("layout");
const but_arr = [];
var button = {};

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
      newBut.setAttribute("id", "but_"+i+"_"+j);
      newBut.setAttribute("onClick", "changeColor(this.id)");
      //Insert them into the div
      gridLayout.appendChild(newBut);

      count++;
   }
 }
 document.getElementById("layout").style.gridTemplateColumns = "repeat("+row+", 60px)";
}
//Function call
createButtons(8,8);

console.log(but_arr);

function changeColor(elid, color){

  var row = parseInt(elid[4]);
  var col = parseInt(elid[6]);

  console.log(row, col);
  console.log(elid);
  
<<<<<<< HEAD
  if(isActive(row, col)==false){
    //Select color from color picker
    document.getElementById(elid).style.background= document.getElementById('colorPicker').value;
    socket.emit('lights', {status:elid});
    activateButton(row, col);

// Check if button is NOT active, if true change the background to
// white
}else if(isActive(row, col)){
    document.getElementById(elid).style.background= "#B4A5A5";
=======
  if(!isActive(elid, row, col)){
    console.log(color);
    document.getElementById(elid).style.background= color;
    socket.emit('lights', {status:elid});
    activateButton(elid, row, col);

// Check if button is active, if true change the background to
// white

}else if(isActive(elid, row, col)){
    document.getElementById(elid).style.background= "white";
>>>>>>> f26fe537693028ba3e1bdbdc67ba763bf7a3881a
    socket.emit('lights', {status:elid});
    deactivateButton(row, col);
  }
  console.log(but_arr[row][col].active);
}

//Function to Reset all the buttons
function reset(elid){

  elements = document.getElementsByClassName("but");
  for(var i=0; i<elements.length; i++){
    elements[i].style.background = "#B4A5A5";
  }

  //Set each button object to false
  for(var i=0; i<8; i++){
    for(var j=0; j<8; j++){
      but_arr[i][j].active = false;
    }
  }
  //document.getElementById(elid).style.background = "white";

  socket.emit('lights', {status:elid});

}

//Function to Check if the button is active
function isActive(row, col){

  if(but_arr[row][col].active == true){
    console.log("is Active");
    return true;

}else if(but_arr[row][col].active == false){
    console.log("Is not active");
    return false;
    
  }
  console.log(but_arr[row][col].active);
}

function activateButton(row, col){
  but_arr[row][col].active = true;
}

function deactivateButton(row, col){
  but_arr[row][col].active = false;
}
<<<<<<< HEAD
=======

//Function to create JSON object
//TODO Send it to the arduino

function sendJson(elid, color){

  var obj = new Object();
  obj.id = elid; 
  obj.color = color; 
  
  var stringObj = JSON.stringify(obj);

  return stringObj;
  
}
// function physicalButton(data){
//   var text = data;
//   var button_id = text.id;
//   var button_color = text.color;
//   var row = text.x;
//   var col = text.y;

//   console.log(data)
//   console.log(button_id);
//   console.log(text.color);
//   console.log(row);
//   console.log(col);

>>>>>>> f26fe537693028ba3e1bdbdc67ba763bf7a3881a

// }
socket.on('json', function(data){

console.log(data);
var color = data.color;
var id = data.id;
//var row = data.row;
// var col = data.col;
changeColor(id,color);

});
