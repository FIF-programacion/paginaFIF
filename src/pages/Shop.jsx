import { useState } from "react";
import { Link } from "react-router-dom";
import { SiteFooter } from "../components/SiteFooter";
import { CartLines, CartTotal, ShirtArt, ShopHeader } from "../components/ShopParts";
import { useCart } from "../context/CartContext";
import { SHOP_PRODUCTS, SHOP_SIZES, formatMoney } from "../data/shop";
import "./Shop.css";

function ProductCard({ product }) {
  const { add } = useCart();
  const [size, setSize] = useState("M");
  const [added, setAdded] = useState(false);

  return (
    <article className="shop-card">
      <div className={product.image ? "shop-card-media shop-card-media--photo" : "shop-card-media"}>
        {product.image ? (
          <img src={product.image} alt={`${product.name}, vista frontal y espalda`} />
        ) : (
          <ShirtArt color={product.color} print={product.print} />
        )}
      </div>
      <div className="shop-card-body">
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        <p className="shop-price">{formatMoney(product.price)}</p>
        <div className="shop-sizes" role="group" aria-label={`Talla de ${product.name}`}>
          {SHOP_SIZES.map((item) => (
            <button key={item} type="button" className={item === size ? "is-on" : ""} onClick={() => setSize(item)}>
              {item}
            </button>
          ))}
        </div>
        <button
          type="button"
          className="shop-add"
          onClick={() => {
            add(product, size);
            setAdded(true);
            window.setTimeout(() => setAdded(false), 1400);
          }}
        >
          {added ? "¡Agregada!" : "Agregar al carrito"}
        </button>
      </div>
    </article>
  );
}

export default function Shop() {
  const { count } = useCart();

  return (
    <div className="shop-page">
      <ShopHeader />

      <section className="shop-hero">
        <p className="shop-kicker">Tienda solidaria</p>
        <h1>Camisetas FIF</h1>
        <p>
          Cada camiseta apoya los talleres, becas y programas de la fundación. Elige tus modelos y
          tallas, revisa tu carrito y paga de forma segura con Payphone.
        </p>
      </section>

      <main className="shop-layout">
        <section className="shop-grid" aria-label="Productos">
          {SHOP_PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </section>

        <aside className="shop-cart" id="carrito">
          <h2>Tu carrito</h2>
          <CartLines />
          <CartTotal />
          {count > 0 ? (
            <Link to="/dona/camisetas/checkout" className="shop-submit">Ir al checkout</Link>
          ) : (
            <span className="shop-submit is-disabled" aria-disabled="true">Ir al checkout</span>
          )}
          <p className="shop-note">Pago con tarjeta mediante Payphone. El sitio no guarda los datos de tu tarjeta.</p>
        </aside>
      </main>

      <SiteFooter />
    </div>
  );
}
