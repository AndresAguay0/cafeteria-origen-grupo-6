
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

describe('Integración: confirmación de pedidos', () => {
  it('envía correctamente los datos al confirmar un pedido', async () => {
    const usuario = userEvent.setup();

    let cuerpoRecibido: unknown;

    server.use(
      http.post('http://localhost:4000/pedidos', async ({ request }) => {
        cuerpoRecibido = await request.json();

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

    // Lo agregamos al carrito.
    await usuario.click(
      screen.getByRole('button', { name: /agregar/i })
    );

    // Confirmamos el pedido.
    await usuario.click(
      screen.getByRole('button', { name: /confirmar pedido/i })
    );

    // Comprobamos que se confirmó.
    expect(
      await screen.findByText(/¡Pedido confirmado!/i)
    ).toBeInTheDocument();

    // Comprobamos el cuerpo enviado al POST.
    expect(cuerpoRecibido).toEqual({
      mesaId: 4,
      items: [
        {
          productoId: 1,
          cantidad: 1,
        },
      ],
    });
  });
});
