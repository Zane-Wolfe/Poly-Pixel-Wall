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
app.use(express.static('./public'));
var server = http.createServer(app);

app.get('/',(req,res)=>{
  res.sendFile(path.resolve(__dirname,'index.html'));
});

app.get('/animations_name', (req, res) => {
  const db = new sqlite3.Database('animationsDB.db');

  const query = 'SELECT DISTINCT animation_name FROM animations';

  db.all(query, [], (err, rows) => {
    if (err) {
      throw err;
    }
  
    const uniqueAnimationNames = rows.map(row => row.animation_name);

    console.log(uniqueAnimationNames);
    res.json(uniqueAnimationNames);

    db.close();
  });
  
});

app.get('/getFrameNumber', (req, res) => {
  const db = new sqlite3.Database('animationsDB.db');
  const animationName = req.query.animation_name;

  const query = 'SELECT MAX(frame_number) AS last_frame_number FROM animations WHERE animation_name = ?';

  db.get(query, [animationName], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row || row.last_frame_number === null) {
      res.status(404).json({ error: 'Animation not found' });
      return;
    }
    const lastFrameNumber = row.last_frame_number;

    res.json({ last_frame_number: lastFrameNumber });
    console.log(lastFrameNumber);
    db.close();
  });
});
  
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
  socket.on('createFrame',function(but_arr, text, frameNumber){
    createFrame(but_arr, text, frameNumber);
  });
});

io.on('connection',function(socket){
  socket.on('delete',function(fileNumber){
    console.log("delete called" + fileNumber);
    deleteFile(fileNumber);
  });
});

io.on('connection',function(socket){
  socket.on('saveAll',function(fileNumber){
    console.log("saveAll");
    saveAll();
  });
});


function createFrame(but_arr, text, frameNumber)
{
  let delay = parseInt(but_arr.delay);
  const animationName = text;
  let but_arr_obj = { ...but_arr };
  delete but_arr_obj.delay;

  let but_arr_string = JSON.stringify(but_arr_obj);

  const db = new sqlite3.Database('animationsDB.db');

  const query = `INSERT INTO animations (animation_name, frame_number, frame_json, delay) VALUES (?,?,?,?)`;
  const values = [animationName, frameNumber, but_arr_string, delay];

  db.run(query, values, function(err) {
    if (err) {
      console.error('Error:', err.message);
    } else {
      console.log('Success, ID:', this.lastID);
    }

    db.close();
  });

}


server.listen(3000);