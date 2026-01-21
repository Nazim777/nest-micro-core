import { Controller, Get } from '@nestjs/common';
import { SearchService } from './search.service';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import {
  DeleteSearchByProductId,
  ProductCreatedForSearchDto,
  ProductUpdatedForSearchDto,
} from './events/product-event.dto';
import { SearchQueryDto } from './search/search-query.dto';

@Controller()
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  // service to service communication publish from product service when create product
  @EventPattern('product.created')
  async onProductCreated(@Payload() payload: ProductCreatedForSearchDto) {
    console.log('product created event payload', payload);

    await this.searchService.upsertFromCatalogEvent({
      name: payload.name,
      status: payload.status,
      price: payload.price,
      productId: payload.productId,
      description: payload.description,
    });
  }

  // upadte search when product updated
  @EventPattern('product.updated')
  async updateProductSearch(@Payload() payload: ProductUpdatedForSearchDto) {
    return await this.searchService.updateProdctSearch(payload);
  }

  // gateway to service communication
  @MessagePattern('search.query')
  async query(@Payload() payload: SearchQueryDto) {
    return await this.searchService.query({
      q: payload.q,
      limit: payload.limit,
    });
  }

  // delete search by product id

  @EventPattern('product.deleted')
  async deleteSearch(@Payload() paylaod: DeleteSearchByProductId) {
    return await this.searchService.deleteSearchByProductId(paylaod);
  }

  @MessagePattern('service.ping')
  ping() {
    return this.searchService.ping();
  }
}
