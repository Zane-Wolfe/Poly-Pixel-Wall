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
  
  if(!isActive(elid, row, col)){
    console.log(color);
    document.getElementById(elid).style.background= color;
    socket.emit('lights', {status:elid});
    activateButton(elid, row, col);

// Check if button is active, if true change the background to
// white

}else if(isActive(elid, row, col)){
    document.getElementById(elid).style.background= "white";
    socket.emit('lights', {status:elid});
    deactivateButton(elid, row, col);
  }
  console.log(but_arr[row][col].active);
}

//Function to Reset all the buttons
//TODO also deactivate all the buttons
function reset(elid){
  console.log(elid);
  elements = document.getElementsByClassName("but");
  for(var i=0; i<elements.length; i++){
    elements[i].style.background = "white";
  }
  document.getElementById(elid).style.background = "white";

  socket.emit('lights', {status:elid});

}

//Function to Check if the button is active
function isActive(elid, row, col){
  console.log(row, col);
  console.log(elid);

  if(but_arr[row][col].active == true){
    console.log("is Active");
    return true;

}else if(but_arr[row][col].active == false){
    console.log("Is not active");
    return false;
    
  }
  console.log(but_arr[row][col].active);
}

function activateButton(elid, row, col){
  but_arr[row][col].active = true;
}

function deactivateButton(elid, row, col){
  but_arr[row][col].active = false;
}

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


// }
socket.on('json', function(data){

console.log(data);
var color = data.color;
var id = data.id;
//var row = data.row;
// var col = data.col;
changeColor(id,color);

});
