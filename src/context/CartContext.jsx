import { createContext, useContext, useEffect, useMemo, useState } from "react";

// Carrito de la tienda de camisetas. Vive en sessionStorage: sobrevive a recargas y al
// regreso desde la pasarela de pago, y se borra al cerrar la pestaña.
const STORAGE_KEY = "fif-cart";
const CartContext = createContext(null);

function readStored() {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(readStored);

  useEffect(() => {
    try {
      if (items.length) window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      else window.sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // Sin almacenamiento disponible (modo privado estricto): el carrito vive solo en memoria.
    }
  }, [items]);

  // Acciones estables (no cambian entre renders): seguras en dependencias de useEffect.
  const actions = useMemo(
    () => ({
      add(product, size) {
        const key = `${product.id}-${size}`;
        setItems((current) => {
          const found = current.find((item) => item.key === key);
          if (found) return current.map((item) => (item.key === key ? { ...item, qty: item.qty + 1 } : item));
          return [...current, { key, productId: product.id, size, qty: 1, name: product.name, price: product.price }];
        });
      },
      changeQty(key, delta) {
        setItems((current) =>
          current
            .map((item) => (item.key === key ? { ...item, qty: item.qty + delta } : item))
            .filter((item) => item.qty > 0),
        );
      },
      remove(key) {
        setItems((current) => current.filter((item) => item.key !== key));
      },
      clear() {
        setItems((current) => (current.length ? [] : current));
      },
    }),
    [],
  );

  const value = useMemo(
    () => ({
      items,
      count: items.reduce((sum, item) => sum + item.qty, 0),
      total: items.reduce((sum, item) => sum + item.qty * item.price, 0),
      ...actions,
    }),
    [items, actions],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart debe usarse dentro de <CartProvider>.");
  return context;
}
