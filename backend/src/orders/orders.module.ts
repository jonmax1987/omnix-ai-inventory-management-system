import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { WebSocketModule } from '../websocket/websocket.module';
import { CustomersModule } from '../customers/customers.module';

@Module({
  imports: [WebSocketModule, CustomersModule],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}