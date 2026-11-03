# Objetivo
Completar el MVP de la distribuidora según `doc/idea.md` y `doc/plantilla.md`: API mock activable por bandera, subcategorías, buscador instantáneo, imágenes placeholder reales, datos del cliente guardados, indicador de horario, mapa de zonas, complementarios/alternativas, filtros catálogo, tramos en vivo en carrito, sugerencias, panel lateral, barra inferior móvil, datos estructurados producto y Open Graph.

## Specs
- S1: API mock `/api/pedidos` y `/api/cotizaciones` activable mediante bandera en `tenant.config`; `NullOrderGateway`/`HttpOrderGateway` seleccionado por bandera; mock usa los datos JSON del sitio para validar y recalcular precios.
- S2: Ruta `/productos/{categoria}/{subcategoria}` con `getStaticPaths` y filtrado por subcategoría.
- S3: Buscador instantáneo con sugerencias desde índice estático generado al publicar (sin servidor, sin que core importe tenant).
- S4: Imágenes placeholder reales (SVG) para productos, categorías y zonas en lugar de placeholders de texto.
- S5: Datos del cliente guardados en localStorage para la próxima compra (nombre, teléfono, tipo, negocio, RUC, dirección, referencia).
- S6: Indicador "Abierto ahora, entrega hoy hasta HH:MM" calculado en el navegador con hora actual y hora de corte.
- S7: Mapa simple (enlace a mapa externo) en página de zona y contacto.
- S8: Ficha de producto con "Se compra junto con" (complementarios) y "Alternativas".
- S9: Catálogo con filtros subcategoría, marca, tamaño, tipo envase, solo disponibles; orden "más pedidos"; vista tabla; selector de cantidad en tarjeta.
- S10: Carrito con precio por tramos en vivo, ahorro al siguiente tramo, barra pedido mínimo y envío gratis, sugerencias "Muchos clientes también llevan".
- S11: Panel lateral de carrito accesible desde cualquier página + página completa `/carrito`.
- S12: Barra inferior móvil con resumen del carrito y botón WhatsApp flotante.
- S13: Datos estructurados de Product en página de producto; Open Graph por producto/categoría.

## Tasks
| ID | Specs | Route | Commit |
|----|-------|-------|--------|
| T1 | S1 | inline | feat: api mock pedidos y cotizaciones con bandera ✅ |
| T2 | S2 | inline | feat: rutas de subcategoría |
| T3 | S3 | inline | feat: buscador instantáneo estático |
| T4 | S4 | inline | feat: imágenes placeholder SVG |
| T5 | S5 | inline | feat: datos cliente guardados en localStorage |
| T6 | S6 | inline | feat: indicador horario abierto ahora |
| T7 | S7 | inline | feat: mapa simple en zonas y contacto |
| T8 | S8 | inline | feat: complementarios y alternativas en ficha |
| T9 | S9 | inline | feat: filtros, orden, vista tabla y cantidad en catálogo |
| T10 | S10 | inline | feat: tramos en vivo y sugerencias en carrito |
| T11 | S11 | inline | feat: panel lateral carrito desde cualquier página |
| T12 | S12 | inline | feat: barra inferior móvil y WhatsApp flotante |
| T13 | S13 | inline | feat: datos estructurados producto y Open Graph |

## Log
L1: User request: completar todo lo que falta según doc/idea.md y doc/plantilla.md, empezando por API mock con bandera activable usando datos JSON existentes.
