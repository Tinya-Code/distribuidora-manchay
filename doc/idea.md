# Estructura de la web para una distribuidora (agua y gaseosas)

Plantilla genérica de venta al por mayor y menor, hecha con **Astro en modo estático (SSG)**. Se reutiliza para cualquier distribuidora cambiando solo los datos (catálogo, precios, zonas, textos). La primera instalación será para agua y gaseosas.

**Principio de diseño:** todo gira en torno a un solo resultado, **el pedido por WhatsApp**. La web arma el pedido, lo manda a WhatsApp y, en paralelo, envía una copia a una API para guardarlo. No hay cuentas, no hay seguimiento de pedidos, no hay páginas que dependan de datos en vivo.

---

## 1. Qué cambia por usar Astro estático

Un sitio estático se genera una sola vez al publicar. Eso fija qué se puede hacer y qué no.

| Se puede (y es lo ideal) | No se hace en el sitio |
|---|---|
| Páginas de inicio, categorías, productos, zonas y segmentos generadas desde datos | Cuentas de cliente, inicio de sesión, historial |
| Carrito en el navegador (con poco JavaScript) | Páginas de pedido por código, seguimiento de estado |
| Cambiar entre precio Hogar y Negocio sin recargar | Entregas recurrentes o suscripciones |
| Enviar el pedido a WhatsApp y a una API | Stock en tiempo real |
| Buscador estático y filtros en el navegador | Blog |
| SEO local muy fuerte y carga rápida | Panel de administración dentro del mismo sitio |

**Consecuencia clave:** si cambian precios o productos, se vuelve a publicar el sitio (se puede automatizar, ver sección 9). Las cosas que cambian a diario (pedidos recibidos, estados, saldos de envases) se manejan **fuera del sitio**, en la herramienta que reciba los pedidos de la API.

---

## 2. Idea central

Una web que funciona como una **tienda de pedidos rápidos**, no como una página informativa.

- El cliente llega desde Google o desde un enlace compartido por WhatsApp.
- Arma un pedido en menos de un minuto.
- Toca *Enviar pedido por WhatsApp*: se abre WhatsApp con el pedido ya redactado.
- En paralelo, la web envía los mismos datos a la API, que los guarda y avisa a la distribuidora.

**Dos tipos de cliente, una sola web:**

| | Minorista (hogar) | Mayorista (bodega, restaurante, oficina, evento) |
|---|---|---|
| Compra | Pocas unidades, bidón o paquete | Cajas y paquetes en cantidad |
| Quiere | Rapidez y entrega a domicilio | Precio por volumen y pedir sin escribir mucho |
| Pantalla clave | Catálogo + carrito | Pedido rápido en tabla + cotización |

---

## 3. Mapa del sitio

Todas las páginas se generan al publicar a partir de los datos del catálogo, las zonas y los segmentos.

```
/                                        Inicio
/productos                               Catálogo completo
/productos/{categoria}                   Categoría (ej. /productos/agua)
/productos/{categoria}/{subcategoria}    Subcategoría (ej. /productos/gaseosas/personal)
/producto/{slug}                         Ficha de producto
/carrito                                 Carrito y envío del pedido
/negocios                                Para bodegas, restaurantes, oficinas y eventos
/negocios/{segmento}                     Una página por segmento (ej. /negocios/bodegas)
/cotizar                                 Formulario de cotización
/zonas                                   Zonas de reparto
/zonas/{zona}                            Página local (SEO): "Venta de agua en Pachacámac"
/nosotros                                Quiénes somos, fotos reales
/contacto                                Teléfono, mapa, horarios
/404                                     Página no encontrada con enlaces útiles
```

Quedan **fuera**: `/cuenta`, `/cuenta/pedidos`, `/cuenta/suscripciones`, `/pedido`, `/pedido/{codigo}`, `/blog`.

`/carrito` es una sola página estática. Su contenido se arma en el navegador a partir del carrito guardado, así que no necesita servidor.

---

## 4. Detalle de cada pantalla

### 4.1 Inicio

Objetivo: que quien llega pida o cotice sin buscar.

1. **Barra superior fija:** logo, menú (Productos, Negocios, Zonas, Contacto), buscador, botón carrito con contador, botón WhatsApp.
2. **Hero:** título con la palabra clave y la zona ("Distribuidora de agua y gaseosas en Pachacámac"), una línea de apoyo ("Venta por mayor y menor con entrega a domicilio") y dos botones: *Armar mi pedido* y *Solicitar cotización*.
3. **Selector "¿Cómo compras?":** dos tarjetas, *Para mi casa* y *Para mi negocio*. Guarda la elección en el navegador y cambia los precios mostrados.
4. **Lo más pedido:** 4 a 6 productos con botón de agregar directo.
5. **Categorías:** tarjetas con imagen.
6. **Beneficios:** entrega rápida, precio mayorista, pago al recibir, atención a negocios.
7. **Cómo funciona:** 3 pasos (arma tu pedido, envíalo por WhatsApp, recibe y paga).
8. **Indicador de horario:** "Abierto ahora, entrega hoy hasta las 19:00" o "Cerrado, te respondemos mañana desde las 7:00". Se calcula en el navegador con la hora actual.
9. **Zonas de reparto:** lista corta con tiempos.
10. **Prueba social:** reseñas reales y fotos del almacén y del reparto. Se oculta si no hay.
11. **Preguntas frecuentes.**
12. **Pie de página:** dirección, horarios, teléfono.

Fijo en todas las páginas: botón de WhatsApp flotante en escritorio y, en celular, una barra inferior con el resumen del carrito.

### 4.2 Catálogo

- **Filtros** (en celular, panel desplegable): categoría, subcategoría, marca, tamaño, tipo de envase, solo disponibles. Filtran en el navegador sobre la lista ya cargada.
- **Orden:** más pedidos, precio menor a mayor, nombre.
- **Vista:** cuadrícula de tarjetas, con opción de **vista tabla** para pedir rápido.
- **Interruptor Hogar / Negocio** visible arriba: cambia precio y formato (unidad o caja).
- **Tarjeta de producto:** imagen, nombre, presentación, precio, etiqueta (Más pedido, Oferta), selector de cantidad y botón *Agregar*.
- **Aviso de tramo:** "Lleva 5 y paga S/ 19.00 c/u".
- **Buscador estático** con sugerencias mientras se escribe ("bidon", "gaseosa 3 litros"). Se genera al publicar, sin servidor.

### 4.3 Categorías y subcategorías

Árbol de hasta 3 niveles. Ejemplo:

```
Agua
├── Bidones
│   ├── Bidón 20 L retornable
│   └── Bidón 20 L descartable
├── Agua embotellada
│   ├── Sin gas
│   └── Con gas
└── Dispensadores y accesorios
Gaseosas
├── Por tamaño
│   ├── Personal (hasta 500 ml)
│   ├── Familiar (1.5 L a 2.5 L)
│   └── Extra familiar (3 L)
└── Por sabor
    ├── Cola
    ├── Naranja
    └── Lima limón
Energizantes
Jugos y néctares
Ofertas y packs
```

Cada categoría tiene su página con texto breve, filtros y productos. Es lo que posiciona en Google ("gaseosas al por mayor en Pachacámac").

### 4.4 Ficha de producto

- Galería de imágenes y nombre.
- **Selector de presentación:** unidad, paquete, caja. Cada una con su precio y la cantidad que contiene.
- **Tabla de precios por volumen** (tramos), visible y clara.
- Si el envase es retornable: aviso del canje o depósito.
- Descripción corta.
- Botones: *Agregar al carrito* y *Pedir este producto por WhatsApp* (mensaje directo con solo ese producto).
- **Se compra junto con:** productos complementarios.
- **Alternativas:** el mismo producto en otro tamaño o marca.
- Marca "No disponible" si el dato del producto así lo indica (se actualiza al volver a publicar).

### 4.5 Carrito y envío del pedido (`/carrito`)

Es la pantalla que vende. Hay dos formas de verlo: un panel lateral que se abre desde cualquier página y la página completa `/carrito`. Ambos usan el mismo carrito.

**Carrito:**

1. Líneas: producto, presentación, cantidad con selector, precio unitario aplicado, subtotal, quitar.
2. **Precio por tramos en vivo:** "Agrega 2 más y baja a S/ 19.00 c/u. Ahorras S/ 8.00".
3. **Barra de pedido mínimo:** "Te faltan S/ 12 para el pedido mínimo".
4. **Barra de envío gratis:** "Te faltan S/ 20 para delivery gratis".
5. **Sugerencias:** "Muchos clientes también llevan…".
6. **Resumen:** subtotal, descuento por volumen, envío, total.

**Datos del pedido (en la misma pantalla, sin otra página):**

1. Nombre y teléfono.
2. Tipo de cliente (hogar o negocio). Si es negocio, nombre del negocio y RUC (opcional, para factura).
3. Zona de entrega (calcula envío y tiempo), dirección y referencia.
4. Fecha y franja: "lo antes posible" o elegir día y mañana/tarde, según los días de reparto de la zona.
5. Forma de pago: efectivo (y con cuánto paga), Yape, Plin o transferencia.
6. Comprobante: boleta o factura.
7. Notas.
8. Los datos del cliente se guardan en el navegador para la próxima vez.

**Botón principal: *Enviar pedido por WhatsApp*.** Qué ocurre al tocarlo:

1. Se valida el pedido (mínimo, campos obligatorios).
2. La web genera un **código de pedido** en el navegador (ej. `PED-261102-K7F3`).
3. Se abre WhatsApp con el mensaje del pedido ya redactado, incluido el código.
4. En paralelo, se envía el pedido a la API. **WhatsApp no espera a la API**: si la API falla, el pedido igual llega por WhatsApp y la venta no se pierde.
5. La pantalla muestra "Pedido enviado", el código y un botón *Abrir WhatsApp de nuevo* por si el navegador lo bloqueó.
6. El pedido queda guardado en el navegador como **último pedido** para poder repetirlo.

Botones secundarios: *Compartir mi carrito* (enlace) y *Vaciar carrito*.

### 4.6 Para negocios

- Página general `/negocios` y una por segmento: bodegas, restaurantes, oficinas, eventos. Cada una con su texto, beneficios y productos típicos (SEO).
- **Pedido rápido en tabla:** todos los productos en una lista con un campo de cantidad cada uno. Se llena en segundos y alimenta el mismo carrito.
- **Calculadora de consumo:** el cliente indica tipo y tamaño de negocio (mesas, personas, bodega pequeña o grande) y la web propone una lista de compra. Con un botón la carga en el carrito.
- **Repetir último pedido** si ya compró antes desde ese navegador.
- Botón a la cotización para consumos grandes.

### 4.7 Cotizar (`/cotizar`)

Formulario con: nombre, teléfono, tipo de negocio, consumo aproximado, productos que necesita, zona y mensaje. Funciona igual que el pedido: abre WhatsApp con el mensaje redactado y envía una copia a la API.

### 4.8 Zonas de reparto

- Lista de zonas con tiempo de entrega, costo de envío, pedido mínimo y días de reparto.
- Mapa simple (imagen o enlace a mapa, sin cargar librerías pesadas).
- Una página por zona con texto propio ("Venta de agua en Manchay") y los productos más pedidos.
- Para zonas sin cobertura: texto "Escríbenos por WhatsApp y coordinamos".

### 4.9 Nosotros y contacto

- Quiénes somos, fotos reales del almacén y del reparto.
- Teléfono, WhatsApp, mapa, horarios, dirección.

---

## 5. Reglas de negocio (mayor y menor)

### 5.1 Precios

Cada producto tiene **presentaciones** (unidad, paquete, caja) y cada presentación tiene **precios por tramos**, por lista de precio.

Ejemplo, gaseosa de 500 ml, paquete x12:

| Cantidad comprada | Minorista | Mayorista |
|---|---|---|
| 1 a 4 | S/ 21.00 | S/ 19.00 |
| 5 a 19 | S/ 19.00 | S/ 19.00 |
| 20 o más | S/ 19.00 | S/ 18.00 |

Listas de precio: `minorista` y `mayorista`. Los precios especiales por cliente no se manejan en el sitio: se acuerdan por WhatsApp.

**Cómo funciona con un sitio estático:** la página se publica mostrando precio minorista (es lo que ve Google). Los dos precios viajan en la propia página y un pequeño script cambia entre ellos cuando el cliente elige Hogar o Negocio.

### 5.2 Pedido mínimo, envío y zonas

- Pedido mínimo por zona.
- Costo de envío por zona, con envío gratis desde un monto.
- Tiempo de entrega por zona (mismo día, 24 horas).
- Hora de corte para entrega del mismo día.
- Días de reparto por zona.

### 5.3 Envases retornables

- Se informa en la ficha del producto cómo funciona el canje o el depósito.
- El control del saldo de envases por cliente **se lleva fuera del sitio** (hoja de cálculo o sistema interno de la distribuidora).

### 5.4 Disponibilidad

No hay stock en vivo. Cada producto tiene un campo `disponible` en los datos. Si algo se agota, se marca y se vuelve a publicar. El mensaje de WhatsApp aclara: "La disponibilidad se confirma al responderte". Eso evita prometer lo que no se puede asegurar.

### 5.5 Pagos y comprobantes

- Pago al recibir: efectivo, Yape, Plin, transferencia. Sin pasarela de tarjeta.
- Boleta o factura: la web solo recoge DNI o RUC. La emisión la hace el sistema que ya use la distribuidora.

### 5.6 Los precios los valida la API

El navegador calcula el total para mostrarlo, pero **no es de fiar**: alguien podría alterarlo. Por eso la API **vuelve a calcular el total** con su propia copia de precios y marca el pedido si no coincide. El mensaje de WhatsApp también es solo texto, así que la distribuidora confirma siempre el total al responder.

---

## 6. API de pedidos

La API es un servicio aparte del sitio. Recibe los pedidos y cotizaciones y los guarda. No devuelve páginas.

### 6.1 Endpoints

| Método | Ruta | Para qué |
|---|---|---|
| POST | `/api/pedidos` | Guardar un pedido enviado desde el carrito |
| POST | `/api/cotizaciones` | Guardar una cotización |
| POST | `/api/contacto` | Guardar un mensaje de contacto (opcional) |

### 6.2 Qué hace al recibir un pedido

1. Revisa que el dominio de origen sea el del sitio y que no sea spam (campo trampa oculto, límite de envíos por IP, verificación anti-bots tipo Turnstile).
2. Valida los campos y recalcula precios y total con el catálogo vigente.
3. Guarda el pedido con el código recibido (si el código ya existe, no lo duplica).
4. Avisa a la distribuidora (correo, Telegram o fila nueva en una hoja de cálculo).
5. Responde con éxito o con el motivo del error.

### 6.3 Seguridad y fiabilidad

- No guardar datos de pago (no se cobra en línea).
- Limitar tamaño del pedido y cantidad por línea.
- Aceptar solo el origen del sitio (CORS).
- El envío usa un método que sobrevive aunque el cliente cierre la pestaña al abrir WhatsApp.
- Si la API falla, el sitio no muestra error al cliente: el pedido ya salió por WhatsApp.

### 6.4 Dónde puede vivir la API

Cualquiera de estas opciones sirve; la elección es de comodidad y costo:

- Funciones serverless del mismo hosting (Cloudflare Workers, Netlify, Vercel).
- Supabase (base de datos y reglas listas).
- Google Apps Script con una hoja de cálculo: lo más simple para empezar, y el dueño ve los pedidos como filas.

### 6.5 Cómo ve los pedidos la distribuidora

Fuera del sitio, en lo que reciba la API: la tabla de Supabase, la hoja de cálculo o el aviso por Telegram o correo. Si más adelante se necesita un panel (estados, hoja de ruta, saldos de envases), es **otra aplicación aparte** y no parte de la web estática.

---

## 7. Modelo de datos

Hay dos grupos: los **datos del sitio** (archivos que Astro lee al publicar) y los **datos que viajan a la API** (pedido, cotización). En el navegador solo se guarda el carrito y preferencias.

### 7.1 Datos del sitio (se editan y se vuelve a publicar)

#### Negocio

```json
{
  "nombre": "Distribuidora Pachacámac",
  "slug": "distribuidora-pachacamac",
  "contacto": {
    "whatsapp": "51999999999",
    "telefono": "999 999 999",
    "correo": "ventas@ejemplo.pe",
    "direccion": "Av. Ejemplo 123, Pachacámac, Lima"
  },
  "horario": [
    { "dias": ["lun", "mar", "mie", "jue", "vie", "sab"], "desde": "07:00", "hasta": "19:00" }
  ],
  "moneda": "PEN",
  "pedidoMinimoGeneral": 30,
  "horaCorteMismoDia": "12:00",
  "metodosPago": ["efectivo", "yape", "plin", "transferencia"],
  "apiPedidos": "https://api.ejemplo.pe/pedidos",
  "marca": {
    "logo": "logo.svg",
    "colorPrincipal": "#0B7A86",
    "colorAcento": "#D63A22"
  },
  "textos": {
    "titulo": "Distribuidora de agua y gaseosas en Pachacámac",
    "subtitulo": "Venta por mayor y menor con entrega a domicilio"
  },
  "plantillaMensajePedido": "Hola, quiero hacer este pedido:"
}
```

Todo lo propio de cada distribuidora vive aquí. Para otra distribuidora se reemplaza este archivo y los de abajo.

#### Categoría (árbol con subcategorías)

```json
{
  "id": "cat_gaseosas",
  "nombre": "Gaseosas",
  "slug": "gaseosas",
  "padreId": null,
  "orden": 2,
  "imagen": "gaseosas.jpg",
  "descripcion": "Gaseosas al por mayor y menor con entrega a domicilio.",
  "seo": {
    "titulo": "Gaseosas al por mayor en Pachacámac",
    "descripcion": "Compra gaseosas por paquete o caja con delivery."
  }
}
```

```json
{
  "id": "cat_gaseosas_personal",
  "nombre": "Personal (hasta 500 ml)",
  "slug": "personal",
  "padreId": "cat_gaseosas",
  "orden": 1
}
```

`padreId` arma el árbol. Sin padre es de primer nivel.

#### Marca

```json
{
  "id": "marca_ejemplo",
  "nombre": "Marca Ejemplo",
  "slug": "marca-ejemplo",
  "logo": "marca-ejemplo.svg"
}
```

#### Producto con presentaciones y precios por tramos

```json
{
  "id": "prod_gaseosa_500",
  "nombre": "Gaseosa 500 ml",
  "slug": "gaseosa-500-ml",
  "categoriaIds": ["cat_gaseosas", "cat_gaseosas_personal"],
  "marcaId": "marca_ejemplo",
  "descripcion": "Gaseosa en botella personal de 500 ml.",
  "imagenes": ["gaseosa-500-1.jpg", "gaseosa-500-2.jpg"],
  "atributos": { "tamano": "500 ml", "sabor": "Cola", "envase": "Descartable" },
  "etiquetas": ["mas-pedido"],
  "retornable": false,
  "disponible": true,
  "destacado": true,
  "presentaciones": [
    {
      "id": "pres_gaseosa_500_unidad",
      "nombre": "Unidad",
      "unidadesPorPresentacion": 1,
      "sku": "GAS500-U",
      "precios": {
        "minorista": [{ "desde": 1, "precio": 2.50 }],
        "mayorista": [{ "desde": 1, "precio": 2.00 }]
      }
    },
    {
      "id": "pres_gaseosa_500_paquete12",
      "nombre": "Paquete x12",
      "unidadesPorPresentacion": 12,
      "sku": "GAS500-P12",
      "precios": {
        "minorista": [
          { "desde": 1, "precio": 21.00 },
          { "desde": 5, "precio": 19.00 }
        ],
        "mayorista": [
          { "desde": 1, "precio": 19.00 },
          { "desde": 20, "precio": 18.00 }
        ]
      }
    }
  ],
  "complementarios": ["prod_hielo_bolsa", "prod_vasos_descartables"],
  "alternativas": ["prod_gaseosa_15", "prod_gaseosa_3"]
}
```

#### Producto retornable (bidón)

```json
{
  "id": "prod_bidon_20",
  "nombre": "Bidón de agua 20 L",
  "slug": "bidon-agua-20-litros",
  "categoriaIds": ["cat_agua", "cat_agua_bidones"],
  "retornable": true,
  "disponible": true,
  "envase": {
    "deposito": 25.00,
    "canje": "Se recoge el bidón vacío en la siguiente entrega"
  },
  "presentaciones": [
    {
      "id": "pres_bidon_20_unidad",
      "nombre": "Bidón lleno",
      "unidadesPorPresentacion": 1,
      "precios": {
        "minorista": [{ "desde": 1, "precio": 10.00 }],
        "mayorista": [
          { "desde": 1, "precio": 9.00 },
          { "desde": 10, "precio": 8.50 }
        ]
      }
    }
  ]
}
```

#### Zona de reparto

```json
{
  "id": "zona_pachacamac_centro",
  "nombre": "Pachacámac centro",
  "slug": "pachacamac-centro",
  "distritos": ["Pachacámac"],
  "costoEnvio": 3.00,
  "envioGratisDesde": 50.00,
  "pedidoMinimo": 30.00,
  "tiempoEntrega": "Mismo día",
  "diasReparto": ["lun", "mar", "mie", "jue", "vie", "sab"],
  "franjas": ["mañana", "tarde"],
  "seo": {
    "titulo": "Venta de agua en Pachacámac",
    "texto": "Texto propio de la zona para Google."
  }
}
```

#### Segmento de negocio

```json
{
  "id": "seg_bodegas",
  "nombre": "Bodegas",
  "slug": "bodegas",
  "titulo": "Distribuidor de agua y gaseosas para bodegas",
  "texto": "Surtido completo para reponer toda la semana.",
  "productosSugeridos": ["prod_gaseosa_500", "prod_gaseosa_15", "prod_bidon_20"],
  "calculadora": {
    "tamanos": [
      { "nombre": "Bodega pequeña", "sugerencia": [{ "productoId": "prod_gaseosa_500", "presentacionId": "pres_gaseosa_500_paquete12", "cantidad": 5 }] },
      { "nombre": "Bodega grande", "sugerencia": [{ "productoId": "prod_gaseosa_500", "presentacionId": "pres_gaseosa_500_paquete12", "cantidad": 15 }] }
    ]
  }
}
```

#### Reseña (curada por la distribuidora)

```json
{
  "id": "res_007",
  "clienteNombre": "María Q.",
  "segmento": "hogar",
  "texto": "Texto real escrito por el cliente.",
  "puntaje": 5
}
```

Solo se publican reseñas reales. No se escriben reseñas inventadas.

### 7.2 Datos que guarda el navegador del cliente

Solo preferencias y el carrito. Nada sensible.

```json
{
  "modo": "negocio",
  "carrito": {
    "lineas": [
      { "productoId": "prod_gaseosa_500", "presentacionId": "pres_gaseosa_500_paquete12", "cantidad": 6 },
      { "productoId": "prod_bidon_20", "presentacionId": "pres_bidon_20_unidad", "cantidad": 10 }
    ],
    "zonaId": "zona_pachacamac_centro"
  },
  "datosCliente": {
    "nombre": "Rosa Pérez",
    "telefono": "987654321",
    "tipo": "negocio",
    "negocio": "Restaurante El Sabor",
    "ruc": "20000000001",
    "direccion": "Jr. Ejemplo 456",
    "referencia": "Frente al mercado"
  },
  "ultimoPedido": {
    "codigo": "PED-261102-K7F3",
    "fecha": "2026-11-02T18:35:00-05:00",
    "lineas": [
      { "productoId": "prod_gaseosa_500", "presentacionId": "pres_gaseosa_500_paquete12", "cantidad": 6 }
    ]
  }
}
```

El carrito guarda solo ids y cantidades. Los precios se calculan cada vez con los datos publicados.

### 7.3 Pedido que se envía a la API

```json
{
  "codigo": "PED-261102-K7F3",
  "origen": "web",
  "modo": "negocio",
  "cliente": {
    "tipo": "negocio",
    "nombre": "Rosa Pérez",
    "negocio": "Restaurante El Sabor",
    "telefono": "987654321",
    "documento": { "tipo": "RUC", "numero": "20000000001" }
  },
  "lineas": [
    {
      "productoId": "prod_gaseosa_500",
      "presentacionId": "pres_gaseosa_500_paquete12",
      "nombre": "Gaseosa 500 ml · Paquete x12",
      "cantidad": 6,
      "precioUnitario": 19.00,
      "subtotal": 114.00
    }
  ],
  "entrega": {
    "zonaId": "zona_pachacamac_centro",
    "direccion": "Jr. Ejemplo 456",
    "referencia": "Frente al mercado",
    "fecha": "2026-11-03",
    "franja": "mañana"
  },
  "pago": { "metodo": "efectivo", "pagaCon": 200.00 },
  "comprobante": { "tipo": "factura", "ruc": "20000000001" },
  "totales": { "subtotal": 114.00, "descuento": 0.00, "envio": 0.00, "total": 114.00 },
  "notas": "",
  "creadoEn": "2026-11-02T18:35:00-05:00",
  "versionCatalogo": "2026-11-02"
}
```

La línea guarda nombre y precio del momento, para que un cambio de precios posterior no altere pedidos antiguos. `versionCatalogo` permite saber con qué precios se calculó. El sitio solo crea pedidos nuevos; cualquier estado posterior (en preparación, entregado) lo maneja la herramienta que usa la distribuidora.

### 7.4 Respuesta de la API

```json
{ "ok": true, "codigo": "PED-261102-K7F3", "estado": "recibido" }
```

```json
{ "ok": false, "error": "total_no_coincide", "mensaje": "El total no coincide con los precios vigentes." }
```

### 7.5 Cotización que se envía a la API

```json
{
  "codigo": "COT-261102-A9X2",
  "nombre": "Juan Torres",
  "telefono": "999111222",
  "tipoNegocio": "bodega",
  "consumoAproximado": "10 a 30 bultos por semana",
  "detalle": "Gaseosa 500 ml y 1.5 L, agua de 625 ml",
  "zonaId": "zona_manchay",
  "creadoEn": "2026-11-02T17:10:00-05:00"
}
```

### 7.6 Mensaje de WhatsApp generado

El texto se arma desde la plantilla del negocio:

```
Hola Distribuidora Pachacámac, quiero hacer este pedido (PED-261102-K7F3):

• 6 x Gaseosa 500 ml · Paquete x12 = S/ 114.00
• 10 x Bidón de agua 20 L = S/ 85.00

Total: S/ 199.00 (envío gratis)

Nombre: Rosa Pérez (Restaurante El Sabor)
Zona: Pachacámac centro
Dirección: Jr. Ejemplo 456, frente al mercado
Entrega: 03/11, mañana
Pago: efectivo, paga con S/ 200
Comprobante: factura, RUC 20000000001

La disponibilidad y el total se confirman al responderte.
```

### 7.7 Relaciones entre datos del sitio

```
Categoria 1──* Categoria (padreId)
Categoria *──* Producto
Marca     1──* Producto
Producto  1──* Presentacion 1──* Tramo de precio (por lista)
Segmento  *──* Producto (sugeridos)
Zona      1──* Pedido (por id, en la API)
```

---

## 8. Cómo se arma con Astro (sin código)

### 8.1 Qué se genera al publicar

- Las páginas de categorías, subcategorías, productos, zonas y segmentos se crean desde los datos de la sección 7.1.
- El buscador se genera al publicar a partir de las páginas (por ejemplo con Pagefind), sin servidor.
- Los datos estructurados de negocio local y de producto se incluyen en cada página.
- Las imágenes se optimizan y se entregan en formato moderno (WebP o AVIF).

### 8.2 Dónde sí hay JavaScript (y solo ahí)

La mayor parte de la web es HTML sin JavaScript. Se usan "islas" pequeñas, cargadas solo cuando hacen falta.

| Isla | Qué hace | Cuándo se carga |
|---|---|---|
| Carrito (estado y panel) | Guarda líneas, calcula tramos y total, abre el panel | En todas las páginas, mínimo posible |
| Botón Agregar y selector de cantidad | Modifica el carrito | Al ser visible |
| Interruptor Hogar / Negocio | Cambia los precios mostrados | En catálogo, categoría y ficha |
| Filtros y orden del catálogo | Filtra la lista en el navegador | Solo en catálogo y categorías |
| Pedido y envío (`/carrito`) | Formulario, validación, mensaje de WhatsApp, envío a la API | Solo en `/carrito` |
| Pedido rápido en tabla | Cantidades por producto | Solo en `/negocios` |
| Calculadora de consumo | Propone lista de compra | Solo en páginas de segmento |
| Cotización | Formulario y envío a WhatsApp y API | Solo en `/cotizar` |
| Indicador de horario | Muestra "Abierto ahora" | En inicio y contacto |

El estado del carrito se comparte entre islas con una librería muy pequeña de estado, y se guarda en el navegador.

### 8.3 Cómo se actualiza el contenido

- Los datos viven en archivos (JSON o similar) dentro del proyecto, o en una hoja de cálculo o un CMS ligero que los exporta.
- Al cambiar precios o productos se vuelve a publicar. Se puede automatizar con un aviso del CMS o de la hoja de cálculo al hosting.
- El hosting estático (Cloudflare Pages, Netlify, Vercel) publica en minutos.

### 8.4 Presupuesto de JavaScript

Meta sugerida: las páginas informativas, **sin JavaScript propio salvo el carrito mínimo**, y cada isla extra solo donde se usa. Esto mantiene la web rápida en celulares modestos y en conexiones lentas, que es lo que más pesa en Google y en la conversión.

---

## 9. Ideas modernas e innovadoras (compatibles con un sitio estático)

1. **Modo Hogar / Negocio:** un interruptor que cambia precios, textos y formato de compra. Un solo catálogo sirve a los dos públicos.
2. **Precio por volumen en vivo:** el carrito avisa cuánto se ahorra al agregar una unidad más para llegar al siguiente tramo.
3. **Repetir último pedido en un toque:** el último pedido queda guardado en el navegador. Sin cuenta, sin contraseña.
4. **Enlace de carrito compartible:** la distribuidora le manda al cliente por WhatsApp un enlace que ya trae el carrito armado ("tu pedido de siempre"). El cliente solo revisa y envía. Funciona en un sitio estático porque el carrito va dentro del propio enlace.
5. **Pedido rápido en tabla** para bodegas y restaurantes.
6. **Calculadora de consumo** por tipo y tamaño de negocio, que funciona también como gancho de cotización.
7. **Pedir un solo producto por WhatsApp** desde cada tarjeta, con el mensaje ya armado.
8. **Indicador "Abierto ahora, entrega hoy hasta las 19:00"** según hora de corte y zona.
9. **Envío que no pierde ventas:** el pedido sale por WhatsApp primero y la API se sincroniza en paralelo.
10. **Buscador instantáneo** que funciona sin servidor.
11. **Catálogo imprimible o en PDF** generado al publicar, para mandar por WhatsApp a negocios.
12. **Instalable en el celular (PWA)**, opcional, para que el cliente abra la web como una app.
13. **Imágenes para compartir (Open Graph)** por producto y categoría, para que los enlaces enviados por WhatsApp se vean bien.

Fuera del alcance por depender de servidor o cuentas: seguimiento del pedido, entregas recurrentes, recordatorios automáticos, rutas de reparto, saldo de envases visible al cliente.

---

## 10. Fases de construcción

**Fase 1: salir a vender**

- Datos del negocio, categorías, productos, zonas.
- Inicio, catálogo, categorías y subcategorías, ficha de producto.
- Carrito con tramos, mínimo y envío.
- Envío del pedido por WhatsApp y a la API.
- Cotización.
- Zonas, nosotros y contacto.
- SEO local: páginas por zona, categoría y segmento, datos estructurados.

**Fase 2: vender más fácil**

- Pedido rápido en tabla y calculadora de consumo.
- Repetir último pedido y enlace de carrito compartible.
- Buscador instantáneo.
- Indicador de horario.
- Imágenes para compartir.

**Fase 3: comodidad del dueño**

- Edición de precios y productos desde una hoja de cálculo o CMS, con publicación automática.
- Catálogo en PDF.
- PWA.
- Si hace falta, una herramienta aparte para ver pedidos y llevar estados y envases (no parte del sitio).

---

## 11. SEO local: estructura de contenido

Páginas a crear, cada una con texto propio (no copiado entre páginas):

- Venta de agua en Pachacámac
- Distribuidora de gaseosas en Pachacámac
- Venta de bidones de agua a domicilio
- Distribuidor de bebidas para restaurantes
- Distribuidor de bebidas para bodegas
- Una página por cada zona de reparto
- Una página por cada categoría y subcategoría

Además:

- Títulos y descripciones únicos por página.
- Preguntas frecuentes en las páginas clave, con datos estructurados.
- Ficha de Google Business Profile completa, con fotos reales y reseñas.
- Carga muy rápida en celular (lo que más aprovecha Astro).

Reparto de esfuerzo sugerido: 50 % SEO local, 30 % conversión (WhatsApp, carrito, formularios), 15 % catálogo, 5 % diseño visual.

---

## 12. Qué medir

Con una herramienta de analítica ligera (Plausible, GA4 o similar) se registran estos eventos:

- Producto agregado al carrito.
- Clic en *Enviar pedido por WhatsApp*.
- Pedido recibido en la API.
- Cotización enviada.
- Clic en botones de WhatsApp sueltos.
- Visitas por página y desde dónde llegan.

Con la API se mide además: pedidos por semana, valor promedio, productos y zonas con más ventas, y pedidos repetidos por teléfono.

---

## 13. Resumen de lo que se eliminó respecto a la versión anterior

| Eliminado | Motivo |
|---|---|
| `/cuenta`, `/cuenta/pedidos`, `/cuenta/suscripciones` | Requieren usuarios y datos en vivo; no encajan en un sitio estático |
| `/pedido` y `/pedido/{codigo}` | El pedido se arma y envía desde `/carrito`; no hay páginas por pedido |
| Seguimiento con estados y avisos | Depende de datos que cambian; se maneja fuera del sitio |
| Entregas recurrentes y recordatorios | Requieren cuenta y servidor |
| `/blog` | Se retira del alcance |
| Panel de administración dentro del sitio | Si se necesita, es una aplicación aparte |
| Stock en vivo y saldo de envases en la web | Se manejan fuera del sitio |
| Entidades Cliente, Carrito en base de datos, Suscripción | Sin cuentas, el cliente vive en el navegador y en el pedido |