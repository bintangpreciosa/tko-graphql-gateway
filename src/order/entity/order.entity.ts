// src/order/entity/order.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm';
import { OrderItem } from './order-item.entity';

@Entity('Order')
export class Order {
  @PrimaryGeneratedColumn('increment')
  order_id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  customer_crm_id: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  order_date: Date;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: false })
  total_price: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  payment_status: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  shipping_status: string;

  // --- PERUBAHAN DI SINI: TAMBAHKAN '| null' KE TIPE DATA ---
  @Column({ type: 'varchar', length: 255, nullable: true })
  shipping_address_street: string | null; // <-- UBAH INI

  @Column({ type: 'varchar', length: 255, nullable: true })
  shipping_address_city: string | null; // <-- UBAH INI

  @Column({ type: 'varchar', length: 20, nullable: true })
  shipping_address_postal_code: string | null; // <-- UBAH INI

  @Column({ type: 'varchar', length: 100, nullable: true })
  shipping_address_country: string | null; // <-- UBAH INI

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: null, onUpdate: 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @OneToMany(() => OrderItem, orderItem => orderItem.order, { cascade: true })
  order_items: OrderItem[];
}