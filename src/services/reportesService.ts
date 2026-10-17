import { Pedido } from "../models/Pedido";

export function calcularFacturacionTotal(
    pedidos: Pedido[],
    productos: { id: number; calcularPrecio: () => number }[]
): number {
    throw new Error("Pendiente de implementar");
}

export function calcularCantidadVendidaPorProducto(
    pedidos: Pedido[]
): Record<number, number> {
    throw new Error("Pendiente de implementar");
}

export function obtenerProductoMasVendido(
    cantidades: Record<number, number>
): { productoId: number; cantidad: number } | undefined {
    throw new Error("Pendiente de implementar");
}