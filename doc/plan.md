# Plan por fases — Plantilla de distribuidora (Astro estático)

> Este documento es un **plan de ejecución para un agente**. No contiene código: solo instrucciones, restricciones, criterios de aceptación y verificaciones. El agente debe traducir cada tarea en implementación.
>
> **Momento de trabajo:** A. Construcción (un solo proyecto `aguas-pachacamac`, con `src/core/` y `src/tenant/` separados desde el primer día). La extracción a paquete npm es el Momento B y NO se ejecuta en este plan.
>
> **Objetivo final del Momento A:** un sitio real que vende (agua y gaseosas), con el pedido por WhatsApp + copia a la API funcionando, construido con arquitectura por capas y listo para extraerse sin reescribir.
>
> **Fuentes:** `doc/idea.md` (pantallas, reglas de negocio, modelo de datos) y `doc/plantilla.md` (estructura, capas, convenciones).

---

## Convenciones del plan

- Cada tarea es un checkbox `- [ ]`. Marcar solo cuando su **resultado observable** y su **verificación** se hayan completado.
- "Sin código" significa: el plan no incluye snippets. El agente decide la implementación siguiendo las restricciones.
- Idioma del código: **inglés** (clases, funciones, variables, archivos). Contenido visible al usuario: **español neutro**.
- Commits: Conventional Commits, en español o inglés consistente, en la rama de feature (no en la rama por defecto).
- Tamaño de work-unit: ~400 líneas cambiadas (adicionales + eliminadas, sin archivos generados) como heurística advisory. Si la solución correcta excede, explicar por qué y continuar.
- Cada cambio de código se cierra con una línea `Risk: item N (motivo)` o `Risk: none` (ver sección "High risk" en AGENTS.md).

## Restricciones globales (aplican a TODAS las fases)

### Arquitectura
1. `core` nunca importa de `tenant`, salvo por el módulo virtual de configuración. Esta regla es la que hace posible la extracción posterior.
2. Dirección de dependencias: `domain` no depende de nada externo; `application` depende de `domain`; `infrastructure` depende de `application` y `domain`; `composition` depende de todas; `presentation/ui` solo de tipos; `presentation/features` de `application` y `composition`; `presentation/pages` de `application` (consultas), `composition` y `presentation`.
3. Lo general (`core`) no conoce lo específico (`tenant`): ni marcas, ni zonas, ni textos de un cliente.
4. Lo específico (`tenant`) no contiene lógica: solo configuración, contenido, tema, imágenes y reemplazos.
5. La lógica no sabe cómo se ve: las reglas (precios, carrito, pedido) no importan Astro ni el DOM.
6. La vista no decide nada: los componentes visuales reciben datos y no calculan precios ni arman mensajes.
7. Cada clase tiene un solo motivo para cambiar (responsabilidad única).
8. Se agrega comportamiento con clases nuevas, sin tocar las existentes (abierto/cerrado).
9. Los contratos son pequeños y específicos (segregación de interfaces).

### Alcance (NO se implementa en este plan)
- Cuentas de cliente, login, historial.
- Páginas por pedido (`/pedido/{codigo}`), seguimiento de estados.
- Entregas recurrentes, suscripciones, recordatorios.
- Stock en tiempo real, saldo de envases visible al cliente.
- Blog, panel de administración dentro del sitio.
- Pasarela de pago con tarjeta.

### Contenido y datos
- Solo reseñas reales (no inventadas).
- Los datos del sitio viven en archivos dentro de `src/tenant/content/` (colecciones de Astro).
- Los esquemas de validación viven en `core/config/` y son el contrato entre general y específico.
- Si falta un campo o tiene formato incorrecto, la construcción falla con mensaje claro.

### JavaScript en el navegador
- La mayor parte de la web es HTML sin JS propio. Islas pequeñas cargadas solo donde se usan.
- Meta: páginas informativas sin JS propio salvo el carrito mínimo; cada isla extra solo donde se usa.
- El estado del carrito se comparte entre islas con una clase propia pequeña (`Store`), persistiendo en el navegador.

### Testing
- Pruebas más valiosas en `domain` y `application`: rápidas, protegen precios y pedido.
- Aplicar test-first cuando exista un test determinista runnable y resultado esperado claro: RED → GREEN → REFACTOR.
- Estado de prueba (directorios temporales, `HOME`, `TMPDIR`, caches) fuera del worktree, en `mktemp -d`. Dentro del worktree solo en rutas excluidas por git y eliminadas al terminar.

### Seguridad y datos
- No guardar datos de pago (no se cobra en línea).
- La API recalcula el total con su propia copia de precios; el navegador solo muestra.
- El envío a la API no bloquea la salida por WhatsApp.

---

## Fase 0 — Prueba técnica del paquete con Astro

**Objetivo:** confirmar que Astro permite todo lo que el diseño necesita, desde un paquete. Hacer esto ANTES de construir nada.

**Tareas:**
- [ ] Crear un paquete de juguete con dos componentes `.astro` y un archivo TypeScript.
- [ ] Verificar que un paquete puede entregar componentes `.astro` y archivos TypeScript sin compilar.
- [ ] Verificar que una integración puede registrar rutas (`injectRoute`) cuyas páginas viven en el paquete.
- [ ] Verificar que esas páginas pueden leer las colecciones de contenido del proyecto que las usa.
- [ ] Verificar que un módulo virtual puede entregarle al paquete la configuración del cliente.
- [ ] Verificar que el paquete se instala de forma local (`pnpm link` o `npm pack`) y funciona igual que desde el registro.
- [ ] Documentar cualquier ajuste necesario al diseño si algo falla.

**Criterio de salida:** un documento corto en `docs/` con el resultado de cada verificación (OK / ajuste requerido) y las decisiones tomadas.

---

## Fase 1 — Esqueleto del proyecto y herramientas

**Objetivo:** tener el proyecto `aguas-pachacamac` corriendo con la estructura de dos zonas (`src/core/`, `src/tenant/`) y las herramientas de verificación de fronteras.

**Tareas:**
- [ ] Inicializar proyecto Astro estático (SSG) con TypeScript estricto.
- [ ] Configurar `astro.config.mjs` para activar la integración local del core (aún vacía, se cablea en Fase 7).
- [ ] Crear alias de TypeScript: `@core` → `src/core`, `@tenant` → `src/tenant`.
- [ ] Crear estructura de carpetas `src/core/` con subcarpetas: `domain`, `application`, `infrastructure`, `composition`, `presentation`, `integration`, `config`.
- [ ] Crear estructura de carpetas `src/tenant/` con subcarpetas: `content`, `theme`, `assets`, `overrides`.
- [ ] Crear `src/content.config.ts` (conectado al paquete más adelante; por ahora placeholder que importará los esquemas del core).
- [ ] Crear `tests/` con subcarpetas `domain`, `application`, `e2e`.
- [ ] Crear `tools/` con placeholders: `create-site`, `validate-content`, `check-boundaries`, `export-catalog`.
- [ ] Configurar herramienta de análisis de dependencias para hacer cumplir las reglas de importación (sección 8 de plantilla.md) en cada cambio.
- [ ] Configurar Vitest para pruebas unitarias del core.
- [ ] Configurar Playwright para pruebas de extremo a extremo.
- [ ] Crear `.env.example` con las variables esperadas (URL de API, etc.).
- [ ] Crear `public/` con favicon, robots.txt y carpeta `og/`.
- [ ] Verificar que `astro build` y `astro dev` funcionan con el esqueleto vacío.

**Criterio de salida:** proyecto que compila y sirve una página vacía, con las carpetas y alias listos, y la herramienta de fronteras ejecutándose sin errores.

---

## Fase 2 — Dominio puro (`core/domain`)

**Objetivo:** implementar todas las reglas de negocio sin dependencias externas. Esta capa es el corazón; se prueba exhaustivamente.

**Tareas — shared:**
- [x] `Money`: valor monetario con suma, resta, multiplicación, formato (moneda PEN por defecto, configurable).
- [x] `Result`: resultado de operación (éxito o error con motivo).
- [x] `Identifiers`: tipos de ids (ProductId, PresentationId, ZoneId, CategoryId, BrandId, SegmentId).

**Tareas — catalog:**
- [x] `Product`: producto con sus presentaciones, atributos, etiquetas, disponibilidad, destacado, retornable.
- [x] `Presentation`: unidad, paquete, caja (nombre, unidades por presentación, sku, precios).
- [x] `PriceTier`: un tramo ("desde N unidades, este precio").
- [x] `PriceList`: lista minorista o mayorista (conjunto de tramos).
- [x] `Category`: categoría con padreId, orden, imagen, descripción, seo.
- [x] `CategoryTree`: árbol de categorías y subcategorías (hasta 3 niveles).

**Tareas — pricing:**
- [x] `PricingStrategy`: contrato de cómo se calcula un precio.
- [x] `TierPricingStrategy`: estrategia por tramos de volumen.
- [x] `PricingService`: aplica la estrategia y calcula ahorro al siguiente tramo.

**Tareas — cart:**
- [x] `Cart`: agrega líneas, cambia cantidades, quita, limpia.
- [x] `CartLine`: línea del carrito.
- [x] `CartPolicy`: límites (cantidad máxima por línea, líneas máximas).

**Tareas — delivery:**
- [x] `DeliveryZone`: zona con costo de envío, envío gratis desde, pedido mínimo, tiempo de entrega, días de reparto, franjas.
- [x] `ZonePolicy`: pedido mínimo, envío gratis, costo de envío por zona.
- [x] `DeliverySlot`: día y franja disponibles según días de reparto.

**Tareas — order:**
- [x] `Order`: pedido armado y validado.
- [x] `OrderLine`: línea del pedido (con nombre y precio del momento).
- [x] `Customer`: cliente (tipo, nombre, negocio, teléfono, documento).
- [x] `OrderCode`: código de pedido (ej. `PED-261102-K7F3`).
- [x] `OrderBuilder`: arma un pedido válido desde carrito, cliente y entrega; valida.

**Tareas — quote:**
- [x] `Quote`: cotización.
- [x] `QuoteBuilder`: arma una cotización válida.

**Tareas — business:**
- [x] `Business`: datos del negocio.
- [x] `BusinessHours`: responde "¿está abierto ahora?" y "¿entrega hoy?" según hora de corte y zona.

**Tareas — consumption:**
- [x] `ConsumptionCalculator`: sugiere lista de compra según tipo y tamaño de negocio.

**Tareas — pruebas del dominio:**
- [x] Pruebas unitarias de tramos de precio, ahorros, mínimo y envío gratis, armado de pedido, horarios.
- [x] Todas las pruebas del dominio pasan con adaptadores falsos (sin navegador).

**Criterio de salida:** capa de dominio completa, sin importaciones de Astro/DOM/navegador, con pruebas unitarias verdes.

---

## Fase 3 — Aplicación (`core/application`)

**Objetivo:** definir qué se puede hacer (casos de uso) y qué necesita del mundo exterior (contratos/puertos).

**Tareas — ports (contratos pequeños, uno por propósito):**
- [x] `CartStorage`: guardar y leer el carrito.
- [x] `CustomerPrefsStorage`: guardar datos del cliente y modo Hogar/Negocio.
- [x] `LastOrderStorage`: guardar y leer el último pedido.
- [x] `CatalogSource`: de dónde salen los productos y categorías.
- [x] `OrderGateway`: enviar un pedido a la API.
- [x] `QuoteGateway`: enviar una cotización a la API.
- [x] `MessageFormatter`: convertir un pedido o cotización en texto.
- [x] `MessageChannel`: generar el enlace de contacto (WhatsApp).
- [x] `CartCodec`: convertir el carrito en enlace y viceversa.
- [x] `Clock`: hora actual (para probar con horas falsas).
- [x] `CodeGenerator`: generar códigos de pedido.
- [x] `Analytics`: registrar eventos.

**Tareas — use cases:**
- [x] `AddToCart`, `ChangeQuantity`, `RemoveFromCart`, `ClearCart`.
- [x] `SwitchPricingMode`: cambiar entre Hogar y Negocio.
- [x] `PreviewCartTotals`: totales, ahorro y faltantes (mínimo, envío gratis).
- [x] `SubmitOrder`: validar, generar código, preparar WhatsApp y avisar a la API (WhatsApp primero, API en paralelo sin esperar).
- [x] `SubmitQuote`.
- [x] `RepeatLastOrder`.
- [x] `ShareCart`: generar el enlace del carrito.
- [x] `LoadSharedCart`: cargar un carrito desde un enlace.
- [x] `SuggestConsumption`.
- [x] `CheckBusinessOpen`.

**Tareas — queries:**
- [x] `CatalogQuery`: filtrar, ordenar y buscar productos en el navegador.
- [x] `RelatedProducts`: complementarios y alternativas.

**Tareas — dto:**
- [x] Formas de datos que cruzan capas (definir según necesidad de las vistas).

**Tareas — pruebas de aplicación:**
- [x] Pruebas con adaptadores falsos: `SubmitOrder` entrega WhatsApp aunque la API falle.
- [x] Verificar que ningún caso de uso importa infraestructura concreta.

**Criterio de salida:** casos de uso y contratos completos, con pruebas verdes, sin dependencias de infraestructura.

---

## Fase 4 — Infraestructura (`core/infrastructure`)

**Objetivo:** implementar los adaptadores que cumplen los contratos (navegador, red, WhatsApp, datos estáticos).

**Tareas — storage:**
- [x] `LocalStorageCartStorage`, `LocalStorageCustomerPrefs`, `LocalStorageLastOrder`.
- [x] `MemoryCartStorage` (para pruebas).
- [x] `UrlCartCodec` (carrito dentro del enlace).

**Tareas — gateways:**
- [x] `HttpOrderGateway`: envío normal a la API.
- [x] `BeaconOrderGateway`: envío que sobrevive aunque se cierre la pestaña.
- [x] `CompositeOrderGateway`: prueba uno y cae al otro.
- [x] `NullOrderGateway`: no envía nada (desarrollo, pruebas).
- [x] `HttpQuoteGateway`.

**Tareas — messaging:**
- [x] `WhatsAppMessageChannel`: construye el enlace `wa.me`.
- [x] `TemplateMessageFormatter`: rellena la plantilla de mensaje del cliente.
- [x] Plantillas por defecto del core en `templates/`.

**Tareas — catalog:**
- [x] `StaticCatalogSource`: lee los datos publicados (colecciones de Astro).
- [x] Mappers: convierten datos crudos en clases del dominio.

**Tareas — analytics:**
- [x] `PlausibleAnalytics`, `Ga4Analytics`, `NoopAnalytics`.

**Tareas — time e ids:**
- [x] `SystemClock`.
- [x] `RandomCodeGenerator`.

**Tareas — pruebas de infraestructura:**
- [x] Pruebas de integración ligera: enlace de WhatsApp, carrito dentro del enlace.

**Criterio de salida:** todos los adaptadores implementados y con pruebas de integración verdes.

---

## Fase 5 — Composición y estado compartido (`core/composition`)

**Objetivo:** un único lugar donde se ensamblan los adaptadores según la configuración del cliente, más el estado compartido entre elementos de la página.

**Tareas:**
- [x] `buildContainer.ts`: crea todas las piezas desde la configuración del cliente (si no usa API, entrega `NullOrderGateway`; si usa Plausible, entrega `PlausibleAnalytics`; etc.).
- [x] `containerContext.ts`: cómo los controladores obtienen el contenedor.
- [x] `Store.ts`: clase base que guarda un valor y avisa a quien se suscribe (apoyada en eventos nativos del navegador).
- [x] `CartStore.ts`: estado del carrito, envuelve casos de uso.
- [x] `PricingModeStore.ts`: modo Hogar / Negocio.
- [x] Garantizar una sola instancia por página, compartida por todos los controladores; persistencia entre páginas vía almacenamiento del navegador.

**Criterio de salida:** contenedor funcional que puede construirse con una configuración de cliente de ejemplo, y stores que notifican cambios.

---

## Fase 6 — Presentación: fundamentos (`core/presentation`)

**Objetivo:** estilos base, átomos, moléculas, organismos, secciones, layouts y páginas (sin lógica de negocio en las vistas).

### 6.1 Estilos
- [x] `reset.css`, `tokens.base.css` (valores por defecto de variables; el tema del cliente las sobrescribe), `base.css`, `utilities.css`.
- [x] Garantizar que el core usa solo variables de CSS para tema (sin colores hardcodeados).

### 6.2 UI atómica (solo vista, sin lógica)
- [x] Átomos: `Button`, `Icon`, `Badge`, `Heading`, `Text`, `Link`, `Image`, `Input`, `Select`, `Textarea`, `Label`, `Price`, `Divider`.
- [x] Moléculas: `FormField`, `QuantityStepper` (vista), `PriceWithTier`, `SearchBox`, `ProductMeta`, `Breadcrumbs`, `ZoneBadge`, `ProgressBar`, `WhatsAppButton`.
- [x] Organismos: `Header`, `Footer`, `MobileDock`, `ProductCard`, `ProductGrid`, `ProductTable`, `CategoryNav`, `CategoryCard`, `PriceTierTable`, `ZoneList`, `SegmentCard`, `ReviewList`, `FaqList`, `CartSummary`.

### 6.3 Secciones y layouts
- [x] Secciones: `HeroSection`, `ModeSelectorSection`, `FeaturedProductsSection`, `CategoriesSection`, `BenefitsSection`, `HowItWorksSection`, `ZonesSection`, `ReviewsSection`, `FaqSection`.
- [x] Layouts: `BaseLayout`, `CatalogLayout`, `ProductLayout`, `ContentLayout`, `CheckoutLayout`.

### 6.4 Páginas (módulos de página)
- [x] `HomePage`, `CatalogPage`, `CategoryPage`, `SubcategoryPage`, `ProductPage`, `CartPage`, `BusinessPage`, `SegmentPage`, `QuotePage`, `ZonesPage`, `ZonePage`, `AboutPage`, `ContactPage`, `NotFoundPage`.

### 6.5 SEO
- [x] Metadatos, datos estructurados (negocio local, producto), sitemap.

**Regla:** toda vista dumb se puede mostrar con datos inventados y revisarse sin cargar nada del negocio. Una vista no importa casos de uso ni infraestructura.

**Criterio de salida:** biblioteca de componentes completa, renderizable con datos de ejemplo, sin lógica de negocio en las vistas.

---

## Fase 7 — Funciones interactivas (`core/presentation/features`)

**Objetivo:** implementar las funciones interactivas con el patrón vista dumb + controlador smart (elemento personalizado) + presentador.

**Tareas — estructura por feature:**
Cada feature tiene: `*.astro` (vista dumb con moldes `<template>`), `*Element.ts` (controlador smart, clase que extiende `HTMLElement`), `*Presenter.ts` (presentador), `*.css`, `index.ts` (registra el elemento personalizado).

- [x] `cart/`: panel, línea, totales, controlador, presentador.
- [x] `checkout/`: formulario, validación, mensaje de WhatsApp, envío a la API.
- [x] `catalog-filters/`: filtros y orden en el navegador.
- [x] `pricing-mode/`: interruptor Hogar / Negocio.
- [x] `quick-order/`: pedido rápido en tabla (mayoristas).
- [x] `consumption-calculator/`: calculadora de consumo por tipo y tamaño de negocio.
- [x] `quote/`: formulario de cotización y envío.
- [x] `business-hours/`: indicador "Abierto ahora".

**Tareas — principios a respetar:**
- [x] Las listas que cambian en el navegador usan `<template>`: Astro dibuja el molde, el controlador clona por cada línea y rellena datos. No hay HTML escrito dentro del TypeScript.
- [x] Cada función carga su código solo donde se usa (etiqueta `<script>` dentro del componente `.astro`).
- [x] El estado del carrito y el contador de la cabecera son lo único que va en todas las páginas, mantenido lo más pequeño posible.
- [x] Los elementos personalizados se activan solos cuando aparecen en la página (compatible con transiciones entre páginas).

**Tareas — pruebas de presentación:**
- [x] Pruebas de presentadores: que devuelvan los textos correctos.
- [x] Pruebas de controladores: que reaccionen a eventos (entorno de navegador simulado).

**Criterio de salida:** todas las funciones interactivas implementadas con el patrón smart/dumb/presenter, con pruebas verdes.

---

## Fase 8 — Integración con Astro (`core/integration`)

**Objetivo:** que el core se active dentro de un sitio Astro sin que el sitio tenga páginas escritas a mano.

**Tareas:**
- [x] `index.ts`: integración de Astro que activa el core en un sitio.
- [x] `injectRoutes.ts`: registra las páginas del core como rutas.
- [x] `tenantVirtualModule.ts`: entrega la configuración validada del cliente al core (módulo virtual con nombre fijo).
- [x] `bundlerSettings.ts`: ajustes para que Astro procese los archivos `.astro` y `.ts` del paquete.
- [x] `routeTable.ts`: tabla de rutas y qué página del core atiende cada una (según mapa del sitio de idea.md).

**Criterio de salida:** un sitio Astro mínimo que usa la integración del core muestra las rutas del mapa del sitio, leyendo la configuración del cliente vía módulo virtual.

---

## Fase 9 — Configuración y esquemas (`core/config`)

**Objetivo:** validar todo lo específico de cada cliente al construir, con mensajes claros.

**Tareas:**
- [x] `tenantSchema.ts`: esquema de `tenant.config.ts` (identidad, contacto, horario, pagos, API, funcionalidades, analítica, SEO).
- [x] `featuresSchema.ts`: funcionalidades activables.
- [x] `themeSchema.ts`: variables de tema obligatorias.
- [x] `contentSchemas/`: esquemas de cada colección — `category.ts`, `brand.ts`, `product.ts`, `zone.ts`, `segment.ts`, `review.ts`, `faq.ts` y páginas.

**Criterio de salida:** los esquemas validan los datos al construir; un dato faltante o mal formado hace fallar la construcción con mensaje claro.

---

## Fase 10 — API pública del core (`core/index.ts`)

**Objetivo:** definir qué puede importar un sitio del core.

**Tareas:**
- [x] Exportar la integración (para `astro.config`).
- [x] Exportar la función que arma las colecciones de contenido.
- [x] Exportar los tipos y esquemas de configuración.
- [x] Exportar utilidades de tema (tipos para el registro de reemplazos).
- [x] Verificar que un sitio no importa archivos internos del core, solo su API pública.

**Criterio de salida:** API pública mínima y documentada; el sitio solo usa esa superficie.

---

## Fase 11 — Tenant: primer cliente (`aguas-pachacamac`)

**Objetivo:** cargar los datos reales del primer cliente (agua y gaseosas) en `src/tenant/`.

**Tareas — configuración:**
- [x] Completar `tenant.config.ts`: identidad, contacto, horario, hora de corte, pagos, comprobantes, API, plantilla de mensaje, analítica, SEO, funcionalidades activas.

**Tareas — contenido:**
- [x] Categorías y subcategorías (árbol de hasta 3 niveles: Agua, Gaseosas, Energizantes, Jugos y néctares, Ofertas y packs).
- [x] Marcas reales.
- [x] Productos con presentaciones y precios por tramos (minorista/mayorista), atributos, retornable, disponible, destacado, complementarios, alternativas.
- [x] Bidones retornables con depósito y canje.
- [x] Zonas de reparto con costo de envío, envío gratis desde, pedido mínimo, tiempo de entrega, días de reparto, franjas, SEO por zona.
- [x] Segmentos de negocio (bodegas, restaurantes, oficinas, eventos) con productos sugeridos y calculadora de consumo.
- [x] Reseñas reales (solo reales; ocultar sección si no hay).
- [x] FAQ.
- [x] Textos de nosotros, contacto, políticas.

**Tareas — tema y assets:**
- [x] `theme/tokens.css` con colores, tipografías, radios, espacios del cliente.
- [x] Logo e imágenes de productos, almacén y reparto en `assets/`.

**Tareas — overrides:**
- [x] `overrides/registry.ts` solo si el cliente necesita algo realmente distinto (por defecto vacío).

**Tareas — colecciones:**
- [x] `src/content.config.ts` importa del core la función que devuelve todas las colecciones con esquemas; el sitio solo decide la carpeta de sus datos.

**Criterio de salida:** datos validados al construir, sitio con catálogo real y páginas generadas.

---

## Fase 12 — Rebanada del pedido (flujo de venta completo)

**Objetivo:** la rebanada que genera ventas: catálogo con datos reales → agregar al carrito → enviar por WhatsApp (+ copia a la API).

**Tareas:**
- [x] Catálogo con filtros (categoría, subcategoría, marca, tamaño, tipo de envase, solo disponibles), orden (más pedidos, precio, nombre), vista cuadrícula y tabla.
- [x] Interruptor Hogar / Negocio visible arriba que cambia precio y formato.
- [x] Tarjeta de producto: imagen, nombre, presentación, precio, etiqueta, selector de cantidad, botón Agregar.
- [x] Aviso de tramo: "Lleva 5 y paga S/ 19.00 c/u".
- [x] Ficha de producto: galería, selector de presentación (unidad/paquete/caja con precio y cantidad), tabla de precios por volumen, aviso de envase retornable, descripción, botones Agregar y Pedir por WhatsApp (mensaje directo con solo ese producto), complementarios, alternativas, marca "No disponible".
- [x] Carrito (panel lateral + página `/carrito`): líneas con selector de cantidad, precio unitario aplicado, subtotal, quitar; precio por tramos en vivo; barra de pedido mínimo; barra de envío gratis; sugerencias; resumen (subtotal, descuento por volumen, envío, total).
- [x] Formulario de datos del pedido en `/carrito`: nombre y teléfono; tipo de cliente (hogar/negocio) con nombre del negocio y RUC opcional; zona de entrega (calcula envío y tiempo), dirección y referencia; fecha y franja según días de reparto; forma de pago (efectivo con monto, Yape, Plin, transferencia); comprobante (boleta/factura); notas; guardar datos del cliente en el navegador.
- [x] Envío del pedido: validar (mínimo, campos obligatorios); generar código en el navegador (ej. `PED-261102-K7F3`); abrir WhatsApp con el mensaje redactado incluyendo el código; enviar en paralelo a la API sin esperar su respuesta; mostrar "Pedido enviado", código y botón "Abrir WhatsApp de nuevo"; guardar como último pedido para repetir.
- [x] Botones secundarios: Compartir carrito (enlace) y Vaciar carrito.
- [x] Barra superior fija (logo, menú, buscador, botón carrito con contador, botón WhatsApp) y botón WhatsApp flotante en escritorio + barra inferior con resumen del carrito en celular.
- [x] Indicador de horario en inicio y contacto: "Abierto ahora, entrega hoy hasta las 19:00" o "Cerrado, te respondemos mañana desde las 7:00" (calculado en el navegador).

**Verificación:**
- [x] Prueba de extremo a extremo (Playwright): agregar producto, cambiar a modo Negocio, enviar pedido y verificar el enlace de WhatsApp generado.

**Criterio de salida:** un cliente puede armar un pedido y enviarlo por WhatsApp con la copia a la API en paralelo, en menos de un minuto.

---

## Fase 13 — Páginas de contenido y SEO local

**Objetivo:** páginas informativas y de posicionamiento local.

**Tareas:**
- [x] Inicio completo (hero con palabra clave y zona, selector "¿Cómo compras?", lo más pedido, categorías, beneficios, cómo funciona, indicador de horario, zonas de reparto, prueba social oculta si no hay, FAQ, pie de página).
- [x] Páginas de categorías y subcategorías con texto breve, filtros y productos.
- [x] Zonas de reparto: lista con tiempo de entrega, costo, mínimo y días; mapa simple (imagen o enlace, sin librerías pesadas); página por zona con texto propio y productos más pedidos; texto para zonas sin cobertura.
- [x] Nosotros y contacto: quiénes somos, fotos reales, teléfono, WhatsApp, mapa, horarios, dirección.
- [x] Páginas por segmento de negocio (`/negocios`, `/negocios/{segmento}`) con texto, beneficios y productos típicos.
- [x] SEO: títulos y descripciones únicos por página; FAQ con datos estructurados; páginas por zona, categoría y segmento con texto propio (no copiado entre páginas); carga rápida en celular.
- [x] Página 404 con enlaces útiles.

**Criterio de salida:** todas las páginas del mapa del sitio generadas, con SEO local implementado.

---

## Fase 14 — Cotización

**Objetivo:** formulario de cotización que funciona igual que el pedido (WhatsApp + API).

**Tareas:**
- [x] `/cotizar`: formulario con nombre, teléfono, tipo de negocio, consumo aproximado, productos que necesita, zona y mensaje.
- [x] Al enviar: abre WhatsApp con el mensaje redactado y envía copia a la API (endpoint `/api/cotizaciones`).
- [x] Generar código de cotización (ej. `COT-261102-A9X2`).

**Criterio de salida:** cotización enviada por WhatsApp con copia a la API.

---

## Fase 15 — Funciones de comodidad (Fase 2 del idea.md)

**Objetivo:** funciones que facilitan recompra y atención a mayoristas.

**Tareas:**
- [x] Pedido rápido en tabla (`/negocios`): todos los productos en una lista con campo de cantidad cada uno; se llena en segundos y alimenta el mismo carrito.
- [x] Calculadora de consumo: el cliente indica tipo y tamaño de negocio y la web propone una lista de compra; con un botón la carga en el carrito.
- [x] Repetir último pedido en un toque (si ya compró antes desde ese navegador).
- [x] Enlace de carrito compartible: el carrito va dentro del propio enlace (funciona en sitio estático).
- [x] Buscador instantáneo con sugerencias mientras se escribe (generado al publicar, sin servidor).
- [x] Imágenes para compartir (Open Graph) por producto y categoría.

**Criterio de salida:** mayoristas pueden pedir en segundos y recomprar en un toque.

---

## Fase 16 — Pruebas, validación y pulido

**Objetivo:** asegurar calidad y que la plantilla es realmente general.

**Tareas:**
- [x] Ejecutar todas las pruebas de dominio y aplicación (Vitest).
- [x] Ejecutar pruebas de extremo a extremo (Playwright).
- [x] Validar datos del tenant con los esquemas (construcción falla si falta algo).
- [x] Ejecutar la herramienta `check-boundaries` y corregir violaciones de importación.
- [x] Ejecutar `validate-content` sobre los datos del tenant.
- [x] Verificar presupuesto de JavaScript: páginas informativas sin JS propio salvo carrito mínimo.
- [x] Verificar que no quedan archivos temporales/caches dentro del worktree.
- [x] Crear un segundo sitio de prueba (otro rubro, ej. ferretería) usando solo datos, tema y configuración; detectar y corregir fugas en el core (todo lo que obligue a tocar el core es una fuga).
- [x] Documentar en `docs/` las decisiones y fugas encontradas.

**Criterio de salida:** todas las pruebas verdes, fronteras respetadas, segundo sitio funciona solo con datos.

---

## Fase 17 — Preparación para extracción (fin del Momento A)

**Objetivo:** dejar el proyecto listo para el Momento B (extracción a paquete) sin cambiar comportamiento.

**Tareas:**
- [x] Verificar que `src/core/` no importa nada de `src/tenant/` (salvo módulo virtual).
- [x] Verificar que `src/tenant/` no contiene lógica.
- [x] Documentar en `docs/` el mapeo de carpetas core → futuro `packages/core/`.
- [x] Asegurar que todas las pruebas pasan y la construcción es reproducible.
- [x] Registrar en memoria (Engram) las decisiones clave del Momento A.

**Criterio de salida:** proyecto con fronteras limpias, documentado y listo para extraerse.

---

## Checklist de verificación final (Momento A completo)

- [ ] El sitio vende: un cliente puede armar un pedido y enviarlo por WhatsApp con copia a la API.
- [ ] Todos los datos del primer cliente (agua y gaseosas) están cargados y validados.
- [x] Las pruebas de dominio y aplicación pasan.
- [ ] Las pruebas de extremo a extremo pasan.
- [x] Las reglas de importación se cumplen (herramienta de fronteras en verde).
- [ ] Un segundo sitio de otro rubro funciona solo con datos, tema y configuración.
- [ ] No hay código en este plan: todo fue instrucción para el agente.

---

## Notas para el agente ejecutor

1. **No escribir código en este documento.** Es un plan de instrucciones. La implementación la decide el agente siguiendo las restricciones.
2. **Trabajar por rebanadas completas**, no capa por capa: primero la rebanada del pedido (Fase 12), luego contenido/SEO (Fase 13), luego cotización (Fase 14), luego comodidad (Fase 15). Las fases 2–10 construyen la base que hace posible esas rebanadas.
3. **Marcar checkboxes solo con evidencia observable** (prueba verde, construcción exitosa, frontera respetada).
4. **Ante una decisión de producto no resuelta**, preguntar al usuario una sola pregunta focalizada y esperar.
5. **Registrar decisiones y descubrimientos en Engram** (`mem_save`) al finalizar cada fase o ante un hallazgo relevante.
6. **Cerrar cada cambio de código con `Risk: item N (motivo)` o `Risk: none`**, verificando si el diff toca código que otro comportamiento existente también usa.