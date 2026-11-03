/**
 * Mock del endpoint /api/cotizaciones para desarrollo/preview.
 * Valida la cotización contra los datos JSON del sitio y recalcula el total.
 */
import type { APIRoute } from 'astro';
import productsRaw from '../../tenant/data/products.json';

const products = productsRaw as any[];

function priceFor(presentation: any, qty: number, mode: 'retail' | 'wholesale') {
  const tiers = presentation[`${mode}Tiers`] ?? [];
  const applicable = [...tiers].sort((a, b) => a.minQty - b.minQty).reverse().find((t) => t.minQty <= qty);
  if (!applicable) return null;
  return applicable.price;
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const lines = body.lines ?? [];
    const mode = body.tipoNegocio === 'negocio' ? 'wholesale' : 'retail';

    let subtotal = 0;
    for (const line of lines) {
      const product = products.find((p) => p.id === line.productoId);
      if (!product) {
        return new Response(JSON.stringify({ ok: false, error: 'total_no_coincide', mensaje: `Producto no encontrado: ${line.productoId}` }), { status: 400, headers: { 'Content-Type': 'application/json' } });
      }
      const presentation = product.presentations?.find((pr: any) => pr.id === line.presentacionId);
      if (!presentation) {
        return new Response(JSON.stringify({ ok: false, error: 'total_no_coincide', mensaje: `Presentación no encontrada: ${line.presentacionId}` }), { status: 400, headers: { 'Content-Type': 'application/json' } });
      }
      const price = priceFor(presentation, line.cantidad, mode);
      const priceOther = priceFor(presentation, line.cantidad, mode === 'retail' ? 'wholesale' : 'retail');
      if (Math.abs(price - line.precioUnitario) > 0.001 && Math.abs(priceOther - line.precioUnitario) > 0.001) {
        return new Response(JSON.stringify({ ok: false, error: 'total_no_coincide', mensaje: `Precio no coincide para ${line.productoId}` }), { status: 400, headers: { 'Content-Type': 'application/json' } });
      }
      subtotal += (Math.abs(price - line.precioUnitario) < 0.001 ? price : priceOther) * line.cantidad;
    }

    if (Math.abs(subtotal - body.totales.total) > 0.01) {
      return new Response(JSON.stringify({ ok: false, error: 'total_no_coincide', mensaje: 'El total no coincide con los precios vigentes.' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    return new Response(JSON.stringify({ ok: true, codigo: body.codigo, estado: 'recibido' }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: 'total_no_coincide', mensaje: 'Error validando la cotización.' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }
};
