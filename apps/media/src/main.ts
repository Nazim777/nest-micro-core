import { NestFactory } from '@nestjs/core';
import { MediaModule } from './media.module';
import { Logger } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  process.title = 'media'
  const logger = new Logger('MediaBootstrap')
  const port = Number(process.env.MEDIA_TCP_PORT?? 4012);
 
 const app = await NestFactory.createMicroservice<MicroserviceOptions>(
  MediaModule,
  {
    transport:Transport.TCP,
    options:{
      host:'0.0.0.0',
      port
    }
  }
 )

 app.enableShutdownHooks();

  await app.listen();

  logger.log(`Media Microservice TCP listening on port ${port}`)
}
bootstrap();
