import { Inject, Injectable } from '@nestjs/common';
import * as streamifier from 'streamifier'
import type {
  v2 as cloudinaryType,
  UploadApiErrorResponse,
  UploadApiResponse,
} from 'cloudinary';
@Injectable()
export class CloudinaryService {
  constructor(
    @Inject('CLOUDINARY')
    private readonly cloudinary: typeof cloudinaryType,
  ) {}

  uploadFile(buffer: Buffer<ArrayBufferLike>): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      const uploadStream = this.cloudinary.uploader.upload_stream(
        {
          folder: 'nest_micro',
          resource_type: 'auto',
        },
        (error: UploadApiErrorResponse, result: UploadApiResponse) => {
          if (error) reject(error);
          resolve(result);
        },
      );

      streamifier.createReadStream(buffer).pipe(uploadStream)
    });
  }

  async deleteFile(publicId:string):Promise<void>{
    await this.cloudinary.uploader.destroy(publicId)
  }
}
