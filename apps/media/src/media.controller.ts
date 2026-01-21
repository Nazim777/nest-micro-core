import { Controller } from '@nestjs/common';
import { MediaService } from './media.service';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import {
  AttachToProductDto,
  DeleteMediaFromDBandCloudByProductIdDto,
  UploadProductImageDto,
} from './dto/media.dto';

@Controller()
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @MessagePattern('media.uploadProductImage')
  async uploadImage(@Payload() payload: UploadProductImageDto) {
    return await this.mediaService.uploadProductImage(payload);
  }

  @MessagePattern('media.attachImageToProduct')
  async attachProduct(@Payload() payload: AttachToProductDto) {
    return await this.mediaService.attachToProduct(payload);
  }

  @EventPattern('product.deleted')
  async deleteMediaFromDBandCloudByProductId(
    @Payload() payload: DeleteMediaFromDBandCloudByProductIdDto,
  ) {
    return await this.mediaService.deleteMediaFromDBandCloudByProductId(
      payload,
    );
  }

  @MessagePattern('service.ping')
  ping() {
    return this.mediaService.ping();
  }
}
