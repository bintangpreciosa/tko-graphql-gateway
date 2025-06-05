// src/app.module.ts
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';

// Import scalars dan modules lainnya
import { DateTimeScalar } from './common/scalars/datetime.scalar';
import { CustomerModule } from './customer/customer.module';
import { ProductModule } from './product/product.module';
import { OrderModule } from './order/order.module';
import { PaymentModule } from './payment/payment.module'; // Import PaymentModule

// Import semua DTOs yang merupakan GraphQL Type (masih relevan untuk schema generation)
import {
  CustomerDTO,
  CustomerLogin,
  CreateCustomerInput,
  UpdateCustomerInput,
} from './customer/dto/customer.dto';

@Module({
  imports: [
    // Konfigurasi GraphQL Module
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: true,
      buildSchemaOptions: {
        orphanedTypes: [
          CustomerDTO,
          CustomerLogin,
          CreateCustomerInput,
          UpdateCustomerInput,
        ],
      },
    }),
    // KONFIGURASI TYPEORM UNTUK DATABASE PRODUCT SERVICE
    TypeOrmModule.forRoot({
      name: 'productConnection', // Beri nama koneksi ini
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'product_service',
      entities: [join(__dirname, '**', '*.entity.{ts,js}')], // Memuat semua entitas
      synchronize: false, // Ingat untuk ubah ke false setelah tabel dibuat
      logging: false,
    }),
    // KONFIGURASI TYPEORM UNTUK DATABASE ORDER SERVICE
    TypeOrmModule.forRoot({
      name: 'orderConnection', // Beri nama koneksi ini
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'order_service',
      entities: [join(__dirname, '**', '*.entity.{ts,js}')], // Memuat semua entitas
      synchronize: false, // Ingat untuk ubah ke false setelah tabel dibuat
      logging: false,
    }),
    // KONFIGURASI TYPEORM BARU UNTUK DATABASE PAYMENT SERVICE
    TypeOrmModule.forRoot({
      name: 'paymentConnection', // Beri nama koneksi ini
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'payment_service', // Nama database untuk Payment Service
      entities: [join(__dirname, '**', '*.entity.{ts,js}')], // Memuat semua entitas
      synchronize: false, // Untuk pertama kali, bisa set true agar tabel dibuat otomatis
      logging: false,
    }),
    // Modul-modul aplikasi Anda
    CustomerModule,
    ProductModule,
    OrderModule,
    PaymentModule, // Daftarkan PaymentModule di sini
  ],
  controllers: [],
  providers: [DateTimeScalar],
})
export class AppModule {}