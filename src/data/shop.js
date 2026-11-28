// Si un producto tiene `image` (ruta en /public/images), se muestra la foto; si no, un dibujo
// de camiseta con los colores `color` y `print`.
export const SHOP_SIZES = ["S", "M", "L"];

export const SHOP_PRODUCTS = [
  {
    id: "infifnito",
    name: "Camiseta INFIFNITO",
    // Precio provisional: confirmar el precio real antes de abrir la tienda.
    price: 15,
    image: "/images/camiseta-infifnito.png",
    description: "Camiseta blanca con la serie del coseno al frente y a INFIFNITO en la espalda.",
  },
];

export const DELIVERY_OPTIONS = [
  { id: "retiro", label: "Retiro en la fundación (Quito)" },
  { id: "envio", label: "Envío a domicilio (costo y tiempo se coordinan después del pago)" },
];

export function findProduct(id) {
  return SHOP_PRODUCTS.find((product) => product.id === id);
}

export function formatMoney(value) {
  return `$${Number(value).toFixed(2)}`;
}
