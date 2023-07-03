import {
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";

@WebSocketGateway({ cors: true }) // Adjust the port and CORS configuration as needed
export class SocketGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket): void {
    console.log(`[User connected] ${client.id}`);
  }

  @SubscribeMessage("join_room")
  handleJoinRoom(client: Socket, data: { room: string }): void {
    console.log(`[User ${client.id}] join ${data.room}`);
    client.join(data.room);
  }

  @SubscribeMessage("leave_room")
  handleLeaveRoom(client: Socket, data: { room: string }): void {
    console.log(`[User ${client.id}] leave ${data.room}`);
    client.leave(data.room);
  }

  @SubscribeMessage("send_message")
  handleSendMessage(
    client: Socket,
    data: { email: string; title: string },
  ): void {
    console.log(data);
    this.server
      .to("Login")
      .emit("receive_message", { email: data.email, title: data.title });
  }

  handleDisconnect(client: Socket): void {
    console.log(`[User disconnected] ${client.id}`);
  }
}
