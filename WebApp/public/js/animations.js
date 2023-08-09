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

  function newFrame(){
    const ulList = document.getElementById("list-of-anim");
    var newList = document.createElement('li');
    const textarea = document.querySelector('textarea[name="animation-name"]');
    const countAnim = ulList.children.length;
    const name = textarea.value;
    newList.setAttribute("class", "li-anim");
    newList.textContent = 'Frame ' + countAnim;
    ulList.appendChild(newList);

    const delay = document.getElementById('delay').value;

    const dataToSend = {
      but_arr: but_arr,
      name: name,
      frameNumber: countAnim,
      delay: delay
    };
    fetch('/routes/createFrame', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dataToSend)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Error');
      }
      return response.json();
    })
    .then(data => {
      console.log('response:', data);
    })
    .catch(error => {
      console.error('Error:', error);
    });
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
    document.getElementById('anim-selected').textContent = "No Animation Selected"; 
    selectAnimation("No Animation Selected", true);
  }

function createAnimation(){
  const modal = document.getElementById('modal-create');
  const closeModal = document.getElementById('modal-button-create');

  modal.showModal();

  closeModal.removeEventListener('click', closeModalCreateHandler);
  closeModal.addEventListener('click', closeModalCreateHandler);
  
}

function closeModalCreateHandler(){
  const ulList = document.getElementById("list-of-anim");
  const modal = document.getElementById('modal-create');
  const textarea = document.getElementById('animation-name');
  const animationName = textarea.value;

  if(animationName === "")
  {
    console.log("Dialog empty");
  }else{
    modal.close();

    fetch('/routes/createAnimation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({animationName: animationName})
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Error');
      }
      return response.json();
    })
    .then(data => {
      console.log('response:', data);
    })
    .catch(error => {
      console.error('Error:', error);
    });

    ulList.innerHTML = "";
    selectAnimation(animationName, false);
  }
}

function editAnimation(){
  const modal = document.getElementById('modal-edit');
  const closeModal = document.getElementById('modal-button-edit');

  modal.showModal();
  closeModal.removeEventListener('click', closeModalHandler);

  //Grab Animation Names From Nodejs and put them as options on the Select Tag
  fetch('/routes/animations_name')
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
  const ulList = document.getElementById("list-of-anim");

  if(newAnimationName === ""){
    console.log("Select empty");
  }else{
    fetch(`/routes/getFrameNumber?animation_name=${newAnimationName}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response failed');
      }
      return response.json();
    })
    .then(responseData => {
      selectAnimation(newAnimationName, false);

      console.log(responseData);

      ulList.innerHTML = "";

      responseData.forEach(frames =>{
        const newList = document.createElement('li');
        const liId = "li-anim-" + frames.FrameNumber;

        let selectFrameForEditionFunction = function(){
          selectFrameForEdition(frames.FrameNumber, frames.FrameLights, frames.FrameDelay);
        }
        newList.setAttribute("class", "li-anim");
        newList.setAttribute("id", liId);
        newList.textContent = 'Frame ' + frames.FrameNumber;
        
        newList.removeEventListener('click',selectFrameForEditionFunction);
        newList.addEventListener('click', selectFrameForEditionFunction);

        ulList.appendChild(newList);

      });

      modal.close();
    })
    .catch(error => {
      console.error('Error:', error);
    });
  }
}

function selectAnimation(text, status){
  document.getElementById('anim-selected').innerHTML = text;

  const buttons = document.querySelectorAll('.but-function-anim');

  buttons.forEach(button => {
    button.disabled = status;
  });

}

function saveChanges(frameNumber) {
  const animationName = document.getElementById('anim-selected').textContent;
  const newDelay = document.getElementById('delay').value;
  const ulList = document.getElementById("list-of-anim");

  const dataToSend = {
    but_arr: but_arr,
    animationName: animationName,
    frameNumber: frameNumber,
    newDelay: newDelay
  };

  fetch('/routes/saveChanges', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(dataToSend)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response failed');
    }
    return response.json();
  })
  .then(responseData => {
    ulList.innerHTML = "";

    responseData.forEach(frames => {
      const newList = document.createElement('li');
      const liId = "li-anim-" + frames.FrameNumber;

      let selectFrameForEditionFunction = function(){
        selectFrameForEdition(frames.FrameNumber, frames.FrameLights, frames.FrameDelay);
      }
      newList.setAttribute("class", "li-anim");
      newList.setAttribute("id", liId);
      newList.textContent = 'Frame ' + frames.FrameNumber;

      newList.removeEventListener('click', selectFrameForEditionFunction);
      newList.addEventListener('click', selectFrameForEditionFunction);

      ulList.appendChild(newList);
    });
  })
  .catch(error => {
    console.error('Error:', error);
  });
}

function selectFrameForEdition(frameNumber, frameInfo, delay){
  const frameInfoJSON = JSON.parse(frameInfo);
  const saveChangesButton = document.getElementById('saveChanges');
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
  
  saveChangesButton.onclick = function() {
    saveChanges(frameNumber);
  }
}
