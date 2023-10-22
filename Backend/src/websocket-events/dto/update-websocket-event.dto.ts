import { PartialType } from '@nestjs/mapped-types';
import { CreateWebsocketEventDto } from './create-websocket-event.dto';

export class UpdateWebsocketEventDto extends PartialType(CreateWebsocketEventDto) {
  id: number;
}
