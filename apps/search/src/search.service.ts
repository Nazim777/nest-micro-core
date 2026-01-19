import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SearchProduct, SearchProductDocument } from './search/search.scheam';
import { Model } from 'mongoose';

@Injectable()
export class SearchService {
  constructor(
    @InjectModel(SearchProduct.name)
    private readonly model: Model<SearchProductDocument>,
  ) {}

  noramalizeText(input: { name: string; description: string }) {
    return `${input.name} ${input.description}`.toLowerCase();
  }

  async upsertFromCatalogEvent(input: {
    name: string;
    productId: string;
    description: string;
    status: 'DRAFT' | 'ACTIVE';
    price: number;
  }) {
    const normalizedText = this.noramalizeText({
      name: input.name,
      description: input.description,
    });

    await this.model.findOneAndUpdate(
      { productId: input.productId },
      {
        $set: {
          name: input.name,
          normalizedText,
          status: input.status,
          price: input.price,
        },
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      },
    );
  }

  async query (input: { q: string; limit?: number }) {
    const q = (input.q ?? '').trim().toLowerCase();

    if (!q) {
      return [];
    }

    const limit = Math.min(Math.max(input.limit ?? 10, 1), 20);

    const regex = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    return this.model
      .find({ normalizedText: { $regex: regex } })
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  }

  ping() {
    return {
      ok: true,
      service: 'search',
      now: new Date().toISOString(),
    };
  }
}
