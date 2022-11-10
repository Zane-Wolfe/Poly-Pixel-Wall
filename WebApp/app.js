const path = require('path');
var http = require('http');
const SerialPort = require("serialport");
const { ReadlineParser } = require("@serialport/parser-readline");


const express = require('express');
const { Socket } = require('socket.io');
var app = module.exports.app = express();
app.use(express.static('./public'));
var server = http.createServer(app);

app.get('/',(req,res)=>{
  res.sendFile(path.resolve(__dirname,'index.html'));
});

const parsers = SerialPort.parsers;
const parser = new ReadlineParser({ delimeter: "\r\n" });

const port = new SerialPort.SerialPort({
  path: "COM4",
  baudRate: 9600,
  dataBits: 8,
  parity: "none",
  stopBits: 1,
  flowControl: false,
});

port.pipe(parser);



var io = require('socket.io')(server);
io.on('connection',function(socket){
  console.log("Node.js is on");
  socket.on('lights',function(data){
    //Send information to Arduino
    port.write(data.status);
    //io.emit('data',text);
  });
});

//Receive Data from Arduino
port.on('data',function(data){
  text = JSON.parse(data)
  console.log(text);
  //Emit to WebSocket
  io.emit('data',text);

});

server.listen(3000);