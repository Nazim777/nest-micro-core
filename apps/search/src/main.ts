import { NestFactory } from '@nestjs/core';
import { SearchModule } from './search.module';
import { Logger } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  process.title = 'search'
  const logger = new Logger('SearchBootstrap')
  const rmqUrl = process.env.RABBITMQ_URL ?? 'amqp://localhost:5672';
  const searchQueue = process.env.SEARCH_QUEUE ?? 'search_queue';
 const app = await NestFactory.createMicroservice<MicroserviceOptions>(
  SearchModule,
  {
      transport: Transport.RMQ,
      options: {
        urls: [rmqUrl],
        queue: searchQueue,
        queueOptions: {
          durable: false,
        },
      },
    },
 )

 app.enableShutdownHooks();

  await app.listen();

  logger.log(`Search RMQ listening on ${searchQueue} via ${rmqUrl}`)
}
bootstrap();

