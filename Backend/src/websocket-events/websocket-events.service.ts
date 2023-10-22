import { Injectable } from '@nestjs/common';
import { WebsocketEventsGateway } from './websocket-events.gateway';

@Injectable()
export class WebsocketEventsService {
  constructor(private readonly websocketEvents: WebsocketEventsGateway) {}

  emitToAll(eventName: string, data: any) {
    this.websocketEvents.server.emit(eventName, data);
  }

  currentOnlineUsers() {
    return Object.keys(this.websocketEvents.connectedUsers);
  }
}
