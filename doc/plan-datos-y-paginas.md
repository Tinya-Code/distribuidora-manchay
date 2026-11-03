# Plan detallado — Datos simulados (JSON separados) + páginas completas (Momento A)

> Plan de ejecución. No contiene código: solo instrucciones, restricciones, criterios y verificaciones.
>
> **Cambio clave:** los datos NO se guardan en un solo objeto monolítico ni en archivos MD por entidad. Viven en **JSON separados por recurso** (`src/tenant/data/*.json`), cada uno simulando la respuesta de un endpoint de API distinto (`/api/categories`, `/api/products`, `/api/zones`, etc.). Esto respeta el principio de responsabilidad única: cada recurso se valida, se consume y se mapea por separado. El proyecto ya tiene la infraestructura preparada para esto (`CatalogSource` port con `products()`, `categories()`, `zones()` separados, `mappers.ts` con `toCategory`, `toProduct`, `toZone` independientes, y `StaticCatalogSource` que recibe arrays separados).
>
> **Fuentes:** `doc/idea.md` (pantallas, reglas, modelo de datos) y `doc/plantilla.md` (estructura, capas).

---

## Convenciones

- Cada tarea es un checkbox `- [ ]`. Marcar solo con resultado observable y verificación.
- Idioma del código: inglés. Contenido visible: español neutro.
- Commits: Conventional Commits, en rama de feature.
- Tamaño de work-unit: ~400 líneas (adicionales + eliminadas, sin generados) advisory.
- Cada cambio se cierra con `Risk: item N (motivo)` o `Risk: none`.

## Restricciones globales

### Arquitectura
1. `core` nunca importa de `tenant` (salvo módulo virtual).
2. Dirección de dependencias: domain → nada; application → domain; infrastructure → application+domain; composition → todas; presentation/ui solo tipos; presentation/features → application+composition; presentation/pages → application (consultas), composition, presentation.
3. Lo general no conoce lo específico.
4. Lo específico no contiene lógica.
5. La lógica no sabe cómo se ve.
6. La vista no decide nada.

### Datos
- **Un JSON por recurso**, simulando endpoints de API separados:
  - `src/tenant/data/business.json` → `/api/business`
  - `src/tenant/data/categories.json` → `/api/categories`
  - `src/tenant/data/brands.json` → `/api/brands`
  - `src/tenant/data/products.json` → `/api/products`
  - `src/tenant/data/zones.json` → `/api/zones`
  - `src/tenant/data/segments.json` → `/api/segments`
  - `src/tenant/data/reviews.json` → `/api/reviews`
  - `src/tenant/data/faqs.json` → `/api/faqs`
  - `src/tenant/data/pages.json` → `/api/pages`
- Los esquemas de validación viven en `core/config/` y validan cada recurso por separado.
- Si falta un campo o tiene formato incorrecto, la construcción falla con mensaje claro.
- No se crean archivos MD por entidad. El contenido de texto libre (nosotros, contacto, políticas) puede vivir en `pages.json` o en `business.json`.
- Cada recurso se consume, valida y mapea de forma independiente (responsabilidad única).

### JavaScript en el navegador
- HTML sin JS propio salvo carrito mínimo; islas solo donde se usan.
- Estado del carrito compartido con `Store`, persistiendo en el navegador.

### Seguridad
- No guardar datos de pago.
- La API recalcula el total con su propia copia de precios.
- El envío a la API no bloquea la salida por WhatsApp.

---

## Fase A — Datos simulados en JSON separados

**Objetivo:** crear JSONs separados por recurso que simulen respuestas de API, validarlos con los esquemas y generar páginas.

### A.1 Estructura de archivos de datos

```
src/tenant/data/
├── business.json       → identidad, contacto, horario, pagos, API, SEO, funcionalidades
├── categories.json     → árbol de categorías (padreId)
├── brands.json         → marcas
├── products.json       → productos con presentaciones y tramos de precio
├── zones.json          → zonas de reparto
├── segments.json       → segmentos de negocio
├── reviews.json        → reseñas reales
├── faqs.json           → preguntas frecuentes
└── pages.json          → nosotros, contacto, políticas
```

Cada JSON es un array (o un objeto para `business.json`) que simula la respuesta de un endpoint de API. No hay un objeto monolítico.

### A.2 Tareas — negocio
- [x] Crear `src/tenant/data/business.json` con datos simulados (identidad, contacto, horario, hora de corte, pedido mínimo general, métodos de pago, moneda, API, plantilla de mensaje, analítica, SEO, funcionalidades activas), siguiendo la estructura de `doc/idea.md` §7.1 Negocio.
- [x] Validar con `validateTenantConfig` (o un validador equivalente para el JSON de negocio).

### A.3 Tareas — categorías (árbol de hasta 3 niveles)
- [x] Crear `src/tenant/data/categories.json` con al menos 9 categorías/subcategorías:
  - Agua (raíz), Bidones, Agua embotellada (hijas de Agua).
  - Gaseosas (raíz), Personal, Familiar (hijas de Gaseosas).
  - Energizantes, Jugos y néctares, Ofertas y packs (raíz).
- [x] Cada categoría con `id`, `nombre`, `slug`, `padreId`, `orden`, `imagen`, `descripcion`, `seo`.
- [x] Validar cada entrada con `validateCategoryContent`.

### A.4 Tareas — marcas
- [x] Crear `src/tenant/data/brands.json` con al menos 2 marcas (`id`, `nombre`, `slug`, `logo`).
- [x] Validar cada entrada con `validateBrandContent`.

### A.5 Tareas — productos (al menos 8)
- [x] Crear `src/tenant/data/products.json` con:
  - `gaseosa-500` con presentaciones (unidad, paquete x12) y tramos minorista/mayorista.
  - `gaseosa-15`.
  - `gaseosa-3`.
  - `agua-625`.
  - `bidon-20` (retornable, depósito, canje).
  - `agua-gas`.
  - `energizante`.
  - `pack-familiar` (oferta).
- [x] Cada producto con `id`, `nombre`, `slug`, `categoriaIds`, `marcaId`, `descripcion`, `imagenes`, `atributos`, `etiquetas`, `retornable`, `disponible`, `destacado`, `presentaciones` (con `precios.minorista` y `precios.mayorista` como arrays de tramos), `complementarios`, `alternativas`.
- [x] Validar cada entrada con `validateProductContent`.

### A.6 Tareas — zonas (al menos 3)
- [x] Crear `src/tenant/data/zones.json` con `pachacamac-centro`, `manchay`, `villa-el-salvador`.
- [x] Cada zona con `id`, `nombre`, `slug`, `distritos`, `costoEnvio`, `envioGratisDesde`, `pedidoMinimo`, `tiempoEntrega`, `diasReparto`, `franjas`, `seo`.
- [x] Validar cada entrada con `validateZoneContent`.

### A.7 Tareas — segmentos
- [x] Crear `src/tenant/data/segments.json` con `bodegas`, `restaurantes`, `oficinas`, `eventos`.
- [x] Cada segmento con `id`, `nombre`, `slug`, `titulo`, `texto`, `productosSugeridos`, `calculadora`.
- [x] Validar cada entrada con `validateSegmentContent`.

### A.8 Tareas — reseñas (mínimo 3, reales simuladas)
- [x] Crear `src/tenant/data/reviews.json` con al menos 3 reseñas.
- [x] Validar cada entrada con `validateReviewContent`.

### A.9 Tareas — FAQ (mínimo 5)
- [x] Crear `src/tenant/data/faqs.json` con al menos 5 preguntas.
- [x] Validar cada entrada con `validateFaqContent`.

### A.10 Tareas — páginas de contenido
- [x] Crear `src/tenant/data/pages.json` con `nosotros`, `contacto`, `politicas` (slug, título, cuerpo).
- [x] Validar cada entrada con `validatePageContent`.

### A.11 Tareas — tema y assets
- [x] `src/tenant/theme/tokens.css` con colores, tipografías, radios, espacios.
- [x] Logo e imágenes de productos, almacén y reparto en `src/tenant/assets/` (placeholders).

### A.12 Tareas — cableado de datos
- [x] Crear `src/tenant/data/index.ts` (o `src/tenant/catalog.ts`) que:
  - Importe cada JSON por separado.
  - Valide cada recurso con su esquema correspondiente.
  - Mapee los datos crudos a clases del dominio usando `toCategory`, `toProduct`, `toZone` (y equivalentes para brands, segments, reviews, faqs, pages).
  - Exporte arrays tipados: `categories`, `brands`, `products`, `zones`, `segments`, `reviews`, `faqs`, `pages`.
- [x] Instanciar `StaticCatalogSource` con los arrays mapeados: `new StaticCatalogSource(products, categories, zones)`.
- [x] `buildContainer` recibe el `catalog` (StaticCatalogSource) y lo inyecta.
- [x] `content.config.ts` (o equivalente) usa los JSONs separados para definir las colecciones de Astro, cada una con su esquema.

### A.13 Verificación de datos
- [x] `pnpm build` genera todas las páginas sin error.
- [x] Un dato faltante o mal formado en cualquier JSON hace fallar la construcción con mensaje claro.
- [x] `check-boundaries` en verde (0 violaciones).
- [x] `tsc --noEmit` OK.

**Criterio de salida A:** datos simulados validados al construir, separados por recurso (como endpoints de API), sitio con catálogo real y páginas generadas.

---

## Fase B — Carrito interactivo (isla)

**Objetivo:** carrito funcional que persiste en el navegador y se comparte entre páginas.

### B.1 Estado compartido
- [x] Cablear `CartStore` con `LocalStorageCartStorage` en `buildContainer`.
- [x] `PricingModeStore` con `LocalStorageCustomerPrefs`.
- [x] Una sola instancia por página, compartida por todos los controladores.

### B.2 Vista dumb
- [x] `CartPanel.astro` con moldes `<template>` para líneas.
- [x] `CartLine.astro` como molde de una línea.
- [x] `CartTotals.astro` con totales.

### B.3 Controlador smart
- [x] `CartElement.ts` (clase `HTMLElement`) que:
  - se suscribe al `CartStore`,
  - clona el molde por cada línea y rellena datos,
  - maneja agregar/quitar/cambiar cantidad,
  - actualiza el HTML.
- [x] `CartPresenter.ts` que convierte dominio a datos para mostrar (textos con formato, estados de tramo/ahorro).

### B.4 Integración en páginas
- [x] Botón Agregar en `ProductCard` modifica el store.
- [x] Contador en `Header` se actualiza.
- [x] Panel lateral se abre desde cualquier página.
- [x] Página `/carrito` usa el mismo carrito.

### B.5 Verificación
- [x] Agregar producto en catálogo → contador sube.
- [x] Recargar página → carrito persiste.
- [x] Cambiar cantidad en panel → total se recalcula.
- [x] Pruebas de presentador: textos correctos.
- [x] Pruebas de controlador: reacciona a eventos (entorno simulado).

**Criterio de salida B:** carrito funcional, persistente y compartido entre páginas.

---

## Fase C — Catálogo y ficha de producto

**Objetivo:** catálogo navegable con filtros, orden e interruptor Hogar/Negocio.

### C.1 Catálogo
- [x] `CatalogPage.astro` genera lista de productos desde los datos del JSON de productos.
- [x] Filtros en navegador: categoría, subcategoría, marca, tamaño, tipo de envase, solo disponibles.
- [x] Orden: más pedidos, precio menor a mayor, nombre.
- [x] Vista cuadrícula y tabla.
- [x] Interruptor Hogar/Negocio visible arriba que cambia precio y formato.
- [x] Tarjeta: imagen, nombre, presentación, precio, etiqueta, selector de cantidad, botón Agregar.
- [x] Aviso de tramo: "Lleva 5 y paga S/ 19.00 c/u".
- [x] Buscador estático con sugerencias (generado al publicar, sin servidor).

### C.2 Ficha de producto
- [x] `ProductPage.astro` con galería, nombre.
- [x] Selector de presentación (unidad/paquete/caja) con precio y cantidad.
- [x] Tabla de precios por volumen (tramos) visible.
- [x] Aviso de envase retornable (canje/depósito).
- [x] Descripción corta.
- [x] Botones: Agregar al carrito y Pedir este producto por WhatsApp (mensaje directo).
- [x] Complementarios ("Se compra junto con").
- [x] Alternativas (otro tamaño o marca).
- [x] Marca "No disponible" si el dato así lo indica.

### C.3 Verificación
- [x] Filtros funcionan sin recargar.
- [x] Interruptor Hogar/Negocio cambia precios.
- [x] Ficha muestra tramos y envase retornable.
- [x] Pruebas de presentador/controlador verdes.

**Criterio de salida C:** catálogo y ficha de producto completos y usables.

---

## Fase D — Checkout y envío del pedido

**Objetivo:** flujo completo de envío por WhatsApp + copia a la API.

### D.1 Formulario de datos del pedido (en `/carrito`)
- [x] Nombre y teléfono.
- [x] Tipo de cliente (hogar/negocio) con nombre del negocio y RUC opcional.
- [x] Zona de entrega (calcula envío y tiempo), dirección y referencia.
- [x] Fecha y franja según días de reparto de la zona.
- [x] Forma de pago (efectivo con monto, Yape, Plin, transferencia).
- [x] Comprobante (boleta/factura).
- [x] Notas.
- [x] Guardar datos del cliente en el navegador para la próxima vez.

### D.2 Envío
- [x] Validación (mínimo, campos obligatorios).
- [x] Generar código en el navegador (`PED-YYMMDD-XXXX`).
- [x] Abrir WhatsApp con el mensaje redactado incluyendo el código.
- [x] Enviar en paralelo a la API sin esperar su respuesta.
- [x] Pantalla "Pedido enviado", código y botón "Abrir WhatsApp de nuevo".
- [x] Guardar como último pedido para repetir.

### D.3 Botones secundarios
- [x] Compartir carrito (enlace).
- [x] Vaciar carrito.

### D.4 Infraestructura
- [x] `NullOrderGateway` en desarrollo; `HttpOrderGateway`/`BeaconOrderGateway` en producción.
- [x] `CompositeOrderGateway` (prueba uno y cae al otro).
- [x] `TemplateMessageFormatter` con plantilla del negocio.

### D.5 Verificación
- [x] Playwright e2e: agregar producto, cambiar a Negocio, enviar pedido y verificar enlace de WhatsApp generado.
- [x] Si la API falla, el pedido igual sale por WhatsApp (sin error al cliente).
- [x] Pruebas de aplicación: `SubmitOrder` entrega WhatsApp aunque la API falle (ya existe).

**Criterio de salida D:** un cliente puede armar un pedido y enviarlo por WhatsApp con copia a la API, en menos de un minuto.

---

## Fase E — Páginas de contenido y SEO local

**Objetivo:** todas las páginas del mapa del sitio con SEO local.

### E.1 Páginas
- [x] Inicio completo (hero, selector, más pedido, categorías, beneficios, cómo funciona, horario, zonas, prueba social, FAQ, footer).
- [x] Páginas de categorías y subcategorías con texto breve, filtros y productos.
- [x] Zonas: lista con tiempo, costo, mínimo, días; mapa simple; página por zona con texto propio y productos más pedidos; texto para zonas sin cobertura.
- [x] Nosotros y contacto: quiénes somos, fotos reales, teléfono, WhatsApp, mapa, horarios, dirección.
- [x] Páginas por segmento (`/negocios`, `/negocios/{segmento}`) con texto, beneficios y productos típicos.

### E.2 SEO
- [x] Títulos y descripciones únicos por página.
- [x] FAQ con datos estructurados.
- [x] Páginas por zona, categoría y segmento con texto propio (no copiado).
- [ ] Carga rápida en celular.
- [x] `sitemap`, metadatos, datos estructurados (negocio local, producto).

### E.3 Verificación
- [x] Todas las páginas del mapa del sitio generadas.
- [ ] Lighthouse / carga en celular aceptable.
- [x] `pnpm build` OK.

**Criterio de salida E:** todas las páginas del mapa del sitio generadas, con SEO local implementado.

---

## Fase F — Cotización

 [x] `/cotizar`: formulario (nombre, teléfono, tipo de negocio, consumo aproximado, productos, zona, mensaje).
 [x] Al enviar: abre WhatsApp con mensaje redactado y envía copia a la API (`/api/cotizaciones`).
 [x] Generar código de cotización (`COT-YYMMDD-XXXX`).
 [x] `SubmitQuote` use case completo.

**Criterio de salida F:** cotización enviada por WhatsApp con copia a la API.

---

## Fase G — Funciones de comodidad (Fase 2 del idea)

 [x] Pedido rápido en tabla (`/negocios`): todos los productos en lista con campo de cantidad; alimenta el mismo carrito.
 [x] Calculadora de consumo: tipo y tamaño de negocio → lista de compra → botón carga en carrito.
 [x] Repetir último pedido en un toque.
 [x] Enlace de carrito compartible (carrito dentro del enlace, funciona en sitio estático).
 [x] Buscador instantáneo con sugerencias mientras se escribe (generado al publicar).
 [x] Imágenes para compartir (Open Graph) por producto y categoría.

**Criterio de salida G:** mayoristas pueden pedir en segundos y recomprar en un toque.

---

## Fase H — Pruebas y validación

 [x] Ejecutar todas las pruebas de dominio y aplicación (Vitest).
 [x] Ejecutar pruebas e2e (Playwright).
 [x] Validar datos del tenant con los esquemas (construcción falla si falta algo).
 [x] Ejecutar `check-boundaries` y corregir violaciones.
 [x] Ejecutar `validate-content` sobre los datos del tenant.
 [x] Verificar presupuesto de JavaScript: páginas informativas sin JS propio salvo carrito mínimo.
 [x] Verificar que no quedan archivos temporales/caches dentro del worktree.
 [x] Crear un segundo sitio de prueba (otro rubro, ej. ferretería) usando solo datos, tema y configuración; detectar y corregir fugas en el core.
 [x] Documentar en `docs/` las decisiones y fugas encontradas.

**Criterio de salida H:** todas las pruebas verdes, fronteras respetadas, segundo sitio funciona solo con datos.

---

## Checklist de verificación final

- [ ] El sitio vende: un cliente puede armar un pedido y enviarlo por WhatsApp con copia a la API.
- [ ] Todos los datos del primer cliente (agua y gaseosas) están cargados y validados.
- [ ] Las pruebas de dominio y aplicación pasan.
- [ ] Las pruebas de extremo a extremo pasan.
- [ ] Las reglas de importación se cumplen (herramienta de fronteras en verde).
- [ ] Un segundo sitio de otro rubro funciona solo con datos, tema y configuración.
- [ ] No hay código en este plan: todo fue instrucción para el agente.

---

## Notas para el agente

1. **Los datos viven en JSON separados por recurso**, simulando endpoints de API (`/api/categories`, `/api/products`, `/api/zones`, etc.). No en un solo objeto monolítico ni en archivos MD por entidad. Esto respeta el principio de responsabilidad única y refleja que en producción los datos vendrán de una API real.
2. El proyecto ya tiene la infraestructura preparada: `CatalogSource` port con métodos separados (`products()`, `categories()`, `zones()`), `mappers.ts` con `toCategory`, `toProduct`, `toZone` independientes, y `StaticCatalogSource` que recibe arrays separados. Solo falta cablear los JSONs y validarlos.
3. Trabajar por rebanadas completas: primero la rebanada del pedido (Fase D), luego contenido/SEO (Fase E), luego cotización (Fase F), luego comodidad (Fase G). Las fases A–C construyen la base.
4. Marcar checkboxes solo con evidencia observable.
5. Ante una decisión de producto no resuelta, preguntar al usuario una sola pregunta focalizada y esperar.
6. Registrar decisiones y descubrimientos en Engram al finalizar cada fase.
7. Cerrar cada cambio de código con `Risk: item N (motivo)` o `Risk: none`.