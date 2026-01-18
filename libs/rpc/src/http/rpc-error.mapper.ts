import { BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';

export function mapRpcErrorToHttp(err: any) {
  const payload = err.error ?? err;
  const code = payload?.code as string | undefined;
  const message = payload.message ?? 'Request failed';

  if (code === 'BAD_REQUEST' || code === 'VALIDATION_ERROR') {
    throw new BadRequestException(message);
  }

  if (code === 'NOT_FOUND') {
    throw new NotFoundException(message);
  }

  if (code === 'UNAUTHORIZED') {
    throw new NotFoundException(message);
  }

  if (code === 'FORBIDDEN') {
    throw new NotFoundException(message);
  }

  throw new InternalServerErrorException(message)
}
