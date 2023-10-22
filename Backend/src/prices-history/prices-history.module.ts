import { Module } from '@nestjs/common';
import { PricesHistoryService } from './prices-history.service';
import { PricesHistoryController } from './prices-history.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PricesHistory, PricesHistorySchema } from './schema/prices-history.schema';

@Module({
  imports:[MongooseModule.forFeature([{name:PricesHistory.name,schema:PricesHistorySchema}])],
  controllers: [PricesHistoryController],
  providers: [PricesHistoryService]
})
export class PricesHistoryModule {}
