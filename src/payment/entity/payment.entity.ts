// src/payment/entity/payment.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';

@Entity('Payment') // Nama tabel di database adalah 'Payment' (sesuai spesifikasi Anda)
export class Payment {
  @PrimaryGeneratedColumn()
  payment_id: number;

  @Column()
  order_id: number; // Foreign key ke tabel orders

//   @ManyToOne(() => Order, order => order.payments) // Relasi ke Order
//   @JoinColumn({ name: 'order_id' })
//   order: Order;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amount: number;

  @Column({ length: 50 })
  payment_method: string; // Misalnya: "Credit Card", "Bank Transfer", "PayPal"

  @Column({ length: 20 })
  payment_status: string; // Misalnya: "PENDING", "SUCCESS", "FAILED"

  @CreateDateColumn() // Menggunakan CreateDateColumn untuk payment_date
  payment_date: Date;
}