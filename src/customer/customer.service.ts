// src/customer/customer.service.ts
import { Injectable, InternalServerErrorException } from '@nestjs/common';
// Tidak perlu axios lagi untuk mock data sementara
// import axios from 'axios';
import { CustomerDTO, CreateCustomerInput, UpdateCustomerInput } from './dto/customer.dto';

@Injectable()
export class CustomerService {
  // Tidak perlu lagi endpoint CRM untuk mock data sementara
  // private readonly CRM_GRAPHQL_ENDPOINT = 'http://localhost:3000/graphql';
  // private readonly AUTH_HEADERS = { 'Content-Type': 'application/json' };

  // Data customer mock sementara
  private mockCustomers: CustomerDTO[] = [
    {
      id: '1',
      name: 'Budi Mock',
      email: 'budi.mock@example.com',
      phone: '08111111111',
      address: 'Jl. Mock Raya No. 1',
      city: 'Mock City',
      postal_code: '10000',
      country: 'Indonesia',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      logins: []
    },
    {
      id: '2',
      name: 'Siti Mock',
      email: 'siti.mock@example.com',
      phone: '08222222222',
      address: 'Jl. Tes Mock No. 2',
      city: 'Mock City',
      postal_code: '20000',
      country: 'Indonesia',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      logins: []
    },
  ];
  private nextMockId = 3; // Untuk generate ID baru jika membuat customer mock

  async getCustomerById(id: string): Promise<CustomerDTO | null> {
    const customer = this.mockCustomers.find(c => c.id === id);
    if (customer) {
      console.log(`[MOCK] Fetched customer with ID: ${id}`);
      return customer;
    }
    console.log(`[MOCK] Customer with ID: ${id} not found.`);
    // Sekarang, mengembalikan null diizinkan oleh tipe kembalian
    return null;
  }

  async createCustomer(input: CreateCustomerInput): Promise<CustomerDTO> {
    // Generate ID baru untuk mock customer
    const newId = String(this.nextMockId++);
    const newCustomer: CustomerDTO = {
      id: newId,
      name: input.name,
      email: input.email,
      phone: input.phone || undefined,
      address: input.address || undefined,
      city: input.city || undefined,
      postal_code: input.postal_code || undefined,
      country: input.country || undefined,
      created_at: new Date().toISOString(),
      updated_at: undefined, // updated_at juga bisa jadi undefined jika tidak ada update
      logins: []
    };
    this.mockCustomers.push(newCustomer);
    console.log(`[MOCK] Created new customer with ID: ${newId}`);
    return newCustomer;
  }

  // Anda bisa tambahkan mock method untuk getCustomerByEmail, updateCustomer, dll. jika diperlukan
}