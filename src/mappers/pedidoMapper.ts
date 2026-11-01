import { Pedido } from "../models/Pedido";
import { Producto } from "../models/index";

export function pedidoToResponse(pedido: Pedido, productos: Producto[]) {
    return {
        ...pedido,
        total: pedido.calcularTotal(productos),
    };
}