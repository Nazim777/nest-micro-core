import { Controller } from '@nestjs/common';
import { MediaService } from './media.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AttachToProductDto, UploadProductImageDto } from './dto/media.dto';

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

  @MessagePattern('service.ping')
  ping() {
    return this.mediaService.ping();
  }
}
