import { useState } from "react";
import { Link } from "react-router-dom";
import { SiteFooter } from "../components/SiteFooter";
import { CartLines, CartTotal, ShopHeader } from "../components/ShopParts";
import { useCart } from "../context/CartContext";
import { DELIVERY_OPTIONS } from "../data/shop";
import { buildPayphoneOrder, createPayphoneCheckout } from "../services/payphone";
import "./Shop.css";

const EMPTY_BUYER = { fullName: "", email: "", phone: "", documentId: "", delivery: "retiro", address: "", notes: "" };

function validate(buyer) {
  if (!buyer.fullName.trim()) return "Escribe tus nombres y apellidos.";
  if (!/^\S+@\S+\.\S+$/.test(buyer.email.trim())) return "Escribe un correo válido.";
  if (buyer.phone.replace(/\D/g, "").length < 9) return "Escribe un número celular válido.";
  if (buyer.documentId.replace(/\D/g, "").length < 10) return "Escribe tu cédula o RUC (10 o 13 dígitos).";
  if (buyer.delivery === "envio" && !buyer.address.trim()) return "Escribe la dirección de entrega.";
  return "";
}

export default function ShopCheckout() {
  const { items, total, count } = useCart();
  const [buyer, setBuyer] = useState(EMPTY_BUYER);
  const [accepted, setAccepted] = useState(false);
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  const set = (name, value) => setBuyer((current) => ({ ...current, [name]: value }));

  const pay = async (event) => {
    event.preventDefault();
    const problem = validate(buyer);
    if (problem) {
      setStatus(problem);
      return;
    }
    if (!accepted) {
      setStatus("Acepta los términos y la política de reembolsos para continuar.");
      return;
    }
    setBusy(true);
    setStatus("");
    const order = buildPayphoneOrder({ items, total, buyer: { ...buyer, fullName: buyer.fullName.trim(), email: buyer.email.trim() } });
    const result = await createPayphoneCheckout(order);
    setBusy(false);
    if (result.ok && result.redirectUrl) {
      window.location.assign(result.redirectUrl);
      return;
    }
    setStatus(result.error || "No pudimos iniciar el pago. Intenta de nuevo en unos minutos.");
  };

  if (!count) {
    return (
      <div className="shop-page">
        <ShopHeader backTo="/dona/camisetas" backLabel="← Seguir comprando" />
        <main className="shop-checkout-empty">
          <h1>Tu carrito está vacío</h1>
          <p>Agrega camisetas antes de ir al checkout.</p>
          <Link to="/dona/camisetas" className="shop-submit">Ver camisetas</Link>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="shop-page">
      <ShopHeader backTo="/dona/camisetas" backLabel="← Seguir comprando" />

      <section className="shop-hero shop-hero--compact">
        <p className="shop-kicker">Checkout</p>
        <h1>Finaliza tu compra</h1>
      </section>

      <main className="shop-layout shop-layout--checkout">
        <form className="shop-checkout-form" onSubmit={pay} noValidate>
          <fieldset>
            <legend>Datos del comprador</legend>
            <label htmlFor="co-name">Nombres y apellidos</label>
            <input id="co-name" autoComplete="name" value={buyer.fullName} onChange={(event) => set("fullName", event.target.value)} />
            <div className="shop-field-row">
              <div>
                <label htmlFor="co-email">Correo electrónico</label>
                <input id="co-email" type="email" autoComplete="email" value={buyer.email} onChange={(event) => set("email", event.target.value)} />
              </div>
              <div>
                <label htmlFor="co-phone">Número celular</label>
                <input id="co-phone" type="tel" autoComplete="tel" placeholder="09XXXXXXXX" value={buyer.phone} onChange={(event) => set("phone", event.target.value)} />
              </div>
            </div>
            <label htmlFor="co-doc">Cédula o RUC (para la factura)</label>
            <input id="co-doc" inputMode="numeric" value={buyer.documentId} onChange={(event) => set("documentId", event.target.value)} />
          </fieldset>

          <fieldset>
            <legend>Entrega</legend>
            {DELIVERY_OPTIONS.map((option) => (
              <label key={option.id} className="shop-radio">
                <input
                  type="radio"
                  name="delivery"
                  value={option.id}
                  checked={buyer.delivery === option.id}
                  onChange={() => set("delivery", option.id)}
                />
                <span>{option.label}</span>
              </label>
            ))}
            {buyer.delivery === "envio" && (
              <>
                <label htmlFor="co-address">Dirección de entrega</label>
                <textarea id="co-address" autoComplete="street-address" value={buyer.address} onChange={(event) => set("address", event.target.value)} />
              </>
            )}
            <label htmlFor="co-notes">Notas (opcional)</label>
            <textarea id="co-notes" value={buyer.notes} onChange={(event) => set("notes", event.target.value)} />
          </fieldset>

          <label className="shop-check">
            <input type="checkbox" checked={accepted} onChange={(event) => setAccepted(event.target.checked)} />
            <span>
              Acepto los <Link to="/legal/terminos">términos</Link> y la{" "}
              <Link to="/legal/reembolsos">política de reembolsos</Link>.
            </span>
          </label>

          {status && <p role="status" className="shop-status">{status}</p>}

          <button type="submit" className="shop-submit shop-pay" disabled={busy}>
            {busy ? "Conectando con Payphone…" : "Pagar con Payphone"}
          </button>
          <p className="shop-note shop-note--dark">
            Serás redirigido a Payphone para pagar con tarjeta de forma segura. El sitio de la
            fundación no ve ni guarda los datos de tu tarjeta.
          </p>
        </form>

        <aside className="shop-cart">
          <h2>Resumen</h2>
          <CartLines editable={false} />
          <CartTotal />
          <Link to="/dona/camisetas#carrito" className="shop-edit-cart">Editar carrito</Link>
        </aside>
      </main>

      <SiteFooter />
    </div>
  );
}
