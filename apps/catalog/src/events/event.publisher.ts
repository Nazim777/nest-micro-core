import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import {
  ProductCreatedEvent,
  ProductDeletedEvent,
  ProductUpdatedEvent,
} from '../products/product.events';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ProductEventPublisher implements OnModuleInit {
  private readonly logger = new Logger(ProductEventPublisher.name);
  constructor(
    @Inject('SEARCH_EVETNS_CLIENT')
    private readonly searchEventClient: ClientProxy,
    @Inject('MEDIA_EVETNS_CLIENT') private readonly mediaEventClient:ClientProxy
  ) {}

  async onModuleInit() {
    await this.searchEventClient.connect();
    this.logger.log('Connected to search queue');
  }

  async productCreated(event: ProductCreatedEvent) {
    try {
      console.log('product created event log', event);
      await firstValueFrom(
        this.searchEventClient.emit('product.created', event),
      );
    } catch (error) {
      this.logger.warn('Failed to publish product created event');
    }
  }

  async productUpdated(event: ProductUpdatedEvent) {
    try {
      await firstValueFrom(
        this.searchEventClient.emit('product.updated', event),
      );
    } catch (error) {
      this.logger.warn('Failed to publish product updated event');
    }
  }

  async productDeleted (event:ProductDeletedEvent){
    try {
      await firstValueFrom(
        this.searchEventClient.emit('product.deleted',event),
      )
      await firstValueFrom(
        this.mediaEventClient.emit('product.deleted',event),
      )
    } catch (error) {
      this.logger.warn('Failed to publish product deleted event')
    }
  }
}
