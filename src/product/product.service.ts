// src/product/product.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm'; // Import Like untuk pencarian
import { Product } from './entity/product.entity'; // Import entitas Product
import { CreateProductInput, UpdateProductInput, ProductFilters } from './dto/product.dto'; // Import DTOs

@Injectable()
export class ProductService {
  constructor(
    // Pastikan TypeOrmModule.forFeature sudah dikonfigurasi di ProductModule
    // dan menggunakan nama koneksi 'productConnection'
    @InjectRepository(Product, 'productConnection')
    private productRepository: Repository<Product>,
  ) {}

  // Method untuk mendapatkan semua produk dengan filter
  async findAll(filters?: ProductFilters): Promise<Product[]> {
    const where: any = {};

    if (filters) {
      if (filters.search) {
        where.name = Like(`%${filters.search}%`); // Mencari berdasarkan nama produk
      }
      if (filters.minPrice) {
        where.price = { ...where.price, ...{ gte: filters.minPrice } }; // price >= minPrice
      }
      if (filters.maxPrice) {
        where.price = { ...where.price, ...{ lte: filters.maxPrice } }; // price <= maxPrice
      }
      if (filters.minStock) {
        where.stock = { ...where.stock, ...{ gte: filters.minStock } }; // stock >= minStock
      }
      if (filters.maxStock) {
        where.stock = { ...where.stock, ...{ lte: filters.maxStock } }; // stock <= maxStock
      }
      if (filters.status) {
        where.status = filters.status;
      }
    }

    return this.productRepository.find({ where });
  }

  // Method untuk mendapatkan produk berdasarkan ID
  async findOneById(product_id: number): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { product_id } });
    if (!product) {
      throw new NotFoundException(`Product with ID ${product_id} not found.`);
    }
    return product;
  }

  // Method untuk membuat produk baru
  async create(input: CreateProductInput): Promise<Product> {
    const newProduct = this.productRepository.create(input);
    return this.productRepository.save(newProduct);
  }

  // Method untuk memperbarui produk
  async update(product_id: number, input: UpdateProductInput): Promise<Product> {
    const product = await this.findOneById(product_id); // Pastikan produknya ada

    // Update field-field yang diberikan di input
    Object.assign(product, input);

    return this.productRepository.save(product);
  }

  // Method untuk menghapus produk
  async delete(product_id: number): Promise<boolean> {
    const result = await this.productRepository.delete(product_id);
    return (result.affected ?? 0) > 0; // Mengembalikan true jika ada baris yang terpengaruh (terhapus)
  }
}