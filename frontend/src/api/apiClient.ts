import {
  ErrorApiSchema,
  PedidoSchema,
  ProductoSchema,
  ProductosSchema,
} from '../schemas/apiSchemas';

import type { Pedido, Producto } from '../schemas/apiSchemas';

// URL centralizada para comunicarnos con el backend
const API_URL = (
  import.meta.env.VITE_API_URL ?? 'http://localhost:4000'
).replace(/\/$/, '');

// Datos que enviamos al crear un pedido
export type CrearPedidoInput = {
  mesaId?: number | null;
  items: {
    productoId: number;
    cantidad: number;
  }[];
};

// Función común para todas las solicitudes HTTP
async function solicitar(
  ruta: string,
  opciones: RequestInit = {}
): Promise<unknown> {
  let respuesta: Response;

  try {
    respuesta = await fetch(`${API_URL}${ruta}`, {
      ...opciones,
      headers: {
        'Content-Type': 'application/json',
        ...opciones.headers,
      },
    });
  } catch {
    throw new Error(
      'No se pudo conectar con el servidor. Intentá nuevamente.'
    );
  }

  const datos: unknown = await respuesta.json();

  if (!respuesta.ok) {
    const error = ErrorApiSchema.safeParse(datos);

    if (error.success) {
      throw new Error(error.data.error);
    }

    throw new Error(`Error HTTP ${respuesta.status}`);
  }

  return datos;
}


// GET /productos
export async function obtenerProductos(): Promise<Producto[]> {
  const datos = await solicitar('/productos');

  return ProductosSchema.parse(datos);
}

// GET /productos/:id
export async function obtenerProducto(id: number): Promise<Producto> {
  const datos = await solicitar(`/productos/${id}`);

  return ProductoSchema.parse(datos);
}

// POST /pedidos
export async function crearPedido(
  pedido: CrearPedidoInput
): Promise<Pedido> {
  const datos = await solicitar('/pedidos', {
    method: 'POST',
    body: JSON.stringify(pedido),
  });

  return PedidoSchema.parse(datos);
}

// GET /pedidos/:id
export async function obtenerPedido(id: number): Promise<Pedido> {
  const datos = await solicitar(`/pedidos/${id}`);

  return PedidoSchema.parse(datos);
}
