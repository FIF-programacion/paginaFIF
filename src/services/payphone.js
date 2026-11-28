// Pasarela de pago Payphone — PENDIENTE DE IMPLEMENTAR.
//
// Flujo previsto (Botón de Pagos de Payphone):
// 1. El checkout llama a createPayphoneCheckout(order).
// 2. Un endpoint propio en el servidor (p. ej. Cloudflare Pages Function `/api/payphone/prepare`)
//    llama a Payphone `POST /api/button/Prepare` con el token del comercio. El token es secreto:
//    NUNCA debe ir en el frontend ni en variables VITE_*.
//    Montos en centavos: amount = amountWithoutTax + amountWithTax + tax (+ service + tip).
//    Se envían clientTransactionId (único, máx. 50 caracteres), responseUrl y cancellationUrl.
// 3. Payphone devuelve una URL de pago (payWithCard) y redirigimos al comprador.
// 4. Payphone regresa a responseUrl (/dona/camisetas/resultado?id=...&clientTransactionId=...).
// 5. La página de resultado llama a confirmPayphonePayment(), que en el servidor llama a
//    `POST /api/button/V2/Confirm`. Solo ese paso confirma si el pago fue aprobado.

export const PAYPHONE_READY = false;

export const PAYPHONE_RETURN_PATH = "/dona/camisetas/resultado";

function newTransactionId() {
  const random = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `FIF-${Date.now()}-${random}`;
}

/**
 * Arma el pedido con los campos que pide Payphone (montos en centavos).
 * Desglose de IVA pendiente: por ahora todo el monto va como amountWithoutTax.
 */
export function buildPayphoneOrder({ items, total, buyer }) {
  const cents = Math.round(total * 100);
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  return {
    clientTransactionId: newTransactionId(),
    amount: cents,
    amountWithoutTax: cents,
    amountWithTax: 0,
    tax: 0,
    currency: "USD",
    reference: `Camisetas FIF (${items.reduce((sum, item) => sum + item.qty, 0)} u.)`,
    email: buyer.email,
    phoneNumber: buyer.phone,
    documentId: buyer.documentId,
    responseUrl: `${origin}${PAYPHONE_RETURN_PATH}`,
    cancellationUrl: `${origin}${PAYPHONE_RETURN_PATH}?cancelado=1`,
    items: items.map(({ productId, name, size, qty, price }) => ({ productId, name, size, qty, unitPriceCents: Math.round(price * 100) })),
    buyer,
  };
}

/** Devuelve { ok: true, redirectUrl } cuando la integración esté lista. */
export async function createPayphoneCheckout(order) {
  // TODO: reemplazar por fetch("/api/payphone/prepare", { method: "POST", body: JSON.stringify(order) })
  void order;
  return { ok: false, error: "La pasarela de pago todavía no está activa. Muy pronto podrás pagar con Payphone." };
}

/** Devuelve { ok: true, status: "approved" | "rejected" | "pending" } cuando la integración esté lista. */
export async function confirmPayphonePayment({ id, clientTransactionId }) {
  // TODO: reemplazar por fetch("/api/payphone/confirm", { method: "POST", body: JSON.stringify({ id, clientTransactionId }) })
  void id;
  void clientTransactionId;
  return { ok: false, status: "pending", error: "La confirmación con Payphone todavía no está implementada." };
}
