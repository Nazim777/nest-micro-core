import { NestFactory } from '@nestjs/core';
import { CatalogModule } from './catalog.module';
import { Logger } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  process.title = 'catalog';
  const logger = new Logger('CatalogBootstrap');
  const rmqUrl = process.env.RABBITMQ_URL ?? 'amqp://localhost:5672';
  const catalogQueue = process.env.CATALOG_QUEUE ?? 'catalog_queue';
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    CatalogModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [rmqUrl],
        queue: catalogQueue,
        queueOptions: {
          durable: false,
        },
      },
    },
  );

  app.enableShutdownHooks();

  await app.listen();

  logger.log(`Catalog RMQ listening on ${catalogQueue} via ${rmqUrl}`);
}
bootstrap();
