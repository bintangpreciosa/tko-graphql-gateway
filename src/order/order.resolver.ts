// src/order/order.resolver.ts
import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { OrderService } from './order.service'; 
import { OrderDTO, CreateOrderInput, UpdateOrderInput, OrderFilters } from './dto/order.dto'; 

@Resolver(() => OrderDTO) // Mengaitkan resolver ini dengan tipe OrderDTO GraphQL
export class OrderResolver {
  constructor(private readonly orderService: OrderService) {} // Inject OrderService

  // Query untuk mengambil satu pesanan berdasarkan ID
  @Query(() => OrderDTO, { nullable: true, description: 'Mengambil detail pesanan berdasarkan ID.' })
  async order(@Args('order_id', { type: () => ID }) order_id: number): Promise<OrderDTO | null> {
    return this.orderService.findOneById(order_id);
  }

  // Query untuk mengambil semua pesanan, dengan opsi filter
  @Query(() => [OrderDTO], { description: 'Mengambil daftar semua pesanan, bisa difilter.' })
  async allOrders(@Args('filters', { nullable: true }) filters?: OrderFilters): Promise<OrderDTO[]> {
    const orders = await this.orderService.findAll(filters);
    // Filter nulls karena mapOrderToDTO bisa mengembalikan null
    return orders.filter((o): o is OrderDTO => o !== null);
  }

  // Mutation untuk membuat pesanan baru
  @Mutation(() => OrderDTO, { description: 'Membuat pesanan baru.' })
  async createOrder(@Args('input') input: CreateOrderInput): Promise<OrderDTO> {
    // Assertion non-null karena OrderService.create dijamin mengembalikan OrderDTO
    return await this.orderService.create(input);
  }

  // Mutation untuk memperbarui status pesanan (Payment Status atau Shipping Status)
  @Mutation(() => OrderDTO, { description: 'Memperbarui status pesanan.' })
  async updateStatus(
    @Args('order_id', { type: () => ID }) order_id: number,
    @Args('payment_status', { nullable: true }) payment_status?: string,
    @Args('shipping_status', { nullable: true }) shipping_status?: string,
  ): Promise<OrderDTO> {
    // Assertion non-null karena OrderService.updateStatus dijamin mengembalikan OrderDTO
    return await this.orderService.updateStatus(order_id, payment_status, shipping_status);
  }

  // Mutation untuk menghapus pesanan
  @Mutation(() => Boolean, { description: 'Menghapus pesanan berdasarkan ID.' })
  async deleteOrder(@Args('order_id', { type: () => ID }) order_id: number): Promise<boolean> {
    return this.orderService.delete(order_id);
  }
}