const express = require('express');
const cors = require('cors');  // Add this line to import CORS
const app = express();
const chats = require('./data/data');
const userRoutes = require('./Routes/userRoutes')
const chatRoutes= require('./Routes/chatRoutes');
const {notFound,errorHandler} = require('./middleware/errorMiddleware')
const messageRoutes = require('./Routes/messageRoutes')
const reminderRoutes = require("./Routes/reminderRoutes");
const checkReminders = require("./utils/reminderScheduler");
const authRoutes = require("./Routes/authRoutes")
const connectDB = require('./config/db');
const path = require("path");
require('dotenv').config();
connectDB();

app.use(express.json())
// Allow requests from your frontend (localhost:3000)
app.use(cors({
  origin: 'https://chat-app-frontend-9exp.onrender.com',  // Replace with your frontend URL
  methods: 'GET, POST, PUT, DELETE',  // Define allowed methods
  allowedHeaders: 'Content-Type, Authorization',  // Define allowed headers
}));

app.get('/', (req, res) => {
  res.send('API Running!');
});


app.use('/api/user',userRoutes);
app.use('/api/chat',chatRoutes);
app.use('/api/message',messageRoutes)
app.use("/api/reminders", reminderRoutes);
app.use('/api/auth', authRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
checkReminders();

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(`Server running on PORT ${PORT}...`)
);

const io = require("socket.io")(server,{
  pinTimeout:60000,
  cors:{
    origin:"http://localhost:3000",

  }
})

io.on( "connection",(socket) =>{
  console.log("Connected to socket.io");


  socket.on("setup", (userData) => {
    socket.join(userData._id);
     console.log(userData._id);
    
     socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });  


  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;

      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });


  socket.on("deleteMessage", (messageId) => {
    io.emit("messageDeleted", messageId); // Broadcast to all users
  });
  socket.off("setup",() =>{
    console.log("USER DISCONNECTED");
    socket.leave(userData._id)
    
  })

})