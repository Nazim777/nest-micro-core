import {
  BaseRpcExceptionFilter,
  RpcException,
} from '@nestjs/microservices';
import { ArgumentsHost, Catch } from '@nestjs/common';
import { Response } from 'express';
import { RpcErrorPayload } from './rpc.types';


@Catch()
export class RpcAllExecptionFilter extends BaseRpcExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    if (exception instanceof RpcException) {
      return super.catch(exception, host);
    }
    const status = exception?.getStatus?.();
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (status === 400) {
      const payload: RpcErrorPayload = {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details: response,
      };
      return super.catch(new RpcException(payload), host);
    }

    const payload: RpcErrorPayload = {
      code: 'INTERNAL',
      message: 'Internal error',
    };
    
    return super.catch(new RpcException(payload), host);
  }
}




// import { BaseRpcExceptionFilter, RpcException } from '@nestjs/microservices';
// import { ArgumentsHost, Catch, HttpException } from '@nestjs/common';
// import { RpcErrorPayload } from './rpc.types';
// import { ValidationError } from 'class-validator';

// @Catch()
// export class RpcAllExecptionFilter extends BaseRpcExceptionFilter {
//   catch(exception: any, host: ArgumentsHost) {
//     // RpcException is already safe
//     if (exception instanceof RpcException) {
//       return super.catch(exception, host);
//     }

//     // fallback for unexpected errors
//     const payload = {
//       code: 'INTERNAL',
//       message: exception?.message || 'Internal server error',
//     };
//     return super.catch(new RpcException(payload), host);
//   }
// }
