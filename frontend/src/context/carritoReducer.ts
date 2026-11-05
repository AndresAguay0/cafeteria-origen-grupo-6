export type ItemCarrito = {
  productoId: number;
  cantidad: number;
};

export type AccionCarrito =
  | { type: 'agregar'; productoId: number }
  | { type: 'incrementar'; productoId: number }
  | { type: 'decrementar'; productoId: number }
  | { type: 'eliminar'; productoId: number }
  | { type: 'vaciar' };

export const estadoInicialCarrito: ItemCarrito[] = [];

export function carritoReducer(
  estado: ItemCarrito[],
  accion: AccionCarrito
): ItemCarrito[] {
  switch (accion.type) {
    case 'agregar':
    case 'incrementar': {
      const existe = estado.some(
        (item) => item.productoId === accion.productoId
      );

      if (existe) {
        return estado.map((item) =>
          item.productoId === accion.productoId
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      }

      return [
        ...estado,
        { productoId: accion.productoId, cantidad: 1 },
      ];
    }

    case 'decrementar':
      return estado
        .map((item) =>
          item.productoId === accion.productoId
            ? { ...item, cantidad: item.cantidad - 1 }
            : item
        )
        .filter((item) => item.cantidad > 0);

    case 'eliminar':
      return estado.filter(
        (item) => item.productoId !== accion.productoId
      );

    case 'vaciar':
      return [];

    default:
      return estado;
  }
}
