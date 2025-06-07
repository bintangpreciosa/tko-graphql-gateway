    // src/customer/customer.resolver.ts
    import { Resolver, Query, Mutation, Args, ID, ObjectType, Field, Int, ResolveField, Parent } from '@nestjs/graphql';
    import { CustomerService } from './customer.service';
    import { CustomerDTO, CreateCustomerInput, UpdateCustomerInput, CustomerFilters } from './dto/customer.dto';
    import { OrderService } from '../order/order.service'; // Import OrderService
    import { OrderDTO } from '../order/dto/order.dto'; // Import OrderDTO

    @ObjectType()
    export class CustomerConnection {
      @Field(() => [CustomerDTO])
      customers: CustomerDTO[];

      @Field(() => Int)
      totalCount: number;

      @Field()
      hasNextPage: boolean;

      @Field()
      hasPreviousPage: boolean;
    }

    @Resolver(() => CustomerDTO)
    export class CustomerResolver {
      constructor(
        private readonly customerService: CustomerService,
        private readonly orderService: OrderService,
      ) {}

      @Query(() => CustomerDTO, { nullable: true, description: 'Mengambil detail customer berdasarkan ID dari CRM Service.' })
      async customer(@Args('id', { type: () => ID }) id: string): Promise<CustomerDTO | null> {
        return this.customerService.getCustomerById(id);
      }

      @Query(() => CustomerConnection, { description: 'Mengambil daftar semua customer dari CRM Service, dengan filter opsional.' })
      async customers(@Args('filters', { type: () => CustomerFilters, nullable: true }) filters?: CustomerFilters): Promise<CustomerConnection> {
        const result = await this.customerService.findAllCustomers(filters);
        return {
            customers: result.customers,
            totalCount: result.totalCount,
            hasNextPage: result.hasNextPage,
            hasPreviousPage: result.hasPreviousPage,
        };
      }

      @Mutation(() => CustomerDTO, { description: 'Membuat customer baru di CRM Service.' })
      async createCustomer(@Args('input') input: CreateCustomerInput): Promise<CustomerDTO> {
        return this.customerService.createCustomer(input);
      }

      @Mutation(() => Boolean, { description: 'Menghapus customer dari CRM Service.' })
      async deleteCustomer(@Args('id', { type: () => ID }) id: string): Promise<boolean> {
        return this.customerService.deleteCustomer(id);
      }

      @ResolveField('orders', () => [OrderDTO], { nullable: true, description: 'Daftar pesanan yang dibuat oleh customer ini.' })
      async getOrdersByCustomer(@Parent() customer: CustomerDTO): Promise<OrderDTO[]> {
        return this.orderService.findAll({ customer_crm_id: customer.id });
      }
    }
    