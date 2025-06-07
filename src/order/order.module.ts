// src/order/order.module.ts
import { forwardRef, Module } from '@nestjs/common'; // *** TAMBAHKAN forwardRef ***
import { TypeOrmModule } from '@nestjs/typeorm';

import { OrderService } from './order.service';
import { OrderResolver } from './order.resolver';
import { Order } from './entity/order.entity';
import { OrderItem } from './entity/order-item.entity';

import { ProductModule } from '../product/product.module';
import { CustomerModule } from '../customer/customer.module'; // Import CustomerModule

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, OrderItem], 'orderConnection'),
    ProductModule,
    forwardRef(() => CustomerModule), // *** BUNGKUS CustomerModule dengan forwardRef ***
  ],
  providers: [OrderService, OrderResolver],
  exports: [OrderService]
})
export class OrderModule {}
