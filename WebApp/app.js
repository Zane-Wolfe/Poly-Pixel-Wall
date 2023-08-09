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



server.listen(3000);