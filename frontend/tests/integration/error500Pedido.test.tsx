
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';

import SelectorCafe from '../../src/components/SelectorCafe';
import ConfirmacionPedido from '../../src/components/ConfirmacionPedido';
import { CartProvider } from '../../src/context/CartContext';
import { server } from '../mocks/server';

import type { Producto } from '../../src/schemas/apiSchemas';

const productoCafe: Producto = {
  id: 1,
  nombre: 'Expreso Pocillo - Brasil',
  precioBase: 2500,
  precio: 5020,
  tipo: 'expreso',
  tipoPreparacion: 'Expreso',
  tamano: 'Pocillo',
  gramosCafe: 18,
  variedad: {
    nombre: 'Brasil',
    descripcion: 'Acidez baja, cuerpo denso y notas de avellana.',
  },
  precioPorGramo: 140,
};

describe('Integración: error 500 al confirmar un pedido', () => {
  it('conserva el carrito y permite reintentar después de un error 500', async () => {
    const usuario = userEvent.setup();

    let intentos = 0;

    server.use(
      http.post('http://localhost:4000/pedidos', () => {
        intentos++;

        // Primer intento: el servidor devuelve un error 500.
        if (intentos === 1) {
          return HttpResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
          );
        }

        // Segundo intento: el servidor confirma el pedido.
        return HttpResponse.json(
          {
            id: 10,
            items: [
              {
                productoId: 1,
                cantidad: 1,
              },
            ],
            estado: 'pendiente',
            mesaId: 4,
            total: 5020,
          },
          { status: 201 }
        );
      })
    );

    render(
      <CartProvider>
        <SelectorCafe />

        <ConfirmacionPedido
          mesaId={4}
          productos={[productoCafe]}
        />
      </CartProvider>
    );

    // Seleccionamos el café.
    await usuario.selectOptions(
      screen.getByRole('combobox', { name: /bebida/i }),
      'Expreso'
    );

    await usuario.selectOptions(
      screen.getByRole('combobox', { name: /tamaño/i }),
      'Pocillo'
    );

    await usuario.selectOptions(
      screen.getByRole('combobox', { name: /origen/i }),
      'Brasil'
    );

    // Agregamos el café al carrito.
    await usuario.click(
      screen.getByRole('button', { name: /agregar/i })
    );

    // Primer intento: confirmamos el pedido.
    await usuario.click(
      screen.getByRole('button', { name: /confirmar pedido/i })
    );

    // Comprobamos que se muestra el error 500.
    expect(await screen.findByRole('alert'))
      .toHaveTextContent('Error interno del servidor');

    // Comprobamos que el producto sigue en el carrito.
    expect(screen.getByText(/Cantidad: 1/i))
      .toBeInTheDocument();

    // Comprobamos que podemos volver a intentar.
    const botonConfirmar = screen.getByRole('button', {
      name: /confirmar pedido/i,
    });

    expect(botonConfirmar).toBeEnabled();

    // Segundo intento: volvemos a confirmar.
    await usuario.click(botonConfirmar);

    // Comprobamos que ahora el pedido se confirma.
    expect(await screen.findByText(/¡Pedido confirmado!/i))
      .toBeInTheDocument();

    // Comprobamos que se realizaron exactamente dos solicitudes.
    expect(intentos).toBe(2);
  });
});
