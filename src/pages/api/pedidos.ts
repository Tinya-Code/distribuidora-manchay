/**
 * Mock del endpoint /api/pedidos para desarrollo/preview.
 * Valida el pedido contra los datos JSON del sitio (productos, zonas, precios)
 * y recalcula el total. Si no coincide, responde 400 con total_no_coincide.
 * Si coincide, responde 200 con el código recibido.
 *
 * Activado mediante la bandera features.apiMock de tenant.config.
 */
import type { APIRoute } from 'astro';
import productsRaw from '../../tenant/data/products.json';
import zonesRaw from '../../tenant/data/zones.json';

const products = productsRaw as any[];
const zones = zonesRaw as any[];

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
    const zoneId = body.entrega?.zonaId;
    const mode = body.modo === 'negocio' ? 'wholesale' : 'retail';

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
      if (price === null) {
        return new Response(JSON.stringify({ ok: false, error: 'total_no_coincide', mensaje: `Sin precio para ${line.productoId}` }), { status: 400, headers: { 'Content-Type': 'application/json' } });
      }
      // Permitir que coincida con retail o wholesale (el navegador no envía el modo fiable)
      const priceOther = priceFor(presentation, line.cantidad, mode === 'retail' ? 'wholesale' : 'retail');
      const unitPrice = Math.abs(price - line.precioUnitario) < 0.001 || Math.abs(priceOther - line.precioUnitario) < 0.001 ? line.precioUnitario : price;
      if (Math.abs(unitPrice - line.precioUnitario) > 0.001) {
        return new Response(JSON.stringify({ ok: false, error: 'total_no_coincide', mensaje: `Precio no coincide para ${line.productoId}` }), { status: 400, headers: { 'Content-Type': 'application/json' } });
      }
      subtotal += unitPrice * line.cantidad;
    }

    const zone = zones.find((z) => z.id === zoneId);
    let shipping = 0;
    if (zone) {
      const freeFrom = zone.envioGratisDesde;
      shipping = freeFrom && subtotal >= freeFrom ? 0 : zone.costoEnvio;
    }

    const total = subtotal + shipping;
    if (Math.abs(total - body.totales.total) > 0.01) {
      return new Response(JSON.stringify({ ok: false, error: 'total_no_coincide', mensaje: 'El total no coincide con los precios vigentes.' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    return new Response(JSON.stringify({ ok: true, codigo: body.codigo, estado: 'recibido' }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: 'total_no_coincide', mensaje: 'Error validando el pedido.' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }
};
