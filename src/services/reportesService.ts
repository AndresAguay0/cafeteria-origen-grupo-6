import { Pedido } from "../models/index";

export function calcularFacturacionTotal(
    pedidos: Pedido[],
    productos: { id: number; calcularPrecio: () => number }[]
): number {
    let total = 0;

    for (const pedido of pedidos) {
        total += pedido.calcularTotal(productos);
    }

    return total;
}

export function calcularCantidadVendidaPorProducto(
    pedidos: Pedido[]
): Record<number, number> {
    const cantidades: Record<number, number> = {};

    for (const pedido of pedidos) {
        for (const item of pedido.items) {
            if (cantidades[item.productoId] === undefined) {
                cantidades[item.productoId] = 0;
            }

            cantidades[item.productoId] += item.cantidad;
        }
    }

    return cantidades;
}

export function obtenerProductoMasVendido(
    cantidades: Record<number, number>
): { productoId: number; cantidad: number } | undefined {
    let masVendido:
    { productoId: number; cantidad: number } | undefined = undefined;

    for (const id in cantidades) {
        const productoId = Number(id);
        const cantidad = cantidades[productoId];

        if (masVendido === undefined || cantidad > masVendido.cantidad) {
            masVendido = { productoId, cantidad };
        }
    }

    return masVendido;
}