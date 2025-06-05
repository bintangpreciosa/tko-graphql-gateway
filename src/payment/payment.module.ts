// src/payment/payment.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // Import TypeOrmModule
import { PaymentService } from './payment.service';
import { PaymentResolver } from './payment.resolver';
import { Payment } from './entity/payment.entity'; // Import Payment Entity

import { OrderModule } from '../order/order.module'; // Import OrderModule

@Module({
  imports: [
    // Mendaftarkan entitas Payment untuk koneksi database 'paymentConnection'
    TypeOrmModule.forFeature([Payment], 'paymentConnection'), // Gunakan nama koneksi 'paymentConnection'
    // Mengimpor OrderModule agar PaymentService bisa menggunakan OrderService
    OrderModule,
  ],
  providers: [PaymentService, PaymentResolver],
  exports: [PaymentService] // Ekspor PaymentService jika akan digunakan modul lain
})
export class PaymentModule {}