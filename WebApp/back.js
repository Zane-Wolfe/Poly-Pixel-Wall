var http = require("http");
const SerialPort = require("serialport");
const { ReadlineParser } = require("@serialport/parser-readline");
var fs = require("fs");

var index = fs.readFileSync("index.html");

const parsers = SerialPort.parsers;
const parser = new ReadlineParser({ delimeter: "\r\n" });

const port = new SerialPort.SerialPort({
  path: "COM3",
  baudRate: 9600,
  dataBits: 8,
  parity: "none",
  stopBits: 1,
  flowControl: false,
});

port.pipe(parser);

//setTimeout(function(){
  //port.write("1");
//},2000);

//<script src="js/button.js"></script>

var app = http.createServer(function(req,res){
  res.writeHead(200,{'Content-Type':'text/html'});
  res.end(index);
});


var io = require('socket.io')(app);

io.on('connection',function(data){
  console.log("Node.js is listening");
});

parser.on('data',function(){
  console.log(data);
  io.emit('data',data);
});

app.listen(3000);