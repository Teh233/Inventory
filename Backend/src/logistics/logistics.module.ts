import { Module } from '@nestjs/common';
import { LogisticsService } from './logistics.service';
import { LogisticsController } from './logistics.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Logistic, LogisticSchema } from './schema/logistic.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Logistic.name, schema: LogisticSchema },
    ]),
  ],
  controllers: [LogisticsController],
  providers: [LogisticsService],
})
export class LogisticsModule {}
