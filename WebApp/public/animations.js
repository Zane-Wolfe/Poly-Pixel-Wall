var socket = io();
const gridLayout = document.getElementById("layout");
var but_arr = [];
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
         id: count,
         active: false,
         opacity: 1,
         color: "#B4A5A5"
       };
         //Add object to the array at that position
         but_arr[i][j] = button;

         //Dynamically add the buttons in the HTML with the attributes
         newBut.setAttribute("class", "but");
         newBut.setAttribute("id", count);
         newBut.setAttribute("onClick", "changeColor(this.id)");

         //Insert them into the div
         gridLayout.appendChild(newBut);

         count++;
      }
    }
    document.getElementById("layout").style.gridTemplateColumns = "repeat("+row+", 40px)";
   }

   //Function call
   createButtons(16,16);

   function changeColor(elid){

    var row = Math.floor(elid/16);
    var col = elid % 16;
    var color = "#B4A5A5";
  
    console.log(row, col);
    console.log(elid);
    
    if(isActive(row, col)==false){
      //Select color from color picker
      color = document.getElementById('colorPicker').value;
      document.getElementById(elid).style.background = color;
      activateButton(row, col);
  
  // Check if button is NOT active, if true change the background to white
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
    for(var i=0; i<16; i++){
      for(var j=0; j<16; j++){
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

      for (let i = 0; i < 16; i++) {
          for (let j = 0; j < 16; j++) {
              but_arr[i][j].active = true;
              but_arr[i][j].color = color;
          }
      }
  }



  var countAnim = 0;

  function newFrame(){
    var ulList = document.getElementById("list-of-anim");
    var newList = document.createElement('li');
    const textarea = document.querySelector('textarea[name="animation-name"]');

    newList.setAttribute("class", "li-anim");
    newList.textContent = 'Frame ' + countAnim;
    ulList.appendChild(newList);

    //Add attribute "delay" to but_arr object
    let new_but_arr = {...but_arr};

    new_but_arr.delay = document.getElementById('delay').value;

    socket.emit('createFrame', new_but_arr, textarea.value, countAnim);
    countAnim++;
  }

  function deleteFrame(){
    var ulList = document.getElementById("list-of-anim");
    var list = document.getElementsByClassName('li-anim')[countAnim-1];
    if (countAnim!==0){
      countAnim--;
      ulList.removeChild(list);
    }
    
    //Logic here to send socket for deletion
  }

  function saveAll(){
    var ulList = document.getElementById("list-of-anim");
    while(ulList.firstChild){
      ulList.removeChild(ulList.firstChild);
    }
    countAnim = 0;
    document.getElementById('anim-selected').textContent = "No Animation Selected";
    //Logic here to send socket for saving all
  }

function createAnimation(){
  const modal = document.getElementById('modal-create');
  const closeModal = document.getElementById('modal-button-create');

  modal.showModal();

  closeModal.removeEventListener('click', closeModalCreateHandler);
  closeModal.addEventListener('click', closeModalCreateHandler);
  
}

function closeModalCreateHandler(){
  const modal = document.getElementById('modal-create');
  const textarea = document.getElementById('animation-name');

  if(textarea.value === "")
  {
    console.log("Dialog empty");
  }else{
    modal.close();

    socket.emit('createAnimation', textarea.value);
    selectAnimation(textarea.value);
  }
}

function editAnimation(){
  const modal = document.getElementById('modal-edit');
  const closeModal = document.getElementById('modal-button-edit');

  modal.showModal();
  closeModal.removeEventListener('click', closeModalHandler);

  //Grab Animation Names From Nodejs and put them as options on the Select Tag
  fetch('/animations_name')
  .then(response => response.json())
  .then(data => {
    const selectElement = document.getElementById('table-select');

    selectElement.innerHTML = '';

    data.forEach(animationName => {
      const newOption = document.createElement('option');
      newOption.value = animationName;
      newOption.textContent = animationName;
      selectElement.appendChild(newOption);
    });
  })
  .catch(error => console.error('Error:', error));

  closeModal.addEventListener('click', closeModalHandler);
}

function closeModalHandler(){
  const modal = document.getElementById('modal-edit');
  const select = document.getElementById('table-select');
  const newAnimationName = select.options[select.selectedIndex].value

  if(newAnimationName === ""){
    console.log("Select empty");
  }else{
    fetch(`/getFrameNumber?animation_name=${newAnimationName}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response failed');
      }
      return response.json();
    })
    .then(responseData => {
      selectAnimation(newAnimationName);

      console.log(responseData);
      responseData.forEach(frames =>{

      var ulList = document.getElementById("list-of-anim");
      var newList = document.createElement('li');

      newList.setAttribute("class", "li-anim");
      newList.textContent = 'Frame ' + frames.FrameNumber;
      newList.addEventListener('click', function() {
        selectFrameForEdition(frames.FrameNumber, frames.FrameLights, frames.FrameDelay);
      });
      ulList.appendChild(newList);

      });

      modal.close();
    })
    .catch(error => {
      console.error('Error:', error);
    });
  }
}

function selectAnimation(text){
  document.getElementById('anim-selected').innerHTML = text;

  const buttons = document.querySelectorAll('.but-function-anim');

  buttons.forEach(button => {
    button.disabled = false;
  });

}

function selectFrameForEdition(frameNumber, frameInfo, delay){
  const frameInfoJSON = JSON.parse(frameInfo);
  console.log(frameInfoJSON);
  console.log(delay);
  document.getElementById('delay').value = delay;

  for(let array in frameInfoJSON)
  {
    for(let button in frameInfoJSON[array])
    {
      let elid = frameInfoJSON[array][button].id;
      let activeStatus = frameInfoJSON[array][button].active;
      let opacity = frameInfoJSON[array][button].opacity;
      let color = frameInfoJSON[array][button].color;

      but_arr[array][button].id = elid;
      but_arr[array][button].active = activeStatus;
      but_arr[array][button].opacity = opacity;
      but_arr[array][button].color = color;

      document.getElementById(elid).style.background =  color;

    }
  }

  const saveChangesButton = document.getElementById('saveChanges');

  saveChangesButton.removeEventListener('click',function(){
    saveChanges(frameNumber)});
  saveChangesButton.addEventListener('click', function(){
    saveChanges(frameNumber);
  });
}

function saveChanges(frameNumber){
  const animationName = document.getElementById('anim-selected').textContent;
  const newDelay = document.getElementById('delay').value;
  socket.emit('saveChanges', but_arr, animationName, frameNumber, newDelay);

  

}