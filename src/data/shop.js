// Plantilla: reemplaza nombres, precios, colores e imágenes por los productos reales.
// Si un producto tiene `image` (ruta en /public/images), se muestra en lugar del dibujo.
export const SHOP_SIZES = ["XS", "S", "M", "L", "XL"];

export const SHOP_PRODUCTS = [
  {
    id: "clasica-azul",
    name: "Camiseta clásica FIF",
    price: 15,
    color: "#1e5bb8",
    print: "#e8c36a",
    description: "Algodón suave con el logo de la fundación al frente.",
  },
  {
    id: "mentes-curiosas",
    name: "Mentes curiosas",
    price: 18,
    color: "#10233a",
    print: "#e8c36a",
    description: "Edición especial de los talleres de matemáticas y ciencia.",
  },
  {
    id: "familias-dorada",
    name: "Familias FIF",
    price: 18,
    color: "#e8c36a",
    print: "#10233a",
    description: "Para compartir en familia en las actividades de la comunidad.",
  },
  {
    id: "voluntario-blanca",
    name: "Voluntariado",
    price: 15,
    color: "#ffffff",
    print: "#1e5bb8",
    description: "La camiseta de quienes acompañan los programas como voluntarios.",
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
