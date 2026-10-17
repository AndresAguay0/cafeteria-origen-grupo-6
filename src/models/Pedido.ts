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
    this.id = id;
    this.items = items;
    this.estado = estado;
  }
}