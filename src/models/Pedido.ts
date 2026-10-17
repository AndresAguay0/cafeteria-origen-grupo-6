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
    }
    this.id = id;
    this.items = items;
    this.estado = estado;
  }
}