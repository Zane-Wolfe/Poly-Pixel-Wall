var socket = io();
const gridLayout = document.getElementById("layout");
var but_arr = [];
var button = {};

function createButtons(row, col){
    for(var i=0; i<row; i++){
     //Create array of objects button
     but_arr[i] = []
      for(var j=0; j<col; j++){
         const newBut = document.createElement("Button");
   
         //Create attributes for the object button
         button = {
         id: "but_"+ i + "_" + j,
         active: false,
         opacity: 1,
         color: "#B4A5A5"
       };
         //Add object to the array at that position
         but_arr[i][j] = button;

         //Dynamically add the buttons in the HTML with the attributes
         newBut.setAttribute("class", "but");
         newBut.setAttribute("id", "but_"+i+"_"+j);
         newBut.setAttribute("onClick", "changeColor(this.id)");

         //Insert them into the div
         gridLayout.appendChild(newBut);
   
      }
    }
    document.getElementById("layout").style.gridTemplateColumns = "repeat("+row+", 60px)";
   }

   //Function call
   createButtons(8,8);

   function changeColor(elid){

    var row = parseInt(elid[4]);
    var col = parseInt(elid[6]);
    var color = "#B4A5A5";
  
    console.log(row, col);
    console.log(elid);
    
    if(isActive(row, col)==false){
      //Select color from color picker
      color = document.getElementById('colorPicker').value;
      document.getElementById(elid).style.background = color ;
      activateButton(row, col);
  
  // Check if button is NOT active, if true change the background to
  // white
  }else if(isActive(row, col)){
      document.getElementById(elid).style.background= color;
      deactivateButton(row, col);
    }
    console.log(but_arr[row][col].active);
    but_arr[row][col].color = color;
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
  
  }
  
  //Function to Check if the button is active
  function isActive(row, col){
  
    if(but_arr[row][col].active === true){
      console.log("is Active");
      return true;
  
  }else if(but_arr[row][col].active === false){
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
  
  function applyAll() {
      let elements = document.getElementsByClassName("but");
      let color = document.getElementById('colorPicker').value;
      for (let i = 0; i < elements.length; i++) {
          elements[i].style.background = color;
      }

      for (let i = 0; i < 8; i++) {
          for (let j = 0; j < 8; j++) {
              but_arr[i][j].active = true;
              but_arr[i][j].color = color;
          }
      }
  }

  var countAnim = 0;

  function saveFrame(){
    var ulList = document.getElementById("list-of-anim");
    var newList = document.createElement('li');

    newList.setAttribute("class", "li-anim");
    newList.textContent = 'Frame ' + countAnim;
    ulList.appendChild(newList);

    countAnim++;

    //Add attribute "delay" to but_arr object
    let new_but_arr = {...but_arr};

    new_but_arr.delay = document.getElementById('delay').value;

    socket.emit('createFrame', new_but_arr);
  }

  function addDelay(){
    console.log("add delay");
  }

  function deleteFrame(){
    var ulList = document.getElementById("list-of-anim");
    var list = document.getElementsByClassName('li-anim')[countFrames-1];
    if (countAnim!==0){
      countAnim--;
      ulList.removeChild(list);
    }
    socket.emit('delete', countFrames);
  }

  function saveAll(){
    var ulList = document.getElementById("list-of-anim");
    while(ulList.firstChild){
      ulList.removeChild(ulList.firstChild);
    }
    countFrames = 0; 
    countAnim = 0;
    socket.emit('saveAll');
  }
  