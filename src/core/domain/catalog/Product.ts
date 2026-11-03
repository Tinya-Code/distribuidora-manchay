import { ProductId, CategoryId, BrandId, Money, PresentationId } from '../shared';
import { Presentation } from './Presentation';

export interface ProductAttribute {
  readonly name: string;
  readonly value: string;
}

export class Product {
  readonly id: ProductId;
  readonly name: string;
  readonly brandId?: BrandId;
  readonly categoryId: CategoryId;
  readonly presentations: readonly Presentation[];
  readonly attributes: readonly ProductAttribute[];
  readonly tags: readonly string[];
  readonly available: boolean;
  readonly featured: boolean;
  readonly returnable: boolean;
  readonly deposit?: Money;
  readonly complements: readonly ProductId[];
  readonly alternatives: readonly ProductId[];
  readonly description?: string;
  readonly image?: string;

  constructor(params: {
    id: ProductId;
    name: string;
    brandId?: BrandId;
    categoryId: CategoryId;
    presentations: Presentation[];
    attributes?: ProductAttribute[];
    tags?: string[];
    available?: boolean;
    featured?: boolean;
    returnable?: boolean;
    deposit?: Money;
    complements?: ProductId[];
    alternatives?: ProductId[];
    description?: string;
    image?: string;
  }) {
    this.id = params.id;
    this.name = params.name;
    this.brandId = params.brandId;
    this.categoryId = params.categoryId;
    this.presentations = params.presentations;
    this.attributes = params.attributes ?? [];
    this.tags = params.tags ?? [];
    this.available = params.available ?? true;
    this.featured = params.featured ?? false;
    this.returnable = params.returnable ?? false;
    this.deposit = params.deposit;
    this.complements = params.complements ?? [];
    this.alternatives = params.alternatives ?? [];
    this.description = params.description;
    this.image = params.image;
  }

  findPresentation(id: PresentationId): Presentation | undefined {
    return this.presentations.find((p) => p.id === id);
  }

  defaultPresentation(): Presentation | undefined {
    return this.presentations[0];
  }
}
