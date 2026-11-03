/**
 * Validates tenant data files against core content schemas.
 * Run: node tools/validate-content.ts
 * Exits with code 1 if any validation fails.
 */
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = resolve(__dirname, '../src/tenant/data');

// Dynamic imports to avoid bundling issues
async function main() {
  const { validateTenantConfig } = await import('../src/core/config/tenantSchema.ts');
  const { validateCategoryContent } = await import('../src/core/config/contentSchemas/category.ts');
  const { validateProductContent } = await import('../src/core/config/contentSchemas/product.ts');
  const { validateBrandContent } = await import('../src/core/config/contentSchemas/brand.ts');
  const { validateZoneContent } = await import('../src/core/config/contentSchemas/zone.ts');
  const { validateSegmentContent } = await import('../src/core/config/contentSchemas/segment.ts');
  const { validateReviewContent } = await import('../src/core/config/contentSchemas/review.ts');
  const { validateFaqContent } = await import('../src/core/config/contentSchemas/faq.ts');
  const { validatePageContent } = await import('../src/core/config/contentSchemas/page.ts');

  const files: Array<{
    name: string;
    validate: (item: unknown) => unknown;
    isArray: boolean;
  }> = [
    { name: 'business.json', validate: validateTenantConfig, isArray: false },
    { name: 'categories.json', validate: validateCategoryContent, isArray: true },
    { name: 'products.json', validate: validateProductContent, isArray: true },
    { name: 'brands.json', validate: validateBrandContent, isArray: true },
    { name: 'zones.json', validate: validateZoneContent, isArray: true },
    { name: 'segments.json', validate: validateSegmentContent, isArray: true },
    { name: 'reviews.json', validate: validateReviewContent, isArray: true },
    { name: 'faqs.json', validate: validateFaqContent, isArray: true },
    { name: 'pages.json', validate: validatePageContent, isArray: true },
  ];

  let errors = 0;
  let checked = 0;

  for (const { name, validate, isArray } of files) {
    const filePath = resolve(dataDir, name);
    let raw: unknown;
    try {
      raw = JSON.parse(readFileSync(filePath, 'utf-8'));
    } catch (e) {
      console.error(`✗ ${name}: cannot read/parse — ${(e as Error).message}`);
      errors++;
      continue;
    }

    const items = isArray ? (raw as unknown[]) : [raw];
    for (let i = 0; i < items.length; i++) {
      try {
        validate(items[i]);
        checked++;
      } catch (e) {
        const label = isArray ? `${name}[${i}]` : name;
        console.error(`✗ ${label}: ${(e as Error).message}`);
        errors++;
      }
    }
  }

  if (errors > 0) {
    console.error(`\n${errors} validation error(s). Build would fail.`);
    process.exit(1);
  } else {
    console.log(`✓ All ${checked} items validated across ${files.length} files.`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
