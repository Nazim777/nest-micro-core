import { Injectable } from '@nestjs/common';
import { CloudinaryService } from './cloudinary/cloudinary.service';
import { InjectModel } from '@nestjs/mongoose';
import { Media, MediaDocument } from './schema/media.schema';
import { Model } from 'mongoose';
import { rpcBadRequest, rpcNotFound } from '@app/rpc';

@Injectable()
export class MediaService {
  constructor(
    private readonly cloudinaryService: CloudinaryService,
    @InjectModel(Media.name) private readonly mediaModel: Model<MediaDocument>,
  ) {}

  async uploadProductImage(input: {
    mimeType: string;
    uploadByUserId: string;
    fileName: string;
    base64: string;
  }) {
    if (!input.mimeType.startsWith('image/')) {
      rpcBadRequest('Only image are allowed');
    }

    if (!input.base64) {
      rpcBadRequest('Image base 64 needed');
    }

    const buffer = Buffer.from(input.base64, 'base64');

    const uploadResponse = await this.cloudinaryService.uploadFile(buffer);

    if (!uploadResponse.secure_url || !uploadResponse.public_id) {
      rpcBadRequest('Failed to upload image in cloudinary');
    }

    const result = await this.mediaModel.create({
      url: uploadResponse.secure_url,
      publicId: uploadResponse.public_id,
      uploadByUserId: input.uploadByUserId,
      productId: undefined,
    });

    return {
      mediaId: String(result._id),
      url: uploadResponse.secure_url,
      publicId: uploadResponse.public_id,
    };
  }

  async attachToProduct(input: { mediaId: string; productId: string }) {
    const updated = await this.mediaModel
      .findByIdAndUpdate(input.mediaId, {
        $set: {
          productId: input.productId,
        },
      })
      .exec();

    if (!updated?._id) {
      rpcNotFound('Media not found');
    }

    return {
      mediaId: String(updated._id),
      url: String(updated.url),
      publicId: updated.publicId,
      productId: updated.productId,
    };
  }

  ping() {
    return {
      ok: true,
      service: 'media',
      now: new Date().toISOString(),
    };
  }
}
