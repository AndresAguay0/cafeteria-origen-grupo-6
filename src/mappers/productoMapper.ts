import { Cafe, Producto } from "../models/index";

export type TipoProducto = "expreso" | "filtrado" | "pasteleria";

const DESCRIPCIONES_VARIEDAD: Record<string, string> = {
    "Colombia": "Acidez media, cuerpo equilibrado y notas cítricas y florales",
    "Etiopía": "Acidez muy viva, cuerpo ligero y notas frutales",
    "Brasil": "Acidez baja, cuerpo denso y notas de avellana",
};

export function productoToResponse(producto: Producto) {
    if (producto instanceof Cafe) {
        return {
            ...producto,
            tipo: obtenerTipo(producto),
            precio: producto.calcularPrecio(),
            variedad: {
                nombre: producto.variedad,
                descripcion: DESCRIPCIONES_VARIEDAD[producto.variedad],
            },
        };
    }

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