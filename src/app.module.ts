// src/app.module.ts
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { DateTimeScalar } from './common/scalars/datetime.scalar';
import { CustomerModule } from './customer/customer.module';
import {
  CustomerDTO,
  CustomerLogin,
  CreateCustomerInput,
  UpdateCustomerInput,
} from './customer/dto/customer.dto';

@Module({
  imports: [
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
        // *** HAPUS BARIS INI: scalars: { Date: DateTimeScalar }, ***
      },
    }),
    CustomerModule,
  ],
  controllers: [],
  providers: [DateTimeScalar],
})
export class AppModule {}