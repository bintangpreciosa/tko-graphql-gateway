// src/customer/customer.resolver.ts
import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { CustomerService } from './customer.service';
import { CustomerDTO, CreateCustomerInput, UpdateCustomerInput } from './dto/customer.dto';

@Resolver(() => CustomerDTO) // Mengaitkan resolver ini dengan tipe CustomerDTO
export class CustomerResolver {
  constructor(private readonly customerService: CustomerService) {}

  // Definisi Query untuk mendapatkan customer berdasarkan ID
  @Query(() => CustomerDTO, {
    nullable: true, // Query ini bisa mengembalikan null jika customer tidak ditemukan
    description: 'Mengambil detail customer berdasarkan ID dari CRM Service.',
  })
  async customer(@Args('id', { type: () => ID }) id: string): Promise<CustomerDTO | null> {
    return this.customerService.getCustomerById(id);
  }

  // Definisi Mutation untuk membuat customer baru
  @Mutation(() => CustomerDTO, { description: 'Membuat customer baru di CRM Service.' })
  async createCustomer(@Args('input') input: CreateCustomerInput): Promise<CustomerDTO> {
    return this.customerService.createCustomer(input);
  }

  // Anda bisa tambahkan Query atau Mutation lain di sini sesuai kebutuhan Anda
  // Misalnya: customerByEmail, updateCustomer, deleteCustomer, dll.
  // @Query(() => CustomerDTO, { nullable: true, description: 'Mengambil customer berdasarkan email.' })
  // async customerByEmail(@Args('email') email: string): Promise<CustomerDTO> {
  //   return this.customerService.getCustomerByEmail(email);
  // }
}