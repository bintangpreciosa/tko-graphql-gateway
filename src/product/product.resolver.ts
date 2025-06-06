// src/product/product.resolver.ts
import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { ProductService } from './product.service';
import { ProductDTO, CreateProductInput, UpdateProductInput, ProductFilters } from './dto/product.dto';
import { Product } from './entity/product.entity'; 

@Resolver(() => ProductDTO)
export class ProductResolver {
  constructor(private readonly productService: ProductService) {}

  // Helper untuk mengubah Product Entity menjadi ProductDTO
  private mapProductToDTO(product: Product): ProductDTO | null {
    if (!product) return null;

    const productDTO = new ProductDTO();
    productDTO.product_id = product.product_id;
    productDTO.name = product.name;
    productDTO.description = product.description;
    productDTO.price = product.price;
    productDTO.stock = product.stock;
    productDTO.image_url = product.image_url;
    productDTO.status = product.status;

    productDTO.created_at = product.created_at?.toISOString() ?? '';
    productDTO.updated_at = product.updated_at?.toISOString() ?? undefined;

    return productDTO;
  }

  // Query untuk mengambil satu produk berdasarkan ID
  @Query(() => ProductDTO, { nullable: true, description: 'Mengambil detail produk berdasarkan ID.' })
  async product(@Args('product_id', { type: () => ID }) product_id: number): Promise<ProductDTO | null> {
    const product = await this.productService.findOneById(product_id);
    return this.mapProductToDTO(product);
  }

  // Query untuk mengambil semua produk, dengan opsi filter
  @Query(() => [ProductDTO], { description: 'Mengambil daftar semua produk, bisa difilter.' })
  async allProducts(@Args('filters', { nullable: true }) filters?: ProductFilters): Promise<ProductDTO[]> {
    const products = await this.productService.findAll(filters);
    // Map dan filter out setiap nilai null dari array
    return products.map(p => this.mapProductToDTO(p)).filter((p): p is ProductDTO => p !== null);
  }

  // Mutation untuk membuat produk baru
  @Mutation(() => ProductDTO, { description: 'Membuat produk baru.' })
  async createProduct(@Args('input') input: CreateProductInput): Promise<ProductDTO> {
    const newProduct = await this.productService.create(input);
    return this.mapProductToDTO(newProduct)!;
  }

  // Mutation untuk memperbarui produk
  @Mutation(() => ProductDTO, { description: 'Memperbarui produk yang sudah ada.' })
  async updateProduct(
    @Args('product_id', { type: () => ID }) product_id: number,
    @Args('input') input: UpdateProductInput,
  ): Promise<ProductDTO> {
    const updatedProduct = await this.productService.update(product_id, input);
    return this.mapProductToDTO(updatedProduct)!;
  }

  // Mutation untuk menghapus produk
  @Mutation(() => Boolean, { description: 'Menghapus produk berdasarkan ID.' })
  async deleteProduct(@Args('product_id', { type: () => ID }) product_id: number): Promise<boolean> {
    return this.productService.delete(product_id);
  }
}