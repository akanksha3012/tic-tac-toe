// importing modules
const express = require("express");
const http = require("http");
const mongoose = require("mongoose");

const app = express();
const port = process.env.PORT || 3000;
var server = http.createServer(app);
const Room=require("./models/room");

var io = require("socket.io")(server);


// middle ware
app.use(express.json());

const DB="mongodb+srv://burnwalakanksha30:SPC.admin1@cluster0.phhknoo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

io.on("connection", (socket) => {
    console.log("connected!");
    socket.on("createRoom", async ({nickname})=>{
        console.log(nickname);
        try{
            let room = new Room();
            let player={
                socketID : socket.id,
                nickname,
                playerType: 'X',
            };
            room.players.push(player);
            //player is stored in room
            room.turn= player;
            room = await room.save();
            //roomid
    
            const roomId=room._id.toString();
            socket.join(roomId);
            //io -> send data to eyeryone
            //socket -> send data to yourself
            io.to(roomId).emit('createRoomSuccess', room);
        }
        catch(e){
            console.log(e);
        }
       
        //player is taken to next screen
    });
    socket.on('joinRoom', async ({nickname, roomId}) => {
        try{
            if(!roomId.match(/^[0-9a-fA-F]{24}$/)){
                socket.emit('errorOccured', 'Please enter a valid roomId.');
                return;
            }
            let room=await Room.findById(roomId);
            if(room.isJoin){
                let player = {
                    nickname,
                    socketId: socket.id,
                    playerType: 'O',
                }
                socket.join(roomId);
                room.players.push(player);
                room.isJoin=false;
                room = await room.save();
                io.to(roomId).emit("joinRoomSuccess", room);
                io.to(roomId).emit("updatePlayers", room.players);
                io.to(roomId).emit("updateRoom", room);
            }else{
                socket.emit('errorOccured', 'The game is in progress. Please try again later.');
            }
        }catch(e){
            console.log(e);
        }
    });
});

socket.on=('tap', async({index, roomId}) => {
    try{
        let room=await Room.findById(roomId);
        let choice = room.turn.playerType;
        if(room.turnIndex == 0){
            room.turn = room.players[1];
            room.turnIndex = 1;
        }
        else{
            room.turn = room.players[0];
            room.turnIndex = 0;
        }
        room=await room.save();
        io.to(roomId).emit('tapped',{
            index,
            choice,
            room,
        })
    }catch(e){
        console.log(e);
    }
    socket.on('winner', async ({
        winnersocketId, roomId})=>{
        try{
            let room = await Room.findById(roomId);
            let player = room.players.find(
              (playerr) => playerr.socketID == winnerSocketId
            );
            player.points += 1;
            room = await room.save();
      
            if (player.points >= room.maxRounds) {
              io.to(roomId).emit("endGame", player);
            } else {
              io.to(roomId).emit("pointIncrease", player);
            }
        }catch(e){
            console.log(e);
        }
    
    });
});

mongoose.connect(DB).then(() => {
    console.log("connection successful");
 }).catch((e) =>{
    console.log(e);
 })
server.listen(port, '0.0.0.0', () => {
    console.log(`Server started and running on port ${port}`);
});

