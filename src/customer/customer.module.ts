    // src/customer/customer.module.ts
    import { forwardRef, Module } from '@nestjs/common'; // *** TAMBAHKAN forwardRef ***
    import { CustomerService } from './customer.service';
    import { CustomerResolver } from './customer.resolver';
    import { OrderModule } from '../order/order.module';

    @Module({
      imports: [
        forwardRef(() => OrderModule), // *** BUNGKUS OrderModule dengan forwardRef ***
      ],
      providers: [CustomerService, CustomerResolver],
      exports: [CustomerService],
    })
    export class CustomerModule {}
    