import { NestFactory } from '@nestjs/core';
import { MediaModule } from './media.module';
import { Logger } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  process.title = 'media'
  const logger = new Logger('MediaBootstrap')
  const rmqUrl = process.env.RABBITMQ_URL ?? 'amqp://localhost:5672';
  const mediaQueue = process.env.MEDIA_QUEUE ?? 'media_queue';
 const app = await NestFactory.createMicroservice<MicroserviceOptions>(
  MediaModule,
  {
      transport: Transport.RMQ,
      options: {
        urls: [rmqUrl],
        queue: mediaQueue,
        queueOptions: {
          durable: false,
        },
      },
    },
 )

 app.enableShutdownHooks();

  await app.listen();

  logger.log(`Media RMQ listening on ${mediaQueue} via ${rmqUrl}`)
}
bootstrap();
