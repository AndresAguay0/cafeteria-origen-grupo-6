import {
  afterEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import {
  obtenerProductos,
  crearPedido,
  obtenerPedido,
} from '../../src/api/apiClient';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('Cliente HTTP', () => {
  it('obtiene y valida productos de la API', async () => {
    const productos = [
      {
        id: 19,
        nombre: 'Muffin de chocolate',
        precioBase: 2500,
        tipo: 'pasteleria',
        precio: 2500,
      },
    ];

    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify(productos), {
        status: 200,
      })
    );

    vi.stubGlobal('fetch', fetchMock);

    const resultado = await obtenerProductos();

    expect(resultado).toEqual(productos);
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/productos'),
      expect.anything()
    );
  });

  it('rechaza respuestas con productos inválidos', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify([
            { id: 19, tipo: 'pasteleria', precio: 'incorrecto' },
          ]),
          { status: 200 }
        )
      )
    );

    await expect(obtenerProductos()).rejects.toThrow();
  });

  it('crea un pedido y devuelve el total del backend', async () => {
    const pedido = {
      id: 1,
      items: [{ productoId: 19, cantidad: 1 }],
      estado: 'pendiente',
      mesaId: 4,
      total: 2500,
    };

    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify(pedido), {
        status: 201,
      })
    );

    vi.stubGlobal('fetch', fetchMock);

    const resultado = await crearPedido({
      mesaId: 4,
      items: [{ productoId: 19, cantidad: 1 }],
    });

    expect(resultado.total).toBe(2500);
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/pedidos'),
      expect.objectContaining({
        method: 'POST',
      })
    );
  });

  it('consulta un pedido por su ID', async () => {
    const pedido = {
      id: 1,
      items: [{ productoId: 19, cantidad: 1 }],
      estado: 'pendiente',
      mesaId: null,
      total: 2500,
    };

    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify(pedido), {
          status: 200,
        })
      )
    );

    const resultado = await obtenerPedido(1);

    expect(resultado.id).toBe(1);
    expect(resultado.estado).toBe('pendiente');
  });

  it('muestra el mensaje de error enviado por el backend', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({ error: 'Producto no encontrado' }),
          { status: 404 }
        )
      )
    );

    await expect(obtenerPedido(999)).rejects.toThrow(
      'Producto no encontrado'
    );
  });
});
