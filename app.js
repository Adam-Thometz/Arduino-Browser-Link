const http = require("http");
const fs = require("fs");
const { SerialPort, ReadlineParser } = require("serialport");
const { Server } = require("socket.io");
require("dotenv").config();

const index = fs.readFileSync("index.html");

const port = new SerialPort({
  path: process.env.ARDUINO_PORT,
  baudRate: 9600
});
const parser = new ReadlineParser();

port.pipe(parser);

const app = http.createServer(function(req, res) {
  res.writeHead(200, {"Content-Type": "text/html"});
  res.end(index)
});

const io = new Server(app);

io.on("connection", data => {
  console.log("Node.js is listening!");
});

parser.on("data", data => {
  console.log(data);
  io.emit("data", data);
});

app.listen(3000);