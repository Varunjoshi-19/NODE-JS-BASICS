import { Socket } from "socket.io";

interface dataPayload {
     data: any;
     socket: Socket;
}


const emailToRoomId = new Map();
const roomIdToEmail = new Map();

export class Manager {


     public static JoinRoom({ data, socket }: dataPayload) {

          socket.join(data.roomId);
          socket.emit("joined-room", data.roomId);
          emailToRoomId.set(data.email, data.roomId);
          console.log(`A user with email ${data.email} join room ${data.roomId}`);
          socket.broadcast.to(data.roomId).emit("user-joined", { email: data.email });

          this.initHandlers(socket);
     }




     public static initHandlers(socket: Socket) {

          socket.on("call-user", (data) => {
               const { email, SDP } = data;
               const roomId = emailToRoomId.get(email);
             console.log('call from user' , email);
               socket.broadcast.to(roomId).emit("incomming-call", { from: email, SDP });
          });
     }


}
