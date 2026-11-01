import { Cafe, Producto } from "../models/index";

export type TipoProducto = "expreso" | "filtrado" | "pasteleria";

export function productoToResponse(producto: Producto) {
    return {
        ...producto,
        tipo: obtenerTipo(producto),
        precio: producto.calcularPrecio(),
    };
}

function obtenerTipo(producto: Producto): TipoProducto {
    if (producto instanceof Cafe) {
        const preparacion = producto.tipoPreparacion.toLowerCase();

        if (preparacion === "expreso" || preparacion === "filtrado") {
            return preparacion;
        }

        throw new Error(`Tipo de preparación desconocido: ${producto.tipoPreparacion}`);
    }

    return "pasteleria";
}