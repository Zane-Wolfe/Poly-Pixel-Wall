const path = require('path');
var fs = require('fs');
var http = require('http');
const SerialPort = require("serialport");
const { ReadlineParser } = require("@serialport/parser-readline");
const filePath = path.join(__dirname, '../public/');


const express = require('express');
const { Socket } = require('socket.io');
const { create } = require('domain');
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
    //port.write(data.id);
    //console.log(data);
  });
});

//Socket sent by the animation page
io.on('connection',function(socket){
  socket.on('anim',function(data){
    console.log(data);
    checkFile(data,0,'anim');
  });
});

io.on('connection',function(socket){
  socket.on('delay',function(delay){
    console.log(delay);
    checkFile(delay,0,'delay');
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

// Maybe use DataBase instead of files?
//Function to check if file exists in directory. If exists, calls itself and increment the number on the file name.
function checkFile(data, increment = 0, type){
  console.log(increment, type);
  var file = 'animation_' + increment + '.txt';
  fs.stat(file, function(err) {
  if (err == null) {
    // file exists
    console.log('File exists');
    if(type == 'anim'){
      return checkFile(data, increment+1, type);
    }else if(type == 'delay'){
      return checkFile(data, increment+1, type);
    }

  } else if (err.code === 'ENOENT') {
    // file does not exist
    if(type == 'anim'){
      createFile(data, file, type);
    }else if(type == 'delay'){
      createFile(data, file, type);
    }
    
  } else {
      //Error
      console.log('Error: ', err.code);
  
    }
  });
}
//Function to create a list to be sent on the file.
function createFile(data, file, type){
  var list = [];
  if(type == 'anim'){
    for(var i=0; i<8; i++){
      for(var j=0; j<8;j++){
        //Pushing elements to the string
        color = data[i][j].color;
        list.push('led['+i+']['+j+']' + color + ';' );
      }
    }
  }else if(type == 'delay'){
    list.push('delay = ' + data + 'ms');
  }
  //Function to create the file
  fs.writeFileSync(file, list.toString().replaceAll(',', ''), function(err){
    if(err){
      console.log('error', err);
    }
  });
  console.log("File Created");
}

//Function to delete file
function deleteFile(fileNumber){
  var file = 'animation_' + fileNumber + '.txt';

  fs.stat(file, function(err) {
    if (err == null) {
      // file exists
      console.log('File exists');
      //delete file
      fs.unlink(file, function(err){
        if(err){
          console.log(err);
        }
        console.log("\nDeleted File: " + file);
      });
      console.log('File deleted');
    } else if (err.code === 'ENOENT') {
      // file does not exist
    } else {
        //Error
        console.log('Error: ', err.code);
      }
    });
}

var list = [];
function saveAll(increment = 0){

  file = "animation_" + increment + ".txt";
  fs.stat(file, function(err) {

    if (err == null) {
      // file exists
      console.log('File exists');
      fs.readFile(file, 'utf-8', (err, data) =>{
        if(err){
          console.error(err);
          return
        }
        list.push(data + '\n');
        return saveAll(increment+1);

      });
      //delete file
    } else if (err.code === 'ENOENT') {
      file = 'animation_final.txt';
      fs.writeFileSync(file, list.toString().replaceAll(',', ''), function(err){
        if(err){
          console.log('error', err);
        }
        console.log("file created");
      });
      for(var i=0; i<increment; i++){
        deleteFile(i);
      }
      // file does not exist
    } else {
        //Error
        console.log('Error: ', err.code);
      }
    });
}
server.listen(3000);