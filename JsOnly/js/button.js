//var socket = io();
const gridLayout = document.getElementById("layout");
const but_arr = [];
var button = {};

function createButtons(row, col){
 var count = 0;

 //creating array of objects and inserting the button object
 for(var i=0; i<row; i++){
  but_arr[i] = []
   for(var j=0; j<col; j++){
      const newBut = document.createElement("Button");
    
      button = {
      id: "but_"+ i + "_" + j,
      active: false
    };

      but_arr[i][j] = button;

      //Creating the buttons on the index.html with the attributes
      newBut.setAttribute("class", "but");
      newBut.setAttribute("id", "but_"+i+"_"+j);
      newBut.setAttribute("onClick", "changeColor(this.id)");
      gridLayout.appendChild(newBut);

      count++;
   }
 }
 document.getElementById("layout").style.gridTemplateColumns = "repeat("+row+", 60px)";
}

createButtons(8,8);

console.log(but_arr);

function changeColor(elid){

  //Taking button position from button id
  var row = parseInt(elid[4]);
  var col = parseInt(elid[6]);

  console.log(row, col);
  console.log(elid);

  //Check if button is active, if false it and turn background
  // to red
  if(but_arr[row][col].active == false){
      document.getElementById(elid).style.background= "red";
      //socket.emit('lights', {status:elid});
      but_arr[row][col].active = true;
  // Check if button is NOT active, if true change the background to
  // white
  }else if(but_arr[row][col].active == true){
      document.getElementById(elid).style.background= "white";
      //socket.emit('lights', {status:elid});
      but_arr[row][col].active = false;
    }
    console.log(but_arr[row][col].active);
}

function reset(elid){
  //TODO also deactivate all the buttons
  console.log(elid);
  elements = document.getElementsByClassName("but");
  for(var i=0; i<elements.length; i++){
    elements[i].style.background = "white";
  }
  document.getElementById(elid).style.background = "white";
  //socket.emit('lights', {status:elid});

}

function isActive(elid){


}
function activateButton(elid){

}

function deactivateButton(elid){

}
//socket.on('data', function(data){

  //console.log(data);

//});

