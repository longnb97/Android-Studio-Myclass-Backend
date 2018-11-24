const http = require("http");
const express = require("express"),
  app = (module.exports.app = express());

const PORT = process.env.PORT || 5000;
let server = http.createServer(app);

const io = require("socket.io").listen(server); //pass a http.Server instance

const path = require("path");
const INDEX = path.join(__dirname, "index.html");

const cors = require("cors");

app.use(cors());

server.listen(PORT, console.log(`Server listening at ${PORT}`));

io.on("connection", function(socket) {
  console.log(`${socket.id}:  Đã kết nối(Connected)`);
  socket.on("disconnect", () =>
    console.log(`Hủy kết nối(Disconnected) :  ${socket.id}`)
  );

  socket.emit("socketid", socket.id);

  // mobile app
  socket.on("client-state-on", data => {
    // socket.emit("client-state-on", data);
  });//true

  socket.on("client-state-off", data => {
    // socket.emit("client-state-off", data);
  });//false

  setInterval(function() {
    socket.emit("sleepy", "doSomeThingFunny!");
  }, 20000);
  socket.on("stayWithMe", data => console.log(data));
});

app.get("/", home);

function home(req, res) {
  res.sendFile(INDEX);
}
