import { Module } from '@nestjs/common';
import { WebsocketEventsService } from './websocket-events.service';
import { WebsocketEventsGateway } from './websocket-events.gateway';

@Module({
  providers: [WebsocketEventsGateway, WebsocketEventsService],
  exports: [WebsocketEventsService],
})
export class WebsocketEventsModule {}
