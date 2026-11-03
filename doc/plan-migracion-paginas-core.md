# Plan de migración: páginas al core (doc/plantilla.md)

## Problema

Hay una inconsistencia arquitectónica grave entre `src/pages/` y `src/core/presentation/`:

- **`src/core/presentation/pages/`**: existen 14 páginas (`AboutPage`, `BusinessPage`, `CartPage`, etc.) pero son **placeholders vacíos** (`<div class="...page"><slot /></div>`).
- **`src/pages/`**: toda la lógica real está escrita directamente aquí, con duplicación de código y lógica de negocio mezclada en los `.astro`.

Según `doc/plantilla.md`, debería ser al revés: las vistas dumb reales viven en `src/core/presentation/pages/` y `src/pages/` solo importa y re-expone esas páginas pasándoles los datos del tenant. Actualmente se está construyendo sobre este desorden, por lo que hay que corregirlo antes de seguir agregando funcionalidad.

## Patrón correcto

### Vista dumb en el core (`src/core/presentation/pages/XPage.astro`)

Recibe **todo por props**. No importa de `tenant`, no tiene lógica de negocio, solo dibuja HTML.

```astro
---
interface Props {
  lines: any[];
  totals: any;
  zones: any[];
  business: any;
}
const { lines, totals, zones, business } = Astro.props;
---
<!-- HTML real de la página, puro presentacional -->
```

### Puente delgado en el sitio (`src/pages/...`)

Importa la página del core, prepara los datos y los pasa.

```astro
---
import CartPage from '../../core/presentation/pages/CartPage.astro';
import { ensureContainer } from '../../core/composition';

const container = ensureContainer();
const cart = container.cartStore.get();
const lines = cart.getLines();
// ... preparar datos (totales, zonas, negocio) ...
---
<CartPage lines={lines} totals={totals} zones={zones} business={business} />
```

## Reglas durante la migración

1. **No tocar lógica de los controladores smart** (elementos personalizados `.ts`) ni de `buildContainer.ts`.
2. **Las páginas del core no importan de `tenant`** (respeto de la frontera). Los datos llegan por props desde `src/pages/`.
3. **Después de migrar cada página**: correr `pnpm build`, `pnpm vitest run`, `pnpm check-boundaries` y `pnpm validate-content`.
4. **Un puente delgado por página**: `src/pages/` solo importa y pasa datos; no duplica HTML ni lógica de presentación.

## Orden de migración

| # | Página core | Puente en `src/pages/` | Estado |
|---|-------------|------------------------|--------|
| 1 | `CartPage.astro` | `src/pages/carrito.astro` | ✅ completada |
| 2 | `CatalogPage.astro` | `src/pages/catalogo.astro` | ✅ completada |
| 3 | `ProductPage.astro` | `src/pages/producto/[slug].astro` | ✅ completada |
| 4 | `HomePage.astro` | `src/pages/index.astro` | ✅ completada |
| 5 | `CategoryPage.astro` | `src/pages/productos/[category].astro` | ✅ completada |
| 6 | `SubcategoryPage.astro` | `src/pages/productos/[category]/[subcategoria].astro` | ✅ completada |
| 7 | `ZonesPage.astro` | `src/pages/zonas.astro` | ✅ completada |
| 8 | `ZonePage.astro` | `src/pages/zonas/[slug].astro` | ✅ completada |
| 9 | `BusinessPage.astro` | `src/pages/negocios.astro` | ✅ completada |
| 10 | `SegmentPage.astro` | `src/pages/negocios/[slug].astro` | ✅ completada |
| 11 | `QuotePage.astro` | `src/pages/cotizar.astro` | ✅ completada |
| 12 | `AboutPage.astro` | `src/pages/nosotros.astro` | ✅ completada |
| 13 | `ContactPage.astro` | `src/pages/contacto.astro` | ✅ completada |
| 14 | `NotFoundPage.astro` | `src/pages/404.astro` | ✅ completada |

## Flujo por página

Para cada página (ejemplo `CartPage`):

1. **Leer** el puente actual en `src/pages/carrito.astro` y el placeholder en `src/core/presentation/pages/CartPage.astro`.
2. **Mover el HTML real** de `src/pages/carrito.astro` a `CartPage.astro`, convirtiendo variables locales en `Props` recibidas por `Astro.props`.
3. **Dejar `src/pages/carrito.astro`** como puente: importa `CartPage`, prepara datos con `ensureContainer()`, los pasa como props.
4. **Verificar**: `pnpm build`, `pnpm vitest run`, `pnpm check-boundaries`, `pnpm validate-content`.
5. **Marcar completada** en este documento y pasar a la siguiente.

## Criterio de salida

- `src/core/presentation/pages/*.astro` contiene las 14 páginas con HTML real y props.
- `src/pages/*.astro` son puentes delgados sin duplicación de presentación.
- `pnpm build` OK (34 páginas).
- `pnpm vitest run` 32 tests verdes.
- `pnpm check-boundaries` 0 violaciones.
- `pnpm validate-content` 39 items validados.
- `tsc --noEmit` limpio.
