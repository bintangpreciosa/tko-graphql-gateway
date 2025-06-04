// src/customer/dto/customer.dto.ts
import { Field, ID, ObjectType, InputType, Int } from '@nestjs/graphql';

// Catatan: Import DateTimeScalar tidak lagi diperlukan di sini karena kita menggunakan string untuk workaround.
// Namun, scalar ini tetap didefinisikan dan digunakan di app.module.ts.

@ObjectType()
export class CustomerLogin {
  @Field(() => ID)
  id: string;

  @Field(() => Int)
  customer_id: number; // Sesuai dengan tipe Int dari CRM

  // Menggunakan String sebagai workaround untuk masalah schema generation dengan DateTimeScalar
  @Field(() => String)
  login_time: string;
}

@ObjectType()
export class CustomerDTO {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field({ nullable: true }) // nullable: true karena 'phone' bisa null di skema CRM
  phone?: string;

  @Field({ nullable: true })
  address?: string;

  @Field({ nullable: true })
  city?: string;

  @Field({ nullable: true })
  postal_code?: string;

  @Field({ nullable: true })
  country?: string;

  // Menggunakan String sebagai workaround untuk masalah schema generation dengan DateTimeScalar
  @Field(() => String)
  created_at: string;

  // Menggunakan String sebagai workaround untuk masalah schema generation dengan DateTimeScalar
  @Field(() => String, { nullable: true })
  updated_at?: string;

  // Hubungan dengan CustomerLogin, jika Anda ingin mengeksposnya juga
  @Field(() => [CustomerLogin], { nullable: true })
  logins?: CustomerLogin[];
}

@InputType()
export class CreateCustomerInput {
  @Field()
  name: string;

  @Field()
  email: string;

  @Field({ nullable: true })
  phone?: string;

  @Field({ nullable: true })
  address?: string;

  @Field({ nullable: true })
  city?: string;

  @Field({ nullable: true })
  postal_code?: string;

  @Field({ nullable: true })
  country?: string;
}

@InputType()
export class UpdateCustomerInput {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  phone?: string;

  @Field({ nullable: true })
  address?: string;

  @Field({ nullable: true })
  city?: string;

  @Field({ nullable: true })
  postal_code?: string;

  @Field({ nullable: true })
  country?: string;
}