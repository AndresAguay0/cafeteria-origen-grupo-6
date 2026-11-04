import { describe, expect, it } from 'vitest';

import {
  ProductoSchema,
  PedidoSchema,
  ErrorApiSchema,
} from '../../src/schemas/apiSchemas';

describe('Esquemas Zod de la API', () => {
  it('acepta un producto de pastelería válido', () => {
    const producto = {
      id: 19,
      nombre: 'Muffin de chocolate',
      precioBase: 2500,
      tipo: 'pasteleria',
      precio: 2500,
    };

    expect(ProductoSchema.safeParse(producto).success).toBe(true);
  });

  it('acepta un café válido', () => {
    const producto = {
      id: 5,
      nombre: 'Expreso Mediano - Colombia',
      precioBase: 2500,
      tipoPreparacion: 'Expreso',
      tamano: 'Mediano',
      gramosCafe: 27,
      variedad: {
        nombre: 'Colombia',
        descripcion: 'Acidez media y cuerpo equilibrado',
      },
      precioPorGramo: 180,
      tipo: 'expreso',
      precio: 7360,
    };

    expect(ProductoSchema.safeParse(producto).success).toBe(true);
  });

  it('rechaza un producto con precio inválido', () => {
    const producto = {
      id: 19,
      nombre: 'Muffin de chocolate',
      precioBase: 2500,
      tipo: 'pasteleria',
      precio: 'dos mil quinientos',
    };

    expect(ProductoSchema.safeParse(producto).success).toBe(false);
  });

  it('acepta un pedido válido', () => {
    const pedido = {
      id: 1,
      items: [
        { productoId: 5, cantidad: 2 },
        { productoId: 19, cantidad: 1 },
      ],
      estado: 'pendiente',
      mesaId: 4,
      total: 17220,
    };

    expect(PedidoSchema.safeParse(pedido).success).toBe(true);
  });

  it('acepta un pedido para retirar en barra', () => {
    const pedido = {
      id: 1,
      items: [{ productoId: 19, cantidad: 1 }],
      estado: 'pendiente',
      mesaId: null,
      total: 2500,
    };

    expect(PedidoSchema.safeParse(pedido).success).toBe(true);
  });

  it('rechaza pedidos con cantidades inválidas', () => {
    const pedido = {
      id: 1,
      items: [{ productoId: 5, cantidad: -1 }],
      estado: 'pendiente',
      mesaId: 4,
      total: 0,
    };

    expect(PedidoSchema.safeParse(pedido).success).toBe(false);
  });

  it('acepta errores con el formato del backend', () => {
    const error = {
      error: 'Producto no encontrado',
    };

    expect(ErrorApiSchema.safeParse(error).success).toBe(true);
  });

  it('rechaza errores sin mensaje válido', () => {
    const error = {
      error: 404,
    };

    expect(ErrorApiSchema.safeParse(error).success).toBe(false);
  });
});
