import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CurrentUser } from '../auth/current-user.decorator';
import type { UserContext } from '../auth/auth.types';
import { firstValueFrom } from 'rxjs';
import { mapRpcErrorToHttp } from '@app/rpc';
import { AdminOnly } from '../auth/admin.decorator';
import { Public } from '../auth/public.decorator';
import { FileInterceptor } from '@nestjs/platform-express';

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
    @Inject('MEDIA_CLIENT') private readonly mediaClient: ClientProxy,
  ) {}

  // we need to implement the media/image related task
  // this this route is protected means user has to be authenticated and admin
  @Post('products')
  @AdminOnly() // admin can access only
  @UseInterceptors(
    FileInterceptor('file', { limits: { fieldSize: 5 * 1024 * 1024 } }),
  )
  async createProduct(
    @CurrentUser() user: UserContext,
    @UploadedFile() file: Express.Multer.File | undefined,
    @Body()
    body: {
      name: string;
      description: string;
      price: number;
      status?: string;
      imageUrl: string;
    },
  ) {
    let imageUrl: string | undefined = undefined;
    let mediaId: string | undefined = undefined;

    // upload product
    if (file) {
      const base64 = file.buffer.toString('base64');
      try {
        const uplaodResult = await firstValueFrom(
          this.mediaClient.send('media.uploadProductImage', {
            fileName: file.originalname,
            mimeType: file.mimetype,
            base64,
            uploadByUserId: user.clerkuserId,
          }),
        );
        console.log('uploadResult', uplaodResult);
        imageUrl = uplaodResult?.url;
        mediaId = uplaodResult?.mediaId;
      } catch (error) {
        throw mapRpcErrorToHttp(error);
      }
    }

    let product: productResponse | null = null;

    const payload = {
      name: body.name,
      description: body.description,
      price: Number(body.price),
      status: body.status,
      imageUrl,
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

    if (mediaId) {
      try {
        await firstValueFrom(
          this.mediaClient.send('media.attachImageToProduct', {
            mediaId,
            productId: String(product._id),
            attachedByUserId: user.clerkuserId,
          }),
        );
      } catch (error) {
        throw mapRpcErrorToHttp(error);
      }
    }

    return product;
  }

  @Put('products/:id')
  @AdminOnly()
  async updateProduct(
    @Param('id') id: string,
    @Body()
    body: { name: string; description: string; price: number; status: string },
  ) {
    try {
      const updatedProduct = await firstValueFrom(
        await this.catalogClient.send('product.update', { id, ...body }),
      );
      return updatedProduct;
    } catch (error) {
      throw mapRpcErrorToHttp(error);
    }
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
  async getProductById(@Param('id') id: string) {
    try {
      return await firstValueFrom(
        this.catalogClient.send('product.getById', { id }),
      );
    } catch (error) {
      throw mapRpcErrorToHttp(error);
    }
  }

  @Delete('products/:id')
  @AdminOnly()
  async deleteProduct(@Param('id') id: string) {
    try {
      return await firstValueFrom(
        this.catalogClient.send('product.delete', { id }),
      );
    } catch (error) {
      throw mapRpcErrorToHttp(error);
    }
  }
}
