const path = require('path');
var fs = require('fs');
var http = require('http');
const SerialPort = require("serialport");
const { ReadlineParser } = require("@serialport/parser-readline");
const filePath = path.join(__dirname, '../public/');
const sqlite3 = require('sqlite3').verbose();
const express = require('express');
const { Socket } = require('socket.io');
const { create } = require('domain');
const { stringify } = require('querystring');
var app = module.exports.app = express();
const animationCreator = require ('./routes/animationCreator.js');

app.use('/routes', animationCreator);
app.use(express.static('./public'));

app.get('/',(req,res)=>{
  res.sendFile(path.resolve(__dirname,'index.html'));
});


var server = http.createServer(app);

// const parsers = SerialPort.parsers;
// const parser = new ReadlineParser({ delimeter: "\r\n" });

// const port = new SerialPort.SerialPort({
//   path: "COM4",
//   baudRate: 9600,
//   //dataBits: 8,
//   //parity: "none",
//   //stopBits: 1,
//   //flowControl: false,
// });

// port.pipe(parser);

 var io = require('socket.io')(server);

// io.on('connection',function(socket){
//   console.log("Node.js is on");
//   socket.on('lights',function(data){
//     //Send information to Arduino
//     //port.write(data.id);
//     //console.log(data);
//   });
// });
// // Read the port data
// //io.on('data',function(data){
//   //console.log(data);
// //});

// parser.on('data',function(data){
//   console.log(data);
//   for(let i=0;i<=64;i++){
//     if(data[i+1]==='1'){
//       console.log(i+1, "is being pressed");
//     }
//   }
// })


//Socket sent by the animation page
io.on('connection',function(socket){
  socket.on('createFrame',function(but_arr, text, frameNumber, delay){
    createFrame(but_arr, text, frameNumber, delay);
  });
});

io.on('connection',function(socket){
  socket.on('delete',function(fileNumber){
    console.log("delete called" + fileNumber);
    deleteFile(fileNumber);
  });
});

io.on('connection',function(socket){
  socket.on('createAnimation',function(animationName){
    createAnimation(animationName);
  });
});

io.on('connection',function(socket){
  socket.on('saveAll',function(fileNumber){
    console.log("saveAll");
    saveAll();
  });
});

io.on('connection',function(socket){
  socket.on('saveChanges',function(but_arr, animationName, frameNumber, delay, callback){
    saveChanges(but_arr, animationName, frameNumber, delay);
    setTimeout(() => {
      callback('Changes saved successfully');
    }, 50);
  });
});

function createAnimation(animationName){
  const db = new sqlite3.Database('animationsDB.db');

  const dateToday = new Date().toLocaleDateString();
  const query = `INSERT INTO animations (animationsName, CreationDate) VALUES (?,?)`;
  const values = [animationName, dateToday];

  db.run(query, values, function(err) {
    if (err) {
      console.error('Error:', err.message);
    } else {
      console.log('Success, ID:', this.lastID);
    }

  });

}
function createFrame(but_arr, text, frameNumber, delay){
  let but_arr_string = JSON.stringify(but_arr);

  const db = new sqlite3.Database('animationsDB.db');

  const query = `INSERT INTO frames (AnimationID, FrameNumber, FrameLights, Delay)
  SELECT animations.ID, ?, ?, ?
  FROM animations
  WHERE animations.AnimationsName = ?`;

  const values = [frameNumber, but_arr_string, delay, text];

  db.run(query, values, function(err) {
    if (err) {
      console.error('Error:', err.message);
    } else {
      console.log('Success, ID:', this.lastID);
    }

  });

}

function saveChanges(but_arr_obj, animationName, frameNumber, delay)
{
  let but_arr_string = JSON.stringify(but_arr_obj);

  const db = new sqlite3.Database('animationsDB.db');

  //Substitute for JOIN?
  const query = `UPDATE frames
  SET FrameLights = ?,
      delay = ?
  WHERE FrameNumber = ? AND AnimationID = (
    SELECT ID FROM animations WHERE AnimationsName = ?
  );
`;

  db.run(query, [but_arr_string, delay, frameNumber, animationName], (err) => {
    if (err) {
      console.error('Error:', err);
    } else {
      console.log('Update Sucessful');
    }
  });
}

server.listen(3000);