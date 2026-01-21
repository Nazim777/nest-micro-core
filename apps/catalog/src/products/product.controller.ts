import { Controller } from '@nestjs/common';
import { ProductService } from './product.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CreateProductDto, ProductByIdDto, UpdateProductDto } from './product.dto';

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

  @MessagePattern('product.update')
  async updateProduct(@Payload() payload: UpdateProductDto){
    const product = await this.productService.updateProduct(payload)
     return product;
  }

  @MessagePattern('product.getById')
  async getById(@Payload() payload: ProductByIdDto) {
    return await this.productService.getProductById(payload);
  }

  @MessagePattern('product.delete')
  async deleteProduct(@Payload() payload: ProductByIdDto){
    return await this.productService.deleteProductById(payload);
  }

}
