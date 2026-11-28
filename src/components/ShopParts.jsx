import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { formatMoney } from "../data/shop";

export function ShirtArt({ color, print, className = "shop-shirt" }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true">
      <path
        d="M70 30 L40 42 L14 78 L42 94 L52 80 L52 176 L148 176 L148 80 L158 94 L186 78 L160 42 L130 30 Q100 52 70 30 Z"
        fill={color}
        stroke="#10233a"
        strokeOpacity="0.18"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <text x="100" y="128" textAnchor="middle" fontFamily="Fredoka, sans-serif" fontWeight="700" fontSize="34" fill={print}>
        FIF
      </text>
    </svg>
  );
}

export function ShopHeader({ backTo = "/#dona", backLabel = "← Volver" }) {
  const { count } = useCart();
  return (
    <header className="shop-top">
      <Link to={backTo} className="shop-back">{backLabel}</Link>
      <Link to="/dona/camisetas#carrito" className="shop-cart-pill">Carrito · {count}</Link>
    </header>
  );
}

export function CartLines({ editable = true }) {
  const { items, changeQty, remove } = useCart();

  if (!items.length) return <p className="shop-empty">Todavía no agregas camisetas.</p>;

  return (
    <ul className="shop-lines">
      {items.map((item) => (
        <li key={item.key}>
          <div>
            <strong>{item.name}</strong>
            <span>Talla {item.size} · {formatMoney(item.price)}</span>
            {editable && (
              <button type="button" className="shop-remove" onClick={() => remove(item.key)}>Quitar</button>
            )}
          </div>
          {editable ? (
            <div className="shop-qty">
              <button type="button" aria-label={`Quitar una ${item.name}`} onClick={() => changeQty(item.key, -1)}>−</button>
              <span>{item.qty}</span>
              <button type="button" aria-label={`Agregar una ${item.name}`} onClick={() => changeQty(item.key, 1)}>+</button>
            </div>
          ) : (
            <span className="shop-line-total">{item.qty} × {formatMoney(item.price)}</span>
          )}
        </li>
      ))}
    </ul>
  );
}

export function CartTotal() {
  const { total } = useCart();
  return (
    <p className="shop-total">
      <span>Total</span>
      <strong>{formatMoney(total)}</strong>
    </p>
  );
}
