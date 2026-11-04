import { describe, expect, it } from 'vitest';
import {
  carritoReducer,
  estadoInicialCarrito,
} from '../../src/context/carritoReducer';

describe('carritoReducer', () => {
  it('agrega un producto nuevo', () => {
    const resultado = carritoReducer(estadoInicialCarrito, {
      type: 'agregar',
      productoId: 5,
    });

    expect(resultado).toEqual([
      { productoId: 5, cantidad: 1 },
    ]);
  });

  it('aumenta la cantidad si el producto ya existe', () => {
    const estado = [{ productoId: 5, cantidad: 1 }];

    const resultado = carritoReducer(estado, {
      type: 'agregar',
      productoId: 5,
    });

    expect(resultado).toEqual([
      { productoId: 5, cantidad: 2 },
    ]);
  });

  it('incrementa la cantidad de un producto', () => {
    const estado = [{ productoId: 5, cantidad: 2 }];

    const resultado = carritoReducer(estado, {
      type: 'incrementar',
      productoId: 5,
    });

    expect(resultado).toEqual([
      { productoId: 5, cantidad: 3 },
    ]);
  });

  it('decrementa la cantidad de un producto', () => {
    const estado = [{ productoId: 5, cantidad: 3 }];

    const resultado = carritoReducer(estado, {
      type: 'decrementar',
      productoId: 5,
    });

    expect(resultado).toEqual([
      { productoId: 5, cantidad: 2 },
    ]);
  });

  it('elimina el producto cuando su cantidad llega a cero', () => {
    const estado = [{ productoId: 5, cantidad: 1 }];

    const resultado = carritoReducer(estado, {
      type: 'decrementar',
      productoId: 5,
    });

    expect(resultado).toEqual([]);
  });

  it('elimina un producto sin afectar a los demás', () => {
    const estado = [
      { productoId: 5, cantidad: 2 },
      { productoId: 19, cantidad: 1 },
    ];

    const resultado = carritoReducer(estado, {
      type: 'eliminar',
      productoId: 5,
    });

    expect(resultado).toEqual([
      { productoId: 19, cantidad: 1 },
    ]);
  });

  it('vacía completamente el carrito', () => {
    const estado = [
      { productoId: 5, cantidad: 2 },
      { productoId: 19, cantidad: 1 },
    ];

    const resultado = carritoReducer(estado, {
      type: 'vaciar',
    });

    expect(resultado).toEqual([]);
  });

  it('no modifica el estado original', () => {
    const estado = [{ productoId: 5, cantidad: 1 }];

    carritoReducer(estado, {
      type: 'agregar',
      productoId: 5,
    });

    expect(estado).toEqual([
      { productoId: 5, cantidad: 1 },
    ]);
  });
});
