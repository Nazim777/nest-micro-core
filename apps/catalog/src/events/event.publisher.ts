import { Inject, Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { ProductCreatedEvent } from "../products/product.events";
import { firstValueFrom } from "rxjs";

@Injectable()
export class ProductEventPublisher implements OnModuleInit{
    private readonly logger = new Logger(ProductEventPublisher.name);
    constructor(
        @Inject('SEARCH_EVETNS_CLIENT') private readonly searchEventClient:ClientProxy
    ){}

   async onModuleInit() {
        await this.searchEventClient.connect()
        this.logger.log('Connected to search queue')
    }

    async productCreated(event:ProductCreatedEvent){
        try {
            console.log('product created event log',event);
            await firstValueFrom(
                this.searchEventClient.emit('product.created',event)
            )
        } catch (error) {
            this.logger.warn('Failed to publish product created event')
        }
    }
   
}