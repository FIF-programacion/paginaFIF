import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { SiteFooter } from "../components/SiteFooter";
import { ShopHeader } from "../components/ShopParts";
import { useCart } from "../context/CartContext";
import { ORG } from "../data/org";
import { confirmPayphonePayment } from "../services/payphone";
import "./Shop.css";

const MESSAGES = {
  checking: { title: "Confirmando tu pago…", text: "Esto toma unos segundos. No cierres esta página." },
  approved: { title: "¡Gracias por tu compra!", text: "Tu pago fue aprobado. Te escribiremos al correo y al celular para coordinar la entrega." },
  rejected: { title: "El pago no se completó", text: "Payphone no aprobó la transacción. Tu carrito sigue guardado para que intentes de nuevo." },
  cancelled: { title: "Pago cancelado", text: "Cancelaste el pago. Tu carrito sigue guardado." },
  pending: { title: "Pago en revisión", text: "Aún no pudimos confirmar el pago. Si se hizo un cobro, escríbenos con tu número de transacción." },
};

export default function ShopResult() {
  const [params] = useSearchParams();
  const { clear } = useCart();
  const id = params.get("id");
  const clientTransactionId = params.get("clientTransactionId");
  const cancelled = params.get("cancelado") === "1";
  const [state, setState] = useState(cancelled ? "cancelled" : id ? "checking" : "pending");

  useEffect(() => {
    if (cancelled || !id) return undefined;
    let alive = true;
    confirmPayphonePayment({ id, clientTransactionId }).then((result) => {
      if (!alive) return;
      const status = result.ok ? result.status : "pending";
      setState(status);
      if (status === "approved") clear();
    });
    return () => {
      alive = false;
    };
  }, [cancelled, id, clientTransactionId, clear]);

  const message = MESSAGES[state] || MESSAGES.pending;

  return (
    <div className="shop-page">
      <ShopHeader backTo="/dona/camisetas" backLabel="← Volver a la tienda" />
      <main className="shop-checkout-empty">
        <h1>{message.title}</h1>
        <p>{message.text}</p>
        {clientTransactionId && <p className="shop-note shop-note--dark">Transacción: {clientTransactionId}</p>}
        {state === "approved" ? (
          <Link to="/" className="shop-submit">Volver al inicio</Link>
        ) : (
          <Link to="/dona/camisetas/checkout" className="shop-submit">Volver al checkout</Link>
        )}
        <p className="shop-note shop-note--dark">¿Dudas? {ORG.email} · {ORG.phone}</p>
      </main>
      <SiteFooter />
    </div>
  );
}
