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
import { OrderModule } from './order/order.module'; // Import OrderModule

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
    // *** KONFIGURASI TYPEORM UNTUK DATABASE PRODUCT SERVICE (SUDAH ADA) ***
    TypeOrmModule.forRoot({
      name: 'productConnection', // Beri nama koneksi ini
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'product_service',
      entities: [join(__dirname, 'product', 'entity', '*.entity.{ts,js}')], // Sesuaikan path entities
      synchronize: false,
      logging: false,
    }),
    // *** KONFIGURASI TYPEORM BARU UNTUK DATABASE ORDER SERVICE ***
    TypeOrmModule.forRoot({
      name: 'orderConnection', // Beri nama koneksi ini
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root', // Ganti dengan username database MySQL Anda
      password: '', // Ganti dengan password database MySQL Anda
      database: 'order_service', // Nama database untuk Order Service
      entities: [join(__dirname, 'order', 'entity', '*.entity.{ts,js}')], // Path ke entity Order Anda
      synchronize: false, // Set ke false setelah tabel dibuat, atau biarkan true untuk dev awal
      logging: false,
    }),
    // Modul-modul aplikasi Anda
    CustomerModule,
    ProductModule,
    OrderModule, // Daftarkan OrderModule di sini
  ],
  controllers: [],
  providers: [DateTimeScalar],
})
export class AppModule {}