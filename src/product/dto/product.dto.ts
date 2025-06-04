// src/product/dto/product.dto.ts
import { Field, ID, ObjectType, InputType, Float, Int } from '@nestjs/graphql';

@ObjectType() // Menunjukkan bahwa ini adalah tipe objek yang bisa dikembalikan oleh GraphQL Query
export class ProductDTO {
  @Field(() => ID) // product_id adalah ID unik
  product_id: number;

  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => Float) // Harga adalah tipe Float di GraphQL
  price: number;

  @Field(() => Int) // Stok adalah tipe Integer di GraphQL
  stock: number;

  @Field({ nullable: true })
  image_url?: string;

  @Field()
  status: string; // 'active', 'inactive', 'draft'

  // Menggunakan String untuk created_at/updated_at agar konsisten dengan CustomerDTO workaround
  @Field(() => String)
  created_at: string;

  @Field(() => String, { nullable: true })
  updated_at?: string;
}

@InputType() // Menunjukkan bahwa ini adalah tipe input untuk mutasi (misalnya, membuat produk baru)
export class CreateProductInput {
  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => Float)
  price: number;

  @Field(() => Int)
  stock: number;

  @Field({ nullable: true })
  image_url?: string;

  @Field({ nullable: true }) // Status bisa di-set saat pembuatan
  status?: string;
}

@InputType() // Menunjukkan bahwa ini adalah tipe input untuk mutasi (misalnya, memperbarui produk)
export class UpdateProductInput {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => Float, { nullable: true })
  price?: number;

  @Field(() => Int, { nullable: true })
  stock?: number;

  @Field({ nullable: true })
  image_url?: string;

  @Field({ nullable: true })
  status?: string;
}

@InputType() // Input untuk filtering (opsional, tapi bagus untuk mencari produk)
export class ProductFilters {
  @Field({ nullable: true })
  search?: string; // Mencari berdasarkan nama atau deskripsi

  @Field(() => Float, { nullable: true })
  minPrice?: number;

  @Field(() => Float, { nullable: true })
  maxPrice?: number;

  @Field(() => Int, { nullable: true })
  minStock?: number;

  @Field(() => Int, { nullable: true })
  maxStock?: number;

  @Field({ nullable: true })
  status?: string;
}