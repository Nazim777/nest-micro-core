import { Controller, Get, Inject, Query } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Public } from '../auth/public.decorator';
import { mapRpcErrorToHttp } from '@app/rpc';
import { firstValueFrom } from 'rxjs';

@Controller()
export class SearchHttpController {
  constructor(
    @Inject('SEARCH_CLIENT') private readonly searchClient: ClientProxy,
  ) {}

  @Get('search')
  @Public() // all user can access
  async search(@Query('q') q: string, @Query('limit') limit?: string) {
    const limitNumber =
      typeof limit === 'string' && limit.trim() ? Number(limit) : undefined;

    try {
      const result = await firstValueFrom(
        this.searchClient.send('search.query', { q, limit: limitNumber }),
      );
      return {
        q,
        count: Array.isArray(result) ? result.length : 0,
        result,
      };
    } catch (error) {
      throw mapRpcErrorToHttp(error);
    }
  }
}
