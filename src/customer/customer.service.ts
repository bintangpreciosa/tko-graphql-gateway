// src/customer/customer.service.ts
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import axios from 'axios';
import { CustomerDTO, CreateCustomerInput, UpdateCustomerInput } from './dto/customer.dto';

@Injectable()
export class CustomerService {
  // *** PENTING: GANTI DENGAN ENDPOINT GRAPHQL ASLI DARI CUSTOMER SERVICE CRM MEREKA ***
  // Jika mereka berjalan di Docker Compose di jaringan yang sama, ini mungkin:
  // 'http://customer-service:4000/graphql' (sesuai nama service dan port internal mereka)
  private readonly CRM_GRAPHQL_ENDPOINT = 'http://localhost:3001/graphql'; 

  // Tambahkan headers jika Customer Service CRM memerlukan otentikasi (misalnya, token API Key)
  private readonly AUTH_HEADERS = {
    // 'Authorization': 'Bearer YOUR_CRM_API_KEY_OR_TOKEN', // Uncomment dan ganti jika perlu
    'Content-Type': 'application/json',
  };

  // Method untuk mengambil customer berdasarkan ID
  async getCustomerById(id: string): Promise<CustomerDTO> {
    const query = `
      query GetCustomer($id: ID!) {
        customer(id: $id) {
          id
          name
          email
          phone
          address
          city
          postal_code
          country
          created_at
          updated_at
          # Uncomment jika Anda ingin data logins juga
          # logins(limit: 5) {
          #   id
          #   login_time
          # }
        }
      }
    `;
    try {
      const response = await axios.post(
        this.CRM_GRAPHQL_ENDPOINT,
        {
          query,
          variables: { id },
        },
        { headers: this.AUTH_HEADERS },
      );

      if (response.data.errors) {
        console.error('CRM GraphQL Errors:', response.data.errors);
        throw new InternalServerErrorException('CRM API returned errors.');
      }

      return response.data.data.customer;
    } catch (error) {
      console.error('Error fetching customer by ID from CRM:', error.response?.data || error.message);
      throw new InternalServerErrorException('Failed to fetch customer data from CRM.');
    }
  }

  // Method untuk membuat customer baru
  async createCustomer(input: CreateCustomerInput): Promise<CustomerDTO> {
    const mutation = `
      mutation CreateCustomer($input: CreateCustomerInput!) {
        createCustomer(input: $input) {
          id
          name
          email
          phone
          address
          city
          postal_code
          country
          created_at
          updated_at
        }
      }
    `;
    try {
      const response = await axios.post(
        this.CRM_GRAPHQL_ENDPOINT,
        {
          query: mutation,
          variables: { input },
        },
        { headers: this.AUTH_HEADERS },
      );

      if (response.data.errors) {
        console.error('CRM GraphQL Errors:', response.data.errors);
        throw new InternalServerErrorException('CRM API returned errors.');
      }

      return response.data.data.createCustomer;
    } catch (error) {
      console.error('Error creating customer in CRM:', error.response?.data || error.message);
      throw new InternalServerErrorException('Failed to create customer in CRM.');
    }
  }

  // Anda bisa tambahkan method lain di sini sesuai kebutuhan (getCustomerByEmail, updateCustomer, deleteCustomer, dll.)
  // berdasarkan skema GraphQL CRM yang sudah Anda dapatkan
}