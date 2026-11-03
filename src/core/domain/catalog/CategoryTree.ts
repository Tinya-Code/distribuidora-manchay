import { CategoryId } from '../shared';
import { Category } from './Category';

export class CategoryTree {
  private readonly byId: Map<CategoryId, Category>;
  private readonly children: Map<CategoryId | null, Category[]>;

  constructor(categories: Category[]) {
    this.byId = new Map(categories.map((c) => [c.id, c]));
    this.children = new Map();
    for (const c of categories) {
      const key = c.parentId ?? null;
      if (!this.children.has(key)) this.children.set(key, []);
      this.children.get(key)!.push(c);
    }
    for (const arr of this.children.values()) {
      arr.sort((a, b) => a.order - b.order);
    }
  }

  get(id: CategoryId): Category | undefined {
    return this.byId.get(id);
  }

  roots(): Category[] {
    return this.children.get(null) ?? [];
  }

  childrenOf(id: CategoryId): Category[] {
    return this.children.get(id) ?? [];
  }

  parentOf(id: CategoryId): Category | undefined {
    const c = this.byId.get(id);
    if (!c?.parentId) return undefined;
    return this.byId.get(c.parentId);
  }

  depth(id: CategoryId): number {
    let d = 1;
    let cur = this.byId.get(id);
    while (cur?.parentId) {
      d += 1;
      cur = this.byId.get(cur.parentId);
      if (d > 10) break;
    }
    return d;
  }

  ancestors(id: CategoryId): Category[] {
    const result: Category[] = [];
    let cur = this.byId.get(id);
    while (cur?.parentId) {
      const p = this.byId.get(cur.parentId);
      if (!p) break;
      result.unshift(p);
      cur = p;
    }
    return result;
  }

  path(id: CategoryId): Category[] {
    const ancestors = this.ancestors(id);
    const self = this.byId.get(id);
    return self ? [...ancestors, self] : ancestors;
  }

  all(): Category[] {
    return [...this.byId.values()];
  }

  isDescendant(child: CategoryId, ancestor: CategoryId): boolean {
    let cur = this.byId.get(child);
    while (cur?.parentId) {
      if (cur.parentId === ancestor) return true;
      cur = this.byId.get(cur.parentId);
    }
    return false;
  }
}
