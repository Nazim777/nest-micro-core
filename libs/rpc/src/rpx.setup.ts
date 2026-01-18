import { INestMicroservice, ValidationPipe } from "@nestjs/common";
import { RpcAllExecptionFilter } from "./rpc-exception.filter";
import { RpcException } from "@nestjs/microservices";


export function applyToMicroserviceLayer(app: INestMicroservice) {
  app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    exceptionFactory: (errors) => {
      const formatted = errors.map((err) => ({
        property: err.property,
        constraints: err.constraints,
      }));

      return new RpcException({
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details: formatted,
      });
    },
  }),
);


  app.useGlobalFilters(new RpcAllExecptionFilter());
}
