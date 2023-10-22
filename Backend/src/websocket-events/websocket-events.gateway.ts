import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class WebsocketEventsGateway implements OnGatewayDisconnect {
  constructor() {}

  @WebSocketServer()
  server: Server;

  connectedUsers: { [userId: string]: string } = {}; // Store connected users as { userId: socketId }
  connectedWholeSaleUsers: { [userId: string]: string } = {}; // store connected wholesale users as { sellerId: socketId }
  sendOnlineWholeSaleUsersUpdate() {
    const onlineWholeSaleUsers = this.connectedWholeSaleUsers;
    this.server.emit('onlineWholeSaleUsers', onlineWholeSaleUsers);
  }
  sendOnlineUsersUpdate() {
    const onlineUsers = this.connectedUsers;
    this.server.emit('onlineUsers', onlineUsers);
  }

  onModuleInit() {
    this.server.on('connection', (socket: Socket) => {
      const userId: any = socket.handshake.query.userId;
      const username = socket.handshake.query.userName;
      const userType = socket.handshake.query.type;

      if (userType === 'wholeSaleUser') {
        if (this.connectedWholeSaleUsers[userId]) {
          // User is already connected, update the socket ID
          const previousSocketId = this.connectedWholeSaleUsers[userId];
          console.log(
            `WholeSaleUser reconnected: ${username}, Socket ID: ${socket.id}`,
          );

          // Disconnect the previous socket
          this.server.sockets.sockets[previousSocketId]?.disconnect(true);
        } else {
          console.log(
            `WholeSaleUser connected: ${username}, Socket ID: ${socket.id}`,
          );
        }

        // Store the connected user
        this.connectedWholeSaleUsers[userId] = socket.id;

        // Notify other clients about the new connection
        this.sendOnlineWholeSaleUsersUpdate();
      } else {
        if (this.connectedUsers[userId]) {
          // User is already connected, update the socket ID
          const previousSocketId = this.connectedUsers[userId];
          console.log(`User reconnected: ${username}, Socket ID: ${socket.id}`);

          // Disconnect the previous socket
          this.server.sockets.sockets[previousSocketId]?.disconnect(true);
        } else {
          console.log(`User connected: ${username}, Socket ID: ${socket.id}`);
        }

        // Store the connected user
        this.connectedUsers[userId] = socket.id;

        // Notify other clients about the new connection
        this.sendOnlineUsersUpdate();
      }
    });
  }

  handleDisconnect(socket: Socket) {
    const userId: any = socket.handshake.query.userId;
    const username = socket.handshake.query.userName;

    if (this.connectedUsers[userId] === socket.id) {
      console.log(`User disconnected: ${username}, Socket ID: ${socket.id}`);
      delete this.connectedUsers[userId];

      // Notify other clients about the disconnection
      this.sendOnlineUsersUpdate();
    } else if (this.connectedWholeSaleUsers[userId] === socket.id) {
      console.log(
        `WholeSaleUser disconnected: ${username}, Socket ID: ${socket.id}`,
      );
      delete this.connectedWholeSaleUsers[userId];

      // Notify other clients about the disconnection
      this.sendOnlineWholeSaleUsersUpdate();
    }
  }

  @SubscribeMessage('newMessage')
  onNewMessage(@MessageBody() body: any) {
    this.server.emit('onMessage', {
      msg: 'New Message',
      content: body,
    });
  }

  @SubscribeMessage('liveStatusServer')
  onLiveStatus(@MessageBody() body: any) {
    this.server.emit('liveStatusClient', body);
  }

  @SubscribeMessage('getOnlineWholeSaleUsers')
  returnOnlineWholeSaleUsers(@MessageBody() body: any) {
    this.sendOnlineWholeSaleUsersUpdate();
  }zz
}
