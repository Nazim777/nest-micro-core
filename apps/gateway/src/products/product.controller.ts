import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CurrentUser } from '../auth/current-user.decorator';
import type { UserContext } from '../auth/auth.types';
import { firstValueFrom } from 'rxjs';
import { mapRpcErrorToHttp } from '@app/rpc';
import { AdminOnly } from '../auth/admin.decorator';
import { Public } from '../auth/public.decorator';

type productResponse = {
  _id: string;
  name: string;
  description: string;
  price: number;
  status: 'DRAFT' | 'ACTIVE';
  imageUrl: string | undefined;
  createdByClerkUserId: string | undefined;
};

@Controller()
export class ProductHttpController {
  constructor(
    // gateway talks to catalog via RMQ client
    @Inject('CATALOG_CLIENT') private readonly catalogClient: ClientProxy,
  ) {}

  // we need to implement the media/image related task
  // this this route is protected means user has to be authenticated and admin
  @Post('products')
  @AdminOnly() // admin can access only
  async createProduct(
    @CurrentUser() user: UserContext,
    @Body()
    body: {
      name: string;
      description: string;
      price: number;
      status?: string;
      imageUrl: string;
    },
  ) {
    let product: productResponse | null = null;

    const payload = {
      name: body.name,
      description: body.description,
      price: body.price,
      status: body.status,
      imageUrl: body.imageUrl,
      createdByClerkUserId: user.clerkuserId,
    };

    // RMQ request and response pattern
    try {
      product = await firstValueFrom(
        this.catalogClient.send<productResponse>('product.create', payload),
      );
    } catch (error) {
      throw mapRpcErrorToHttp(error);
    }

    return product;
  }

  // by default i made all the route protected means user has to be authenticated and if we want to make any route publically available we need to use @Public() , this will make the route public
  @Get('products')
  @Public() // public route
  async getAll() {
    try {
      return await firstValueFrom(
        this.catalogClient.send('product.listAll', {}),
      );
    } catch (error) {
      throw mapRpcErrorToHttp(error);
    }
  }

  @Get('products/:id')
  @Public()
  async getProductById(@Param('id') id:string){
    try {
      return await firstValueFrom(this.catalogClient.send('product.getById',{id}))
    } catch (error) {
      throw mapRpcErrorToHttp(error)
    }
  }
}
