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
import { PaymentModule } from './payment/payment.module';
import { ShipmentModule } from './shipment/shipment.module';
import { CartModule } from './cart/cart.module';

// Import DTO
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
      name: 'productConnection',
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'product_service',
      entities: [join(__dirname, '**', '*.entity.{ts,js}')],
      synchronize: false,
      logging: false,
    }),
    // KONFIGURASI TYPEORM UNTUK DATABASE ORDER SERVICE
    TypeOrmModule.forRoot({
      name: 'orderConnection',
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'order_service',
      entities: [join(__dirname, '**', '*.entity.{ts,js}')],
      synchronize: false,
      logging: false,
    }),
    // KONFIGURASI TYPEORM UNTUK DATABASE PAYMENT SERVICE
    TypeOrmModule.forRoot({
      name: 'paymentConnection',
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'payment_service',
      entities: [join(__dirname, '**', '*.entity.{ts,js}')],
      synchronize: false,
      logging: false,
    }),
    // KONFIGURASI TYPEORM UNTUK DATABASE SHIPMENT SERVICE
    TypeOrmModule.forRoot({
      name: 'shipmentConnection',
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'shipment_service',
      entities: [join(__dirname, '**', '*.entity.{ts,js}')],
      synchronize: false, 
      logging: false,
    }),
    // *** KONFIGURASI TYPEORM BARU UNTUK DATABASE CART SERVICE ***
    TypeOrmModule.forRoot({
      name: 'cartConnection', 
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '', 
      database: 'cart_service', 
      entities: [join(__dirname, '**', '*.entity.{ts,js}')], 
      synchronize: false, // Untuk pertama kali, bisa set true agar tabel dibuat otomatis
      logging: false,
    }),
    // Modul-modul aplikasi
    CustomerModule,
    ProductModule,
    OrderModule,
    PaymentModule,
    ShipmentModule,
    CartModule,
  ],
  controllers: [],
  providers: [DateTimeScalar],
})
export class AppModule {}