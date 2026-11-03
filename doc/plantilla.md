# Estructura de archivos: plantilla de distribuidora en Astro puro

Plantilla reutilizable para vender por mayor y menor, hecha con **Astro estático (SSG) y sin ningún framework de interfaz** (ni Preact, ni React). La interactividad se hace con TypeScript, clases y elementos personalizados del navegador (custom elements).

Complementa a `estructura-distribuidora.md` (pantallas, reglas de negocio y modelo de datos). Aquí se define **dónde vive cada cosa, en qué orden se construye y cómo se llega a un paquete en npm**.

---

## 1. Aclaración importante: qué es "la plantilla" y qué es "el sitio"

Tu idea es correcta para el punto de partida: **`aguas-pachacamac` empieza siendo un proyecto de Astro completo, con la lógica adentro**, y de ahí se saca la plantilla. En la versión anterior mostré directamente la estructura final (paquete + sitios) sin explicar el camino, y por eso se veía inconsistente.

Hay tres momentos distintos:

| Momento | Qué existe | Dónde está la lógica |
|---|---|---|
| **A. Construcción** | Un solo proyecto de Astro (`aguas-pachacamac`) | Dentro del mismo proyecto, en `src/core/`, separada de `src/tenant/` |
| **B. Extracción** | El mismo proyecto, con `src/core/` movido a un paquete local | En el paquete (`packages/core`), el sitio lo consume |
| **C. Publicación** | El paquete está en npm y el sitio lo instala | En `node_modules`, versionada |

La lógica **sí está dentro del proyecto al inicio**, pero **separada por carpetas desde el primer día**. Esa separación es lo que hace que sacar el paquete sea mover una carpeta y no reescribir el sitio.

### Dos formas de distribuir una plantilla de Astro

| | Plantilla de arranque (starter) | Paquete en npm (integración) |
|---|---|---|
| Cómo se usa | `npm create astro -- --template usuario/repo` copia todo el código al proyecto nuevo | `npm install @tu-scope/distribuidora` y el sitio lo usa como dependencia |
| Dónde queda la lógica | **Copiada** en cada proyecto | En `node_modules`, **no se toca** |
| Actualizaciones | No llegan: cada proyecto diverge | Se actualizan subiendo la versión |
| Corregir un error | Hay que repetirlo en cada cliente | Se corrige una vez y se publica |
| Personalización | Se edita el código directamente | Datos, tema y reemplazos |

**Recomendación:** paquete en npm **más** un pequeño proyecto base (starter) que ya lo trae instalado. El starter es lo que alguien copia para empezar; la lógica vive en el paquete y se actualiza. Es lo que se describe en este documento.

---

## 2. Camino de trabajo: por dónde empezar

Se empieza por el **sitio concreto** y se extrae la plantilla después. Orden recomendado:

### Paso 0: prueba técnica corta (medio día a un día)

Antes de construir nada, comprobar que Astro permite lo que necesitamos desde un paquete. Con un paquete de juguete (dos componentes y una ruta) verificar:

1. Un paquete puede entregar componentes `.astro` y archivos TypeScript sin compilar.
2. Una integración puede registrar rutas (`injectRoute`) cuyas páginas viven en el paquete.
3. Esas páginas pueden leer las colecciones de contenido del proyecto que las usa.
4. Un módulo virtual puede entregarle al paquete la configuración del cliente.
5. El paquete se instala de forma local (`pnpm link` o `npm pack`) y funciona igual que desde el registro.

Si algo falla, se ajusta el diseño ahora, no con el sitio terminado.

### Paso 1: construir `aguas-pachacamac` con la separación ya hecha

Un solo proyecto de Astro, pero con dos zonas bien separadas:

- `src/core/`: lo general. Aquí se escribe toda la lógica y los componentes.
- `src/tenant/`: lo específico. Configuración, contenido, tema, imágenes.

Las reglas de importación (sección 8) se hacen cumplir desde el primer día con una herramienta de análisis. Así `core` nunca "se entera" de que existe `tenant`.

Se construye **por rebanadas completas** (de la vista hasta el pedido), no capa por capa:

1. Rebanada del pedido: catálogo con datos reales → agregar al carrito → enviar por WhatsApp. Es lo que genera ventas.
2. Páginas de contenido y SEO local: categorías, zonas, segmentos.
3. Cotización.
4. Funciones de comodidad: pedido rápido en tabla, calculadora, repetir pedido, enlace de carrito, buscador.

### Paso 2: extraer el paquete (sin cambiar el comportamiento)

1. Pasar a un repositorio con espacios de trabajo (pnpm workspaces).
2. Mover `src/core/` a `packages/core/` y darle su `package.json`.
3. El sitio pasa a depender de `@tu-scope/distribuidora` (en local, por workspace).
4. Verificar que las pruebas y la construcción del sitio dan exactamente el mismo resultado.

Si en el paso 1 se respetaron las fronteras, este paso es mecánico.

### Paso 3: probar que es realmente general

La plantilla solo es general si funciona con **otro** cliente. Crear un segundo sitio (puede ser de otro rubro: ferretería, abarrotes) usando solo datos, tema y configuración. Todo lo que obligue a tocar el `core` es una fuga: se arregla en el paquete.

### Paso 4: publicar en npm

1. Definir qué se exporta (sección 6).
2. Añadir el proyecto base (starter).
3. Publicar en versión `0.x` mientras se estabiliza, con registro de cambios.
4. Desde ahí, versionado semántico: arreglos (parche), funciones nuevas (menor), cambios que rompen (mayor).

---

## 3. Estructura del repositorio según el momento

### Momento A: un solo proyecto (construcción)

```
aguas-pachacamac/
├── package.json
├── astro.config.mjs               Activa la integración local del core
├── tsconfig.json                  Alias: @core, @tenant
├── .env.example
├── public/
│   ├── favicon.svg
│   ├── robots.txt
│   └── og/
├── src/
│   ├── core/                      GENERAL: se convertirá en el paquete
│   ├── tenant/                    ESPECÍFICO: datos de este cliente
│   └── content.config.ts          Colecciones de contenido (ver sección 5.3)
├── tests/
├── tools/
└── docs/
```

No hay carpeta `src/pages/` con páginas escritas a mano: la integración del core registra las rutas desde el primer día. Así, al extraer el paquete, nada cambia.

### Momento B: repositorio del autor de la plantilla (después de extraer)

```
plantilla-distribuidora/
├── packages/
│   ├── core/                      Se publica en npm: @tu-scope/distribuidora
│   └── create/                    (opcional) Comando "npm create" que copia el starter
├── starter/                       Proyecto base vacío que usan los clientes
├── examples/
│   └── aguas-pachacamac/          Tu primer cliente, como ejemplo y banco de pruebas
├── tools/
├── docs/
├── package.json
└── pnpm-workspace.yaml
```

### Momento C: proyecto de un cliente (consume el paquete desde npm)

Aquí está la respuesta a "no veo la carpeta del paquete": **no está dentro del proyecto, está en `node_modules`**, como cualquier dependencia.

```
aguas-pachacamac/                  Proyecto del cliente (repositorio propio)
├── package.json                   Depende de @tu-scope/distribuidora
├── astro.config.mjs               Usa la integración del paquete
├── .env.example
├── public/
├── src/
│   ├── tenant/                    Igual que en el momento A
│   └── content.config.ts          Importa los esquemas del paquete
└── node_modules/
    └── @tu-scope/distribuidora/   LA PLANTILLA (lógica, componentes, páginas)
```

`src/tenant/` es idéntico en los tres momentos. Lo único que cambia es dónde vive `core`.

---

## 4. Reglas de oro

1. **Lo general no conoce lo específico.** El `core` nunca menciona a un cliente, una marca ni una zona concreta. Todo eso entra como datos.
2. **Lo específico no contiene lógica.** `tenant/` solo tiene configuración, contenido, tema y, si hace falta, reemplazos de componentes.
3. **La lógica no sabe cómo se ve.** Las reglas (precios, carrito, pedido) no importan Astro ni el DOM.
4. **La vista no decide nada.** Los componentes visuales reciben datos y no calculan precios ni arman mensajes.
5. **Las dependencias apuntan hacia adentro:** presentación depende de aplicación, aplicación depende de dominio. Nunca al revés.
6. **Si el cambio le sirve al siguiente cliente, va a `core`. Si es solo de este cliente, va a `tenant`.**

---

## 5. Lo específico: `src/tenant/`

Todo lo que cambia entre distribuidoras vive aquí. Es **solo datos y presentación propia**.

```
src/tenant/
├── tenant.config.ts               Identidad, contacto, horario, pagos, API, funcionalidades activas
├── content/
│   ├── categorias/                Un archivo por categoría (árbol con padreId)
│   ├── marcas/
│   ├── productos/                 Un archivo por producto
│   ├── zonas/                     Zonas de reparto
│   ├── segmentos/                 Bodegas, restaurantes, oficinas, eventos
│   ├── resenas/                   Reseñas reales
│   ├── faq/                       Preguntas frecuentes
│   └── paginas/                   Textos de nosotros, contacto, políticas
├── theme/
│   ├── tokens.css                 Colores, tipografías, radios, espacios del cliente
│   └── fonts/
├── assets/
│   ├── logo.svg
│   └── imagenes/                  Productos, almacén y reparto
└── overrides/
    ├── registry.ts                Qué componentes del core se reemplazan en este cliente
    └── (componentes propios)      Solo si el cliente necesita algo realmente distinto
```

### 5.1 Qué contiene `tenant.config.ts`

No es lógica, es una declaración de datos:

| Grupo | Ejemplos |
|---|---|
| Identidad | Nombre, eslogan, logo, ciudad, dominio |
| Contacto | WhatsApp, teléfono, correo, dirección, mapa |
| Horario | Días y horas de atención, hora de corte del mismo día |
| Comercio | Moneda, pedido mínimo general, métodos de pago, comprobantes aceptados |
| Mensajes | Plantilla del mensaje de pedido y de cotización |
| API | URL de la API de pedidos y cotizaciones |
| Funcionalidades | Cuáles están activas: cotización, pedido rápido, calculadora, buscador |
| Analítica | Herramienta y eventos activos |
| SEO | Ciudad base, zonas de servicio, textos por defecto |

Se valida al construir. Si falta un campo o tiene un formato incorrecto, **la publicación falla** con un mensaje claro.

### 5.2 Cómo se personaliza sin tocar el core

1. **Datos y textos** (lo normal): categorías, productos, zonas, copys.
2. **Tema** (`tokens.css`): el core usa solo variables de CSS, así que cambiar el tema cambia toda la web.
3. **Reemplazo de componentes** (`overrides/registry.ts`): el cliente declara que, por ejemplo, su portada usa otra variante. El core busca primero en el registro del cliente y, si no hay reemplazo, usa el suyo.

### 5.3 El archivo `src/content.config.ts`

Las colecciones de contenido de Astro **se declaran en el proyecto que las usa**, no pueden venir de un paquete. Por eso este archivo vive en el sitio, pero es de una sola línea de trabajo real:

- Importa del `core` una función que devuelve todas las colecciones ya definidas con sus esquemas.
- El sitio solo decide la carpeta donde están sus datos.

Así el contrato de datos (los esquemas) sigue siendo del `core`, y el sitio no puede declarar datos con formato incorrecto.

---

## 6. Lo general: `src/core/` (luego, el paquete)

```
src/core/
├── domain/                        LÓGICA PURA (sin Astro, sin DOM, sin navegador)
├── application/                   CASOS DE USO y contratos (puertos)
├── infrastructure/                ADAPTADORES (navegador, red, WhatsApp, datos estáticos)
├── composition/                   Ensamblado: conecta contratos con adaptadores
├── presentation/                  VISTA (componentes, controladores, layouts, páginas, estilos)
├── integration/                   Integración de Astro (rutas, módulo virtual, ajustes)
├── config/                        Esquemas que validan lo específico de cada cliente
└── index.ts                       API pública
```

Tests del core:

```
tests/
├── domain/                        Pruebas unitarias de reglas
├── application/                   Pruebas de casos de uso con adaptadores falsos
└── e2e/                           Flujo completo: agregar, enviar, enlace de WhatsApp
```

### 6.1 `domain/`: las reglas del negocio

Clases y objetos de valor que representan el negocio. No saben que existe una web.

```
domain/
├── shared/
│   ├── Money.ts                   Valor monetario (suma, resta, multiplicación, formato)
│   ├── Result.ts                  Resultado de una operación (éxito o error con motivo)
│   └── Identifiers.ts             Tipos de ids (ProductId, PresentationId, ZoneId...)
├── catalog/
│   ├── Product.ts                 Producto con sus presentaciones
│   ├── Presentation.ts            Unidad, paquete, caja
│   ├── PriceTier.ts               Un tramo: "desde N unidades, este precio"
│   ├── PriceList.ts               Lista minorista o mayorista
│   ├── Category.ts
│   └── CategoryTree.ts            Árbol de categorías y subcategorías
├── pricing/
│   ├── PricingStrategy.ts         Contrato: cómo se calcula un precio
│   ├── TierPricingStrategy.ts     Estrategia por tramos de volumen
│   └── PricingService.ts          Aplica la estrategia y calcula ahorros al siguiente tramo
├── cart/
│   ├── Cart.ts                    Carrito: agrega, cambia cantidades, quita
│   ├── CartLine.ts
│   └── CartPolicy.ts              Límites: cantidad máxima por línea, líneas máximas
├── delivery/
│   ├── DeliveryZone.ts
│   ├── ZonePolicy.ts              Pedido mínimo, envío gratis, costo de envío por zona
│   └── DeliverySlot.ts            Día y franja disponibles según días de reparto
├── order/
│   ├── Order.ts                   Pedido ya armado y validado
│   ├── OrderLine.ts
│   ├── Customer.ts
│   ├── OrderCode.ts
│   └── OrderBuilder.ts            Arma un pedido válido desde carrito, cliente y entrega
├── quote/
│   ├── Quote.ts
│   └── QuoteBuilder.ts
├── business/
│   ├── Business.ts
│   └── BusinessHours.ts           Responde "¿está abierto ahora?" y "¿entrega hoy?"
└── consumption/
    └── ConsumptionCalculator.ts   Sugiere lista de compra según tipo y tamaño de negocio
```

### 6.2 `application/`: qué se puede hacer

Casos de uso y los **contratos** (puertos) que necesitan del mundo exterior.

```
application/
├── ports/                         Contratos pequeños, cada uno con un solo propósito
│   ├── CartStorage.ts             Guardar y leer el carrito
│   ├── CustomerPrefsStorage.ts    Guardar datos del cliente y modo Hogar/Negocio
│   ├── LastOrderStorage.ts        Guardar y leer el último pedido
│   ├── CatalogSource.ts           De dónde salen los productos y categorías
│   ├── OrderGateway.ts            Enviar un pedido a la API
│   ├── QuoteGateway.ts            Enviar una cotización a la API
│   ├── MessageFormatter.ts        Convertir un pedido o cotización en texto
│   ├── MessageChannel.ts          Generar el enlace de contacto (WhatsApp)
│   ├── CartCodec.ts               Convertir el carrito en enlace y viceversa
│   ├── Clock.ts                   Hora actual (para probar con horas falsas)
│   ├── CodeGenerator.ts           Generar códigos de pedido
│   └── Analytics.ts               Registrar eventos
├── use-cases/
│   ├── AddToCart.ts
│   ├── ChangeQuantity.ts
│   ├── RemoveFromCart.ts
│   ├── ClearCart.ts
│   ├── SwitchPricingMode.ts       Cambiar entre Hogar y Negocio
│   ├── PreviewCartTotals.ts       Totales, ahorro y faltantes (mínimo, envío gratis)
│   ├── SubmitOrder.ts             Validar, generar código, preparar WhatsApp y avisar a la API
│   ├── SubmitQuote.ts
│   ├── RepeatLastOrder.ts
│   ├── ShareCart.ts               Generar el enlace del carrito
│   ├── LoadSharedCart.ts          Cargar un carrito desde un enlace
│   ├── SuggestConsumption.ts
│   └── CheckBusinessOpen.ts
├── queries/
│   ├── CatalogQuery.ts            Filtrar, ordenar y buscar productos en el navegador
│   └── RelatedProducts.ts         Complementarios y alternativas
└── dto/                           Formas de datos que cruzan capas
```

`SubmitOrder` es el caso de uso central: deja salir el pedido por WhatsApp primero y manda la copia a la API sin esperar su respuesta.

### 6.3 `infrastructure/`: cómo se hace realmente

Adaptadores que implementan los contratos. Aquí sí aparecen el navegador, la red y WhatsApp.

```
infrastructure/
├── storage/
│   ├── LocalStorageCartStorage.ts
│   ├── LocalStorageCustomerPrefs.ts
│   ├── LocalStorageLastOrder.ts
│   ├── MemoryCartStorage.ts             Para pruebas
│   └── UrlCartCodec.ts                  Carrito dentro del enlace
├── gateways/
│   ├── HttpOrderGateway.ts              Envío normal a la API
│   ├── BeaconOrderGateway.ts            Envío que sobrevive aunque se cierre la pestaña
│   ├── CompositeOrderGateway.ts         Prueba uno y cae al otro
│   ├── NullOrderGateway.ts              No envía nada (desarrollo, pruebas)
│   └── HttpQuoteGateway.ts
├── messaging/
│   ├── WhatsAppMessageChannel.ts        Construye el enlace wa.me
│   ├── TemplateMessageFormatter.ts      Rellena la plantilla de mensaje del cliente
│   └── templates/                       Plantillas por defecto del core
├── catalog/
│   ├── StaticCatalogSource.ts           Lee los datos publicados (colecciones de Astro)
│   └── mappers/                         Convierten datos crudos en clases del dominio
├── analytics/
│   ├── PlausibleAnalytics.ts
│   ├── Ga4Analytics.ts
│   └── NoopAnalytics.ts
├── time/
│   └── SystemClock.ts
└── ids/
    └── RandomCodeGenerator.ts
```

### 6.4 `composition/`: el ensamblado y el estado compartido

Un único lugar donde se decide qué adaptador usa cada contrato, según la configuración del cliente. Sin framework, el estado compartido entre elementos de la página lo lleva una clase propia pequeña.

```
composition/
├── buildContainer.ts              Crea todas las piezas desde la configuración del cliente
├── containerContext.ts            Cómo los controladores obtienen el contenedor
└── state/
    ├── Store.ts                   Clase base: guarda un valor y avisa a quien se suscribe
    ├── CartStore.ts               Estado del carrito, envuelve casos de uso
    └── PricingModeStore.ts        Modo Hogar / Negocio
```

`Store` se apoya en los eventos nativos del navegador. Cada `Store` es una sola instancia por página, compartida por todos los controladores. Entre páginas, el estado persiste en el almacenamiento del navegador.

Si un cliente no usa API, el contenedor entrega `NullOrderGateway`. Si usa Plausible, entrega `PlausibleAnalytics`. El resto del código no se entera.

### 6.5 `presentation/`: la vista

```
presentation/
├── styles/
│   ├── reset.css
│   ├── tokens.base.css            Valores por defecto de las variables (el tema del cliente las sobrescribe)
│   ├── base.css
│   └── utilities.css
├── ui/                            DISEÑO ATÓMICO (solo vista, sin lógica)
│   ├── atoms/
│   ├── molecules/
│   └── organisms/
├── features/                      FUNCIONES INTERACTIVAS (vista dumb + controlador smart)
│   ├── cart/
│   ├── checkout/
│   ├── catalog-filters/
│   ├── pricing-mode/
│   ├── quick-order/
│   ├── consumption-calculator/
│   ├── quote/
│   └── business-hours/
├── sections/                      Bloques de página reutilizables
├── layouts/                       Plantillas de página
├── pages/                         Módulos de página (una por ruta del mapa del sitio)
└── seo/                           Metadatos, datos estructurados, mapa del sitio
```

#### Diseño atómico

Cada nivel solo puede usar el nivel de abajo. Todo es `.astro`.

```
ui/
├── atoms/                         La pieza más pequeña, sin conocer el negocio
│   ├── Button.astro
│   ├── Icon.astro
│   ├── Badge.astro                Etiqueta: "Más pedido", "Oferta"
│   ├── Heading.astro
│   ├── Text.astro
│   ├── Link.astro
│   ├── Image.astro
│   ├── Input.astro
│   ├── Select.astro
│   ├── Textarea.astro
│   ├── Label.astro
│   ├── Price.astro                Muestra un monto con formato
│   └── Divider.astro
├── molecules/                     Grupos pequeños de átomos con un propósito
│   ├── FormField.astro            Etiqueta + campo + mensaje de error
│   ├── QuantityStepper.astro      Menos, cantidad y más (vista)
│   ├── PriceWithTier.astro        Precio + aviso "desde 5 u: S/ 19.00"
│   ├── SearchBox.astro
│   ├── ProductMeta.astro          Presentación, marca, envase
│   ├── Breadcrumbs.astro
│   ├── ZoneBadge.astro            Zona, tiempo y costo
│   ├── ProgressBar.astro          Barra de pedido mínimo o envío gratis
│   └── WhatsAppButton.astro
└── organisms/                     Bloques completos con significado propio
    ├── Header.astro
    ├── Footer.astro
    ├── MobileDock.astro           Barra inferior con carrito y WhatsApp
    ├── ProductCard.astro
    ├── ProductGrid.astro
    ├── ProductTable.astro
    ├── CategoryNav.astro
    ├── CategoryCard.astro
    ├── PriceTierTable.astro       Tabla de precios por volumen
    ├── ZoneList.astro
    ├── SegmentCard.astro
    ├── ReviewList.astro
    ├── FaqList.astro
    └── CartSummary.astro          Resumen de totales
```

Plantillas y páginas completan la escala:

```
layouts/                           PLANTILLAS: estructura de la página sin contenido real
├── BaseLayout.astro               Cabecera, pie, metadatos, estilos, barra inferior
├── CatalogLayout.astro            Con filtros laterales
├── ProductLayout.astro
├── ContentLayout.astro            Para nosotros, contacto, segmentos
└── CheckoutLayout.astro           Para /carrito

sections/                          Bloques de página hechos de organismos
├── HeroSection.astro
├── ModeSelectorSection.astro
├── FeaturedProductsSection.astro
├── CategoriesSection.astro
├── BenefitsSection.astro
├── HowItWorksSection.astro
├── ZonesSection.astro
├── ReviewsSection.astro
└── FaqSection.astro

pages/                             PÁGINAS: una por ruta, arman layout + secciones con datos reales
├── HomePage.astro
├── CatalogPage.astro
├── CategoryPage.astro
├── SubcategoryPage.astro
├── ProductPage.astro
├── CartPage.astro
├── BusinessPage.astro
├── SegmentPage.astro
├── QuotePage.astro
├── ZonesPage.astro
├── ZonePage.astro
├── AboutPage.astro
├── ContactPage.astro
└── NotFoundPage.astro
```

#### Smart y dumb sin framework

En Astro puro, la separación se hace así:

- **Vista dumb:** un componente `.astro` que recibe datos por propiedades y dibuja HTML con CSS. No tiene lógica de negocio.
- **Controlador smart:** una **clase de TypeScript** que extiende `HTMLElement` (un elemento personalizado). Se activa sobre el HTML que Astro ya generó, se suscribe al `Store`, llama casos de uso y actualiza la vista.
- **Presentador:** una clase pequeña que convierte los datos del dominio en lo que la vista necesita mostrar (textos con formato, estados). Cumple el papel que en un framework cumplirían los "hooks".

Para listas que cambian en el navegador (las líneas del carrito) se usa el elemento `<template>` del HTML:

1. Astro dibuja el molde (`<template>`) usando el componente dumb, con el mismo diseño y CSS que el resto.
2. El controlador clona el molde por cada línea y rellena los datos.
3. El diseño sigue viviendo en Astro, la lógica en TypeScript. No hay HTML escrito dentro del código TypeScript.

```
features/cart/
├── CartPanel.astro                VISTA dumb: panel y moldes (<template>) de las líneas
├── CartLine.astro                 VISTA dumb: una línea (se usa dentro del molde)
├── CartTotals.astro               VISTA dumb: totales
├── CartElement.ts                 CONTROLADOR smart: clase que extiende HTMLElement
├── CartPresenter.ts               PRESENTADOR: datos del dominio → datos para mostrar
├── cart.css                       Estilos propios de la función
└── index.ts                       Registra el elemento personalizado
```

| Pieza | Sabe de | No sabe de |
|---|---|---|
| **Vista (`.astro`)** | Propiedades recibidas, clases CSS | Dominio, casos de uso, almacenamiento |
| **Controlador (elemento personalizado)** | Casos de uso, `Store`, eventos del navegador, analítica | Cómo se dibuja (solo busca moldes y marcas en el HTML) |
| **Presentador** | Traducir dominio a texto y estados | HTML, DOM, estilos |

Regla práctica: **una vista dumb se puede mostrar con datos inventados** y se revisa sin cargar nada del negocio.

Qué hace cada tecnología:

| Tecnología | Para qué |
|---|---|
| Componentes `.astro` | Todo lo visual y estático: átomos, moléculas, organismos, secciones, layouts, páginas |
| Elementos personalizados (clases) | Solo las funciones interactivas |
| Etiqueta `<script>` dentro del componente `.astro` | Registrar el elemento; Astro la empaqueta y la entrega solo en las páginas que usan ese componente |

Cada función interactiva carga su código **solo donde se usa**. El estado del carrito y el contador de la cabecera son lo único que va en todas las páginas, y se mantiene lo más pequeño posible.

Como los elementos personalizados se activan solos cuando aparecen en la página, también funcionan bien si algún día se usan transiciones entre páginas.

### 6.6 `integration/`

```
integration/
├── index.ts                       Integración de Astro que activa el core en un sitio
├── injectRoutes.ts                Registra las páginas del core como rutas
├── tenantVirtualModule.ts         Entrega la configuración validada del cliente al core
├── bundlerSettings.ts             Ajustes para que Astro procese los archivos del paquete
└── routeTable.ts                  Tabla de rutas y qué página del core atiende cada una
```

Qué resuelve cada archivo:

- **Rutas:** el sitio no necesita carpeta de páginas; el core registra las del mapa del sitio. El sitio puede sumar las suyas.
- **Módulo virtual:** el core pide la configuración del cliente a un nombre fijo y no importa ningún archivo del sitio. En el momento A apunta a `src/tenant/`; en el momento C, al proyecto del cliente. El core no cambia.
- **Ajustes del empaquetado:** como el paquete publica archivos `.astro` y `.ts` sin compilar, la integración le indica a Astro que los procese como parte del proyecto.

### 6.7 `config/`

```
config/
├── tenantSchema.ts                Esquema de tenant.config
├── featuresSchema.ts              Funcionalidades activables
├── themeSchema.ts                 Variables de tema obligatorias
└── contentSchemas/                Esquemas de cada colección
    ├── category.ts
    ├── brand.ts
    ├── product.ts
    ├── zone.ts
    ├── segment.ts
    ├── review.ts
    └── faq.ts
```

Estos esquemas son el **contrato entre lo general y lo específico**.

### 6.8 `index.ts`: la API pública

Lo único que el sitio puede importar del core:

- La integración (para `astro.config`).
- La función que arma las colecciones de contenido.
- Los tipos y esquemas de configuración.
- Utilidades de tema (por ejemplo, tipos para el registro de reemplazos).

Todo lo demás es interno y el sitio no lo toca.

---

## 7. Cómo se publica en npm

### 7.1 Qué contiene el paquete

```
@tu-scope/distribuidora/
├── package.json
├── README.md
├── CHANGELOG.md
├── LICENSE
└── src/                           Código fuente (.astro, .ts, .css), no compilado
    └── (estructura de la sección 6)
```

Se publica **el código fuente**, no una versión compilada. Astro necesita ver los archivos `.astro` para procesarlos dentro del sitio que los usa.

### 7.2 Qué se declara en `package.json`

| Campo | Para qué |
|---|---|
| `name` | Nombre con alcance (`@tu-scope/distribuidora`) |
| `version` | Versión semántica |
| `exports` | Qué rutas se pueden importar desde fuera: la API pública, los componentes, los estilos base, la integración |
| `files` | Qué carpetas se incluyen al publicar |
| `peerDependencies` | La versión de Astro que se necesita (el sitio la trae, el paquete no la duplica) |
| `keywords` | `astro-component`, `astro-integration`, `withastro` para que sea encontrable |
| `type` | `module` |

### 7.3 Proyecto base (starter)

Un pequeño proyecto con todo lo que el cliente debe completar:

```
starter/
├── package.json                   Ya depende de @tu-scope/distribuidora
├── astro.config.mjs               Ya usa la integración
├── .env.example
├── public/                        Favicon, robots, imágenes de ejemplo
└── src/
    ├── content.config.ts          Ya conectado al paquete
    └── tenant/
        ├── tenant.config.ts       Con comentarios de qué completar
        ├── content/               Ejemplos mínimos de cada colección
        ├── theme/tokens.css
        └── assets/
```

Se entrega como repositorio de plantilla de GitHub o con un comando `npm create` (paquete `create`). Quien lo copia solo completa datos.

### 7.4 Versionado y actualizaciones

| Cambio | Versión | Efecto en los clientes |
|---|---|---|
| Arreglo de error | Parche (`1.0.1`) | Se actualiza sin riesgo |
| Función nueva activable | Menor (`1.1.0`) | Se actualiza; la función nueva queda apagada hasta activarla |
| Cambio que obliga a tocar datos o configuración | Mayor (`2.0.0`) | Se actualiza con una guía de migración |

Los esquemas validan los datos al construir, así que si una versión nueva exige un campo, el sitio falla con un mensaje claro y no con una web rota.

---

## 8. Reglas de importación

Qué capa puede usar a cuál:

| Desde ↓ / Hacia → | domain | application | infrastructure | composition | presentation | tenant |
|---|---|---|---|---|---|---|
| **domain** | Sí | No | No | No | No | No |
| **application** | Sí | Sí | No | No | No | No |
| **infrastructure** | Sí | Sí (contratos) | Sí | No | No | No |
| **composition** | Sí | Sí | Sí | Sí | No | Solo la configuración (módulo virtual) |
| **presentation/ui** | Solo tipos | No | No | No | Sí | No |
| **presentation/features** (controladores) | Solo tipos | Sí | No | Sí | Sí | No |
| **presentation/pages** | Sí | Sí (consultas) | Solo catálogo | Sí | Sí | Solo la configuración (módulo virtual) |
| **tenant** | No | No | No | No | Solo overrides | Sí |

Se hacen cumplir automáticamente en cada cambio con una herramienta de análisis de dependencias:

- `domain` no importa nada de afuera.
- `ui/` no importa casos de uso ni infraestructura.
- Una vista dumb no importa el controlador.
- **`core` no importa nada de `tenant`** (salvo por el módulo virtual). Esta regla es la que hace posible el paso 2.
- Un sitio no importa archivos internos del core, solo su API pública (`index.ts`).

---

## 9. Cómo se aplica SOLID

| Principio | Cómo se cumple | Ejemplo |
|---|---|---|
| **S: responsabilidad única** | Cada clase tiene un solo motivo para cambiar | `PricingService` solo calcula precios; `OrderBuilder` solo arma pedidos; `WhatsAppMessageChannel` solo crea enlaces |
| **O: abierto a extensión, cerrado a modificación** | Se agrega comportamiento con clases nuevas, sin tocar las existentes | Un nuevo tipo de descuento es una nueva `PricingStrategy`; un nuevo canal es otro `MessageChannel` |
| **L: sustitución de Liskov** | Cualquier adaptador sirve donde se pida su contrato | `MemoryCartStorage` reemplaza a `LocalStorageCartStorage` en pruebas; `NullOrderGateway` reemplaza a `HttpOrderGateway` en desarrollo |
| **I: segregación de interfaces** | Contratos pequeños y específicos | `CartStorage`, `OrderGateway` y `MessageChannel` son tres contratos; ningún controlador depende de métodos que no usa |
| **D: inversión de dependencias** | La lógica depende de contratos; el ensamblado decide cuáles usar | `SubmitOrder` pide un `OrderGateway`; `buildContainer` entrega el adaptador según la configuración |

### Al agregar algo nuevo

| Quiero agregar | Qué creo | Qué NO toco |
|---|---|---|
| Descuento por pago adelantado | Una `PricingStrategy` nueva, activada en la configuración | `Cart`, vistas, páginas |
| Enviar pedidos a Telegram además de la API | Un `OrderGateway` nuevo, sumado a `CompositeOrderGateway` | `SubmitOrder`, vistas |
| Guardar el carrito en otro lugar | Un `CartStorage` nuevo | Casos de uso, vistas |
| Otra analítica | Un `Analytics` nuevo | Casos de uso, vistas |

---

## 10. Flujo de una compra, de punta a punta

```
Vista dumb (botón Agregar, en HTML de Astro)
   │ evento del navegador
   ▼
Controlador smart (CartElement)
   │ llama
   ▼
Caso de uso (AddToCart)
   │ usa
   ├──► Dominio (Cart, PricingService)
   └──► Contrato (CartStorage) ◄── adaptador LocalStorageCartStorage
   │
   ▼
Estado compartido (CartStore) ──► todos los controladores se actualizan
   │
   ▼
Presentador → datos para mostrar → controlador actualiza el HTML
```

Al enviar el pedido:

```
Controlador de checkout (smart)
   │
   ▼
SubmitOrder (caso de uso)
   1. OrderBuilder valida y arma el Order          (dominio)
   2. CodeGenerator crea el código                 (contrato)
   3. MessageFormatter redacta el texto            (contrato)
   4. MessageChannel entrega el enlace de WhatsApp (contrato)  → el controlador lo abre
   5. OrderGateway envía la copia a la API         (contrato)  → sin esperar respuesta
   6. LastOrderStorage guarda el último pedido     (contrato)
   7. Analytics registra el evento                 (contrato)
```

---

## 11. Dónde va cada cosa: tabla de decisión

| Pregunta | Respuesta |
|---|---|
| ¿Cambia el precio de un producto? | `tenant/content/productos` |
| ¿Cambia el color del botón de un cliente? | `tenant/theme/tokens.css` |
| ¿Quiero otro texto en la portada de un cliente? | `tenant/content/paginas` o `tenant.config` |
| ¿Un cliente quiere una portada con otro diseño? | Reemplazo en `tenant/overrides/` |
| ¿La regla "envío gratis desde X" cambia para todos? | `core/domain/delivery/ZonePolicy` |
| ¿Un nuevo botón visual que usarán todos los clientes? | `core/presentation/ui/atoms` |
| ¿Una nueva función interactiva para todos? | Caso de uso + `features/` nueva en el core, activable por configuración |
| ¿Cambiar el mensaje de WhatsApp de un cliente? | Plantilla en `tenant.config` |
| ¿Cambiar el mensaje para todos? | Plantilla por defecto en `core/infrastructure/messaging/templates` |
| ¿Una página que solo tiene un cliente? | Ruta extra declarada en el sitio |

---

## 12. Convenciones de nombres

| Qué | Convención | Ejemplo |
|---|---|---|
| Clases y componentes | PascalCase | `PricingService`, `ProductCard.astro` |
| Funciones, variables, archivos que no son clases | camelCase | `buildContainer.ts` |
| Contratos | Nombre del rol, sin prefijos | `OrderGateway`, `CartStorage` |
| Implementaciones | Tecnología + contrato | `HttpOrderGateway`, `LocalStorageCartStorage` |
| Casos de uso | Verbo + sustantivo | `AddToCart`, `SubmitOrder` |
| Vistas dumb | Componentes `.astro`, nombre del elemento visual | `CartPanel.astro` |
| Controladores smart | Terminan en `Element` | `CartElement` |
| Presentadores | Terminan en `Presenter` | `CartPresenter` |
| Etiquetas de elementos personalizados | Prefijo propio + nombre, con guion | `dist-cart`, `dist-quick-order` |
| Páginas | Terminan en `Page` | `CategoryPage` |
| Secciones | Terminan en `Section` | `HeroSection` |
| Datos del sitio | Ids estables en minúscula | `cat_gaseosas`, `prod_bidon_20` |

Código en inglés y contenido visible en español. Se define una vez y se respeta.

---

## 13. Pruebas

| Capa | Tipo | Qué se verifica | Herramienta sugerida |
|---|---|---|---|
| `domain` | Unitarias, sin navegador | Tramos de precio, ahorros, mínimo y envío gratis, armado de pedido, horarios | Vitest |
| `application` | Unitarias con adaptadores falsos | Que `SubmitOrder` entrega WhatsApp aunque la API falle | Vitest |
| `infrastructure` | Integración ligera | Enlace de WhatsApp, carrito dentro del enlace | Vitest |
| `presentation` | Presentadores y controladores | Que los presentadores dan los textos correctos; que los controladores reaccionan a eventos | Vitest con entorno de navegador simulado |
| Sitio completo | De extremo a extremo | Agregar producto, cambiar a modo Negocio, enviar pedido y verificar el enlace | Playwright |
| Datos | Validación al construir | Que todo el contenido cumple los esquemas | Esquemas del core |
| Paquete | Instalación real | Que el starter se instala desde el paquete empaquetado y construye | Script en el repositorio |

Las pruebas más valiosas están en `domain` y `application`: son rápidas y protegen las reglas que más importan (precios y pedido).

---

## 14. Herramientas del repositorio

```
tools/
├── create-site/                   Crea un cliente nuevo desde el starter
├── validate-content/              Revisa datos de un sitio sin construirlo
├── check-boundaries/              Verifica las reglas de importación
└── export-catalog/                Convierte una hoja de cálculo en archivos de contenido
```

---

## 15. Crear un cliente nuevo (cuando la plantilla ya está en npm)

1. Copiar el starter (o ejecutar el comando de creación).
2. Completar `tenant.config.ts`: identidad, contacto, horario, pagos, API, funcionalidades.
3. Elegir colores y tipografías en `theme/tokens.css`.
4. Cargar categorías, productos, zonas, segmentos y reseñas reales en `content/`.
5. Subir logo e imágenes.
6. Validar los datos.
7. Publicar. Si falta algo, la construcción falla con el motivo exacto.

Si el cliente necesita algo que la plantilla no ofrece:
- Primero se intenta con datos, tema o plantilla de mensaje.
- Si no alcanza, se crea un reemplazo en `overrides/`.
- Si lo van a querer otros clientes, se agrega al core como función activable y se publica una versión nueva.

---

## 16. Resumen

| | General (`core`) | Específico (`tenant`) |
|---|---|---|
| **Contiene** | Reglas, casos de uso, adaptadores, componentes, controladores, layouts, páginas, esquemas | Configuración, contenido, tema, imágenes, reemplazos |
| **Dónde vive al inicio** | `src/core/` dentro del proyecto | `src/tenant/` dentro del proyecto |
| **Dónde vive al final** | `node_modules/@tu-scope/distribuidora` | `src/tenant/` del proyecto del cliente |
| **Conoce al cliente** | Nunca | Es el cliente |
| **Tiene lógica** | Sí, solo en `domain` y `application` | No |
| **Se prueba con** | Pruebas unitarias y de extremo a extremo | Validación de datos al construir |

Capas dentro del general:

| Capa | Rol | Depende de |
|---|---|---|
| `domain` | Reglas del negocio | Nada |
| `application` | Qué se puede hacer y qué necesita | `domain` |
| `infrastructure` | Cómo se hace en el navegador y la red | `application`, `domain` |
| `composition` | Elige qué adaptador usar y lleva el estado compartido | Todas las anteriores |
| `presentation` | Vistas dumb (`.astro`) y controladores smart (elementos personalizados) | `composition`, `application` |

Camino de trabajo:

| Paso | Qué se hace | Resultado |
|---|---|---|
| 0 | Prueba técnica del paquete con Astro | Se confirma que el diseño funciona |
| 1 | Construir `aguas-pachacamac` con `src/core` y `src/tenant` | Un sitio real que vende |
| 2 | Mover `src/core` a un paquete local | Mismo sitio, lógica separada |
| 3 | Crear un segundo sitio solo con datos | Se detectan y corrigen las fugas |
| 4 | Añadir starter y publicar en npm | Plantilla reutilizable |