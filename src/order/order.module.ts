// src/order/order.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // Import TypeOrmModule

import { OrderService } from './order.service';
import { OrderResolver } from './order.resolver';
import { Order } from './entity/order.entity'; // Import Order Entity
import { OrderItem } from './entity/order-item.entity'; // Import OrderItem Entity

import { ProductModule } from '../product/product.module'; // Import ProductModule
import { CustomerModule } from '../customer/customer.module'; // Import CustomerModule

@Module({
  imports: [
    // Mendaftarkan entitas Order dan OrderItem untuk koneksi database default (orderConnection)
    TypeOrmModule.forFeature([Order, OrderItem], 'orderConnection'), // Gunakan nama koneksi 'orderConnection'
    // Mengimpor ProductModule dan CustomerModule agar OrderService bisa menggunakan service dari modul tersebut
    ProductModule,
    CustomerModule,
  ],
  providers: [OrderService, OrderResolver],
  exports: [OrderService] // Ekspor OrderService agar bisa digunakan modul lain (misalnya PaymentService, ShipmentService)
})
export class OrderModule {}