// src/payment/payment.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entity/payment.entity'; // Import Payment entity
import { CreatePaymentInput, UpdatePaymentInput, PaymentDTO } from './dto/payment.dto'; // Import DTOs
import { OrderService } from '../order/order.service'; // Import OrderService

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment, 'paymentConnection') // Inject Repository untuk Payment
    private paymentRepository: Repository<Payment>,
    private orderService: OrderService, // Inject OrderService
  ) {}

  // Helper untuk mengubah Payment Entity menjadi PaymentDTO
  private mapPaymentToDTO(payment: Payment | null): PaymentDTO | null {
    if (!payment) return null;

    const paymentDTO = new PaymentDTO();
    paymentDTO.payment_id = payment.payment_id;
    paymentDTO.order_id = payment.order_id;
    paymentDTO.amount = payment.amount;
    paymentDTO.payment_method = payment.payment_method;
    paymentDTO.payment_status = payment.payment_status;
    paymentDTO.payment_date = payment.payment_date ? payment.payment_date.toISOString() : '';

    // Jika relasi order dimuat, map juga order DTO-nya
    // if (payment.order) {
    //     // Anda perlu method mapOrderToDTO dari OrderService atau buat helper di sini
    //     // Untuk kesederhanaan, kita hanya akan memasukkan ID order di PaymentDTO
    //     // Jika Anda ingin OrderDTO lengkap, PaymentService perlu mengakses OrderService.mapOrderToDTO
    //     // Atau Anda bisa langsung memetakan field Order yang relevan saja.
    //     // Untuk saat ini, kita akan asumsikan hanya order_id yang penting di PaymentDTO
    //     paymentDTO.order = {
    //         order_id: payment.order.order_id,
    //         customer_crm_id: payment.order.customer_crm_id,
    //         total_price: payment.order.total_price,
    //         payment_status: payment.order.payment_status,
    //         shipping_status: payment.order.shipping_status,
    //         order_date: payment.order.order_date.toISOString(),
    //         // Field OrderDTO lainnya jika perlu di-expose di PaymentDTO
    //         order_items: payment.order.order_items ? payment.order.order_items.map(item => ({
    //           order_item_id: item.order_item_id,
    //           order_id: item.order_id,
    //           product_id: item.product_id,
    //           product_name: item.product_name,
    //           quantity: item.quantity,
    //           price: item.price,
    //         })) : [],
    //         shipping_address_street: payment.order.shipping_address_street,
    //         shipping_address_city: payment.order.shipping_address_city,
    //         shipping_address_postal_code: payment.order.shipping_address_postal_code,
    //         shipping_address_country: payment.order.shipping_address_country,
    //         created_at: payment.order.created_at.toISOString(),
    //         updated_at: payment.order.updated_at ? payment.order.updated_at.toISOString() : undefined,
    //     };
    // }

    return paymentDTO;
  }

  // Method untuk mendapatkan semua pembayaran
  async findAll(): Promise<PaymentDTO[]> {
    const payments = await this.paymentRepository.find({ }); // Load relasi order juga
    return payments.map(payment => this.mapPaymentToDTO(payment)).filter((p): p is PaymentDTO => p !== null);
  }

  // Method untuk mendapatkan pembayaran berdasarkan ID
  async findOneById(payment_id: number): Promise<PaymentDTO | null> {
    const payment = await this.paymentRepository.findOne({ where: { payment_id } });
    return this.mapPaymentToDTO(payment);
  }

  // Method untuk membuat pembayaran baru
  async create(input: CreatePaymentInput): Promise<PaymentDTO> {
    // Validasi Order (ini akan memanggil OrderService)
    const order = await this.orderService.findOneById(input.order_id);
    if (!order) {
      throw new BadRequestException(`Order with ID ${input.order_id} not found.`);
    }
    if (input.amount > order.total_price) {
      throw new BadRequestException(`Payment amount ${input.amount} exceeds order total ${order.total_price}.`);
    }
    if (order.payment_status === 'PAID') {
      throw new BadRequestException(`Order with ID ${input.order_id} has already been paid.`);
    }

    const newPayment = this.paymentRepository.create({
      order_id: input.order_id,
      amount: input.amount,
      payment_method: input.payment_method,
      payment_status: 'PENDING',
    }); 

    const savedPayment = await this.paymentRepository.save(newPayment);

    // Update status pembayaran di OrderService
    await this.orderService.updateStatus(input.order_id, 'PAID', order.shipping_status); // Set order status menjadi PAID

    return this.mapPaymentToDTO(savedPayment)!;
  }

  // Method untuk memperbarui status pembayaran
  async updateStatus(payment_id: number, payment_status: string): Promise<PaymentDTO> {
      const payment = await this.paymentRepository.findOne({ where: { payment_id } }); // HAPUS relations: ['order']
      if (!payment) {
          throw new NotFoundException(`Payment with ID ${payment_id} not found.`);
      }
      payment.payment_status = payment_status;
      const updatedPayment = await this.paymentRepository.save(payment);

      // Jika perlu update OrderService, ambil OrderDTO dulu
      if (payment_status === 'SUCCESS') { // Asumsikan kita hanya perlu order_id dan shipping_status
          const order = await this.orderService.findOneById(payment.order_id);
          if (order) { // Pastikan order ditemukan
              await this.orderService.updateStatus(order.order_id, 'PAID', order.shipping_status);
          }
      }
      return this.mapPaymentToDTO(updatedPayment)!;
  }

  // Method untuk menghapus pembayaran
  async delete(payment_id: number): Promise<boolean> {
    const result = await this.paymentRepository.delete(payment_id);
    return (result.affected ?? 0) > 0;
  }
}