// src/order/order.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm'; // Tidak perlu Like untuk OrderService ini
import { Order } from './entity/order.entity';
import { OrderItem } from './entity/order-item.entity';

// Service lain yang di-inject (untuk inter-service communication)
import { ProductService } from '../product/product.service';
import { CustomerService } from '../customer/customer.service'; // Ini menggunakan mock data

// DTOs untuk Order Service
import { OrderDTO, OrderItemDTO, CreateOrderInput, UpdateOrderInput, OrderFilters } from './dto/order.dto';
import { ProductDTO } from '../product/dto/product.dto'; // Untuk validasi produk dari ProductService

@Injectable()
export class OrderService {
  constructor(
    // Inject Repository untuk Order dan OrderItem, pastikan menggunakan nama koneksi 'orderConnection'
    @InjectRepository(Order, 'orderConnection')
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem, 'orderConnection')
    private orderItemRepository: Repository<OrderItem>,
    
    // Inject service dari modul lain
    private productService: ProductService,
    private customerService: CustomerService,
  ) {}

  // Helper untuk mengubah Order Entity menjadi OrderDTO
  // Mengembalikan OrderDTO atau null jika entity input null
  private mapOrderToDTO(order: Order): OrderDTO | null {
    if (!order) return null;

    const orderDTO = new OrderDTO();
    orderDTO.order_id = order.order_id;
    orderDTO.customer_crm_id = order.customer_crm_id;
    orderDTO.order_date = order.order_date ? order.order_date.toISOString() : '';
    orderDTO.total_price = order.total_price;
    orderDTO.payment_status = order.payment_status;
    orderDTO.shipping_status = order.shipping_status;
    
    // Pastikan field alamat sesuai dengan DTO (string atau null)
    orderDTO.shipping_address_street = order.shipping_address_street ?? null;
    orderDTO.shipping_address_city = order.shipping_address_city ?? null;
    orderDTO.shipping_address_postal_code = order.shipping_address_postal_code ?? null;
    orderDTO.shipping_address_country = order.shipping_address_country ?? null;

    orderDTO.created_at = order.created_at ? order.created_at.toISOString() : '';
    orderDTO.updated_at = order.updated_at ? order.updated_at.toISOString() : undefined;

    // Mapping order_items dari entity ke DTO
    if (order.order_items && order.order_items.length > 0) {
        orderDTO.order_items = order.order_items.map(item => ({
            order_item_id: item.order_item_id,
            order_id: item.order_id,
            product_id: item.product_id,
            product_name: item.product_name,
            quantity: item.quantity,
            price: item.price,
        }));
    } else {
        orderDTO.order_items = []; // Pastikan selalu array kosong jika tidak ada item
    }

    return orderDTO;
  }

  // Method untuk mendapatkan semua pesanan dengan filter
  async findAll(filters?: OrderFilters): Promise<OrderDTO[]> {
    const where: any = {}; // Objek untuk kondisi WHERE
    if (filters) {
      if (filters.customer_crm_id) {
        where.customer_crm_id = filters.customer_crm_id;
      }
      if (filters.payment_status) {
        where.payment_status = filters.payment_status;
      }
      if (filters.shipping_status) {
        where.shipping_status = filters.shipping_status;
      }
    }
    
    // Mencari order dan memuat relasi order_items
    const orders = await this.orderRepository.find({
        where,
        relations: ['order_items'],
    });

    // Mapping setiap order entity ke OrderDTO dan filter null
    return orders.map(order => this.mapOrderToDTO(order)).filter((o): o is OrderDTO => o !== null);
  }

  // Method untuk mendapatkan pesanan berdasarkan ID
  async findOneById(order_id: number): Promise<OrderDTO | null> { // Return type bisa null
    // Mencari order dan memuat relasi order_items
    const order = await this.orderRepository.findOne({
        where: { order_id },
        relations: ['order_items'],
    });
    if (!order) {
      // Tidak perlu throw NotFoundException di sini, cukup return null
      return null;
    }
    return this.mapOrderToDTO(order);
  }

  // Method untuk membuat pesanan baru
  async create(input: CreateOrderInput): Promise<OrderDTO> {
    // 1. Validasi Customer dari CustomerService (menggunakan mock data)
    const customer = await this.customerService.getCustomerById(input.customer_crm_id);
    if (!customer) {
      throw new BadRequestException(`Customer with ID ${input.customer_crm_id} not found.`);
    }

    let total_price = 0;
    const orderItems: OrderItem[] = [];

    // 2. Validasi Produk dan Hitung Total Harga dari ProductService
    for (const itemInput of input.items) {
      const product = await this.productService.findOneById(itemInput.product_id);
      if (!product || product.stock < itemInput.quantity) {
        throw new BadRequestException(`Product ${itemInput.product_name} (ID: ${itemInput.product_id}) is out of stock or not found.`);
      }
      // Validasi harga: pastikan harga di input item sama dengan harga produk sebenarnya
      // PERBAIKAN: Konversi kedua harga ke number menggunakan parseFloat() sebelum membandingkan
      const productPriceAsNumber = parseFloat(product.price as any); // Pastikan ini number
      const itemInputPriceAsNumber = parseFloat(itemInput.price as any); // Pastikan ini number

      if (productPriceAsNumber.toFixed(2) !== itemInputPriceAsNumber.toFixed(2)) {
        throw new BadRequestException(
          `Price mismatch for product ${itemInput.product_name}. Expected ${productPriceAsNumber.toFixed(2)}, got ${itemInputPriceAsNumber.toFixed(2)}.`
        );
      }

      // Buat OrderItem entity
      const orderItem = new OrderItem();
      orderItem.product_id = itemInput.product_id;
      orderItem.product_name = itemInput.product_name;
      orderItem.quantity = itemInput.quantity;
      orderItem.price = itemInput.price; // Gunakan harga yang diberikan di input (setelah diverifikasi)
      orderItems.push(orderItem);

      total_price += itemInput.quantity * itemInput.price;

      // Kurangi stok produk (Ini adalah contoh sederhana, perlu transaksi terdistribusi untuk skala besar)
      // Perhatikan: Dalam sistem produksi, ini perlu dilakukan dalam transaksi database yang sama atau menggunakan saga/choreography
      await this.productService.update(product.product_id, { stock: product.stock - itemInput.quantity });
    }

    // 3. Buat Entitas Order
    const newOrder = new Order();
    newOrder.customer_crm_id = input.customer_crm_id;
    newOrder.total_price = total_price;
    newOrder.payment_status = 'PENDING'; // Status awal default
    newOrder.shipping_status = 'PENDING'; // Status awal default
    
    // Menetapkan alamat pengiriman dengan fallback ke data customer atau null
    newOrder.shipping_address_street = input.shipping_address_street ?? customer.address ?? null;
    newOrder.shipping_address_city = input.shipping_address_city ?? customer.city ?? null;
    newOrder.shipping_address_postal_code = input.shipping_address_postal_code ?? customer.postal_code ?? null;
    newOrder.shipping_address_country = input.shipping_address_country ?? customer.country ?? null;
    
    newOrder.order_items = orderItems; // Hubungkan item pesanan

    // 4. Simpan Order dan OrderItem (TypeORM akan menyimpan order_items juga karena cascade: true)
    const savedOrder = await this.orderRepository.save(newOrder);
    
    // Mapping ke DTO dan assertion non-null (karena operasi save harus berhasil)
    return this.mapOrderToDTO(savedOrder)!;
  }

  // Method untuk memperbarui status pesanan
  async updateStatus(order_id: number, payment_status?: string, shipping_status?: string | null): Promise<OrderDTO> {
    // Mencari order berdasarkan ID
    const order = await this.orderRepository.findOne({ where: { order_id } });
    if (!order) {
      throw new NotFoundException(`Order with ID ${order_id} not found.`);
    }

    // Memperbarui status jika diberikan
    if (payment_status) {
      order.payment_status = payment_status;
    }
    if (shipping_status !== undefined) { // Memastikan null juga diterima
      order.shipping_status = shipping_status;
    }

    // Menyimpan perubahan
    const updatedOrder = await this.orderRepository.save(order);
    
    // Mapping ke DTO dan assertion non-null (karena operasi save harus berhasil)
    return this.mapOrderToDTO(updatedOrder)!;
  }

  // Method untuk menghapus pesanan (bersama itemnya karena cascade: true di Order entity)
  async delete(order_id: number): Promise<boolean> {
    const result = await this.orderRepository.delete(order_id);
    // Mengembalikan true jika ada baris yang terpengaruh (terhapus)
    return (result.affected ?? 0) > 0;
  }
}