import { NestFactory } from '@nestjs/core';
import { SearchModule } from './search.module';
import { Logger } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  process.title = 'search'
  const logger = new Logger('SearchBootstrap')
  const port = Number(process.env.SEARCH_TCP_PORT?? 4013);
 
 const app = await NestFactory.createMicroservice<MicroserviceOptions>(
  SearchModule,
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

  logger.log(`Search Microservice TCP listening on port ${port}`)
}
bootstrap();

