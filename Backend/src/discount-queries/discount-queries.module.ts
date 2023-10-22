import { Module } from '@nestjs/common';
import { DiscountQueriesService } from './discount-queries.service';
import { DiscountQueriesController } from './discount-queries.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  DiscountQueriesSchema,
  DiscountQuery,
} from './schema/discount-query.schema';
import { roboProductSchema, roboproducts } from 'src/robo-products/schema/robo-products.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DiscountQuery.name, schema: DiscountQueriesSchema },{name:roboproducts.name,schema:roboProductSchema}
    ]),
  ],
  controllers: [DiscountQueriesController],
  providers: [DiscountQueriesService],
})
export class DiscountQueriesModule {}
