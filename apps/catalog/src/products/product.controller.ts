import { Controller } from '@nestjs/common';
import { ProductService } from './product.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateProductDto, GetProductByIdDto } from './product.dto';

@Controller()
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @MessagePattern('product.create')
  async create(@Payload() payload: CreateProductDto) {
  const product = await this.productService.createNewProduct(payload);
  return product;
  }


  @MessagePattern('product.listAll')
  async list() {
    return await this.productService.listProduct();
  }

  @MessagePattern('product.getById')
  async getById(@Payload() payload: GetProductByIdDto) {
    return await this.productService.getProductById(payload);
  }
}
