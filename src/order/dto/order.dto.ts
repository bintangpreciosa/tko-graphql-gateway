// src/order/dto/order.dto.ts
import { Field, ID, ObjectType, InputType, Float, Int } from '@nestjs/graphql';

@ObjectType()
export class OrderItemDTO {
  @Field(() => ID)
  order_item_id: number;

  @Field(() => Int)
  order_id: number;

  @Field(() => Int)
  product_id: number;

  @Field()
  product_name: string;

  @Field(() => Int)
  quantity: number;

  @Field(() => Float)
  price: number; // Harga per unit saat pesanan dibuat
}

@ObjectType()
export class OrderDTO {
  @Field(() => ID)
  order_id: number;

  // customer_crm_id akan diambil dari CRM Service
  @Field(() => String) // Menggunakan String karena ID dari CRM
  customer_crm_id: string;

  // Gunakan String untuk tanggal agar konsisten dengan workaround sebelumnya
  @Field(() => String)
  order_date: string;

  @Field(() => Float)
  total_price: number;

  @Field({ nullable: true })
  payment_status?: string;

  @Field({ nullable: true })
  shipping_status?: string;

  // --- PERUBAHAN DI SINI: MENAMBAHKAN '| null' KE TIPE ALAMAT ---
  @Field(() => String, { nullable: true }) // <-- UBAH INI
  shipping_address_street?: string | null;

  @Field(() => String, { nullable: true }) // <-- UBAH INI
  shipping_address_city?: string | null;

  @Field(() => String, { nullable: true }) // <-- UBAH INI
  shipping_address_postal_code?: string | null; // <-- UBAH INI

  @Field(() => String, { nullable: true }) // <-- UBAH INI
  shipping_address_country?: string | null; // Sekarang bisa string, null, atau undefined

  @Field(() => String)
  created_at: string;

  @Field(() => String, { nullable: true })
  updated_at?: string;

  // Relasi dengan OrderItemDTO
  @Field(() => [OrderItemDTO]) // Array dari OrderItemDTO
  order_items: OrderItemDTO[];
}

@InputType()
export class CreateOrderItemInput {
  @Field(() => Int)
  product_id: number;

  @Field()
  product_name: string; // Snapshot nama produk dari ProductService

  @Field(() => Int)
  quantity: number;

  @Field(() => Float)
  price: number; // Snapshot harga dari ProductService
}

@InputType()
export class CreateOrderInput {
  @Field(() => String) // ID Customer dari CRM
  customer_crm_id: string;

  // Snapshot alamat pengiriman dari customer_crm_id
  @Field({ nullable: true })
  shipping_address_street?: string;

  @Field({ nullable: true })
  shipping_address_city?: string;

  @Field({ nullable: true })
  shipping_address_postal_code?: string;

  @Field({ nullable: true })
  shipping_address_country?: string;

  @Field(() => [CreateOrderItemInput]) // Array dari item pesanan
  items: CreateOrderItemInput[];
}

@InputType()
export class UpdateOrderInput {
  @Field({ nullable: true })
  payment_status?: string;

  @Field({ nullable: true })
  shipping_status?: string;

  @Field({ nullable: true })
  shipping_address_street?: string;

  @Field({ nullable: true })
  shipping_address_city?: string;

  @Field({ nullable: true })
  shipping_address_postal_code?: string;

  @Field({ nullable: true })
  shipping_address_country?: string;
}

@InputType()
export class OrderFilters {
  @Field(() => String, { nullable: true })
  customer_crm_id?: string;

  @Field(() => String, { nullable: true })
  payment_status?: string;

  @Field(() => String, { nullable: true })
  shipping_status?: string;
}