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
  socket.on('createFrame',function(but_arr, text){
    createFrame(but_arr, text);
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

io.on('connection', function(socket){
  socket.on('createAnimation', function(name){
    createTable(name);
  });
});

function createFrame(but_arr, text)
{
  let delay = parseInt(but_arr.delay);
  const tableName = text;
  let but_arr_obj = { ...but_arr };
  delete but_arr_obj.delay;

  let but_arr_string = JSON.stringify(but_arr_obj);

  const db = new sqlite3.Database('animationsDB.db');

  const query = `INSERT INTO ${tableName} (buttons, delay) VALUES (?,?)`;
  const values = [but_arr_string, delay];

  db.run(query, values, function(err) {
    if (err) {
      console.error('Error:', err.message);
    } else {
      console.log('Success, ID:', this.lastID);
    }

    db.close();
  });

}

function createTable(name)
{
  const db = new sqlite3.Database('animationsDB.db');
  const tableName = name;

  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS ${tableName} (
        ID INTEGER PRIMARY KEY AUTOINCREMENT,
        buttons TEXT,
        delay INTEGER
      )
    `);
  });

 db.close((err) => {
  if (err) {
    return console.error(err.message);
  }
});
  
}

server.listen(3000);