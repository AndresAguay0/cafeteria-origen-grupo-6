export type ItemPedido = {
  productoId: number;
  cantidad: number;
};

export class Pedido {
  id: number;
  items: ItemPedido[];
  estado: string;

  constructor(
    id: number,
    items: ItemPedido[],
    estado: string
  ) {
    for (const item of items) {
        if (item.cantidad <= 0) {
            throw new Error("La cantidad debe ser mayor a cero");
        }

        if (item.productoId <= 0) {
            throw new Error("El productoId debe ser mayor a cero");
        }
    }
    this.id = id;
    this.items = items;
    this.estado = estado;
  }

  calcularTotal(productos: { id: number; calcularPrecio: () => number }[]): number {
  let total = 0;

  for (const item of this.items) {
      const producto = productos.find(p => p.id === item.productoId);

      if (!producto) {
      throw new Error("Producto no encontrado");
      }

      total += producto.calcularPrecio() * item.cantidad;
  }

  return total;
  }

}