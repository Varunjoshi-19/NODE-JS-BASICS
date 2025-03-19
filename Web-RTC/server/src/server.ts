import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { Server, Socket } from "socket.io";
import http from 'http';
import { Manager } from './UserManager';
import { nameToRoomIdMapping, roomIdToNameMapping, RoomManger } from './RoomManger';

const app = express();
const port = 3000;
const server = http.createServer(app);


app.use(bodyParser.json());
app.use(cors({
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true
}));


const io = new Server(server, {

    cors: {
        origin: "*",

    }

});



app.post("/rooms/create-room", RoomManger.createRoom);


io.on("connection", (socket) => {

    console.log("User connected with id => ", socket.id);


    // join in it's own room means owner
    socket.on("room-created", ({ name, roomId }) => {
        socket.join(roomId);
        socket.emit("creator-joined", { roomId });
        socket.emit("user-joined", { roomId });
    });


    // join in already created room 
    socket.on("user-join", ({ name, roomId }) => {
        const value = roomIdToNameMapping.get(roomId);
        console.log(value);
        if (value) {
            socket.join(roomId);
            console.log("joined");
            socket.emit("user-joined", { roomId });
            roomIdToNameMapping.set(roomId, name);
            nameToRoomIdMapping.set(name, roomId);
            socket.broadcast.to(roomId).emit("new-user", { name })
        }
        else {
            console.log("failed")
            socket.emit("failed-join", { roomId });
        }
    })

    socket.on("user-call", (data) => {
        const { username, SDP } = data;
        const roomId = nameToRoomIdMapping.get(username);
        socket.broadcast.to(roomId).emit("incomming-call", { from: username, SDP });
    });

    socket.on("call-accepted", (data) => {
        console.log(`Call accepted of ${data.By}`, data.SDP);
        const roomId = nameToRoomIdMapping.get(data.By);
        socket.broadcast.to(roomId).emit("call-accepted", data);

    })

    socket.on("disconnect", () => {
        console.log("User disconnected with id => ", socket.id);
    });
})



server.listen(port, () => {
    console.log(`Server running on port ${port}`);
})