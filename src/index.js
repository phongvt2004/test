const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
server.listen(8080)
const path = require('path');
const cors = require('cors');
const handlebars = require('express-handlebars');
const port = process.env.PORT || 8080;
const ChatController = require('./app/controllers/ChatController')

app.use('/api', cors())

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
const route = require('./routes')
const db = require('./config/db');

db.connect();

app.use(express.static(path.join(__dirname, 'uploads', 'message')));
app.use(express.static(path.join(__dirname, 'uploads', 'questions')));
route(app);

var chatSocket = io.of('/chat')

chatSocket.on('connection', function(socket){
  console.log('connection')
  socket.on('join', (groupId) => {
    socket.currentRoom = groupId;
    socket.join(groupId)
  })
  socket.on('inputChatMessage', function(chat){
    ChatController.createChatMessage(chat)
      .then((chat) => {
        chatSocket.in(socket.currentRoom).emit('outputChatMessage', chat);
      })
  });
  // socket.on('notifyUser', function(user){
  //   chatSocket.emit('notifyUser', user);
  // });

  socket.on('disconnect', () => {
    socket.leave(socket.currentRoom)
  })
  
});


app.engine(
  'hbs',
  handlebars({
      extname: '.hbs',
  }),
);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources', 'views'));
