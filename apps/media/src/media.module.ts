import { Module } from '@nestjs/common';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Media, MediaSchema } from './schema/media.schema';

@Module({
  imports: [
  ConfigModule.forRoot({isGlobal:true}),
  MongooseModule.forRoot(process.env.MONGO_URI_MEDIA as string),
  MongooseModule.forFeature([{name:Media.name,schema:MediaSchema}]),
  CloudinaryModule, // to use cloudinary service we have to import cloadinary module
  ],
  controllers: [MediaController],
  providers: [MediaService],
})
export class MediaModule {}
