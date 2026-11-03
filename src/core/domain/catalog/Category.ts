import { CategoryId } from '../shared';

export interface CategorySeo {
  readonly title?: string;
  readonly description?: string;
}

export class Category {
  readonly id: CategoryId;
  readonly name: string;
  readonly parentId?: CategoryId;
  readonly order: number;
  readonly image?: string;
  readonly description?: string;
  readonly seo?: CategorySeo;

  constructor(params: {
    id: CategoryId;
    name: string;
    parentId?: CategoryId;
    order?: number;
    image?: string;
    description?: string;
    seo?: CategorySeo;
  }) {
    this.id = params.id;
    this.name = params.name;
    this.parentId = params.parentId;
    this.order = params.order ?? 0;
    this.image = params.image;
    this.description = params.description;
    this.seo = params.seo;
  }
}
