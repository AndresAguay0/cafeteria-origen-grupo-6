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

describe('Integración: error 4xx al confirmar un pedido', () => {
  it('muestra el error de la API y conserva los productos del carrito', async () => {
    const usuario = userEvent.setup();

    server.use(
      http.post('http://localhost:4000/pedidos', () => {
        return HttpResponse.json(
          { error: 'No hay stock disponible para este producto' },
          { status: 400 }
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

    // Intentamos confirmar el pedido.
    await usuario.click(
      screen.getByRole('button', { name: /confirmar pedido/i })
    );

    // El frontend debe mostrar el mensaje enviado por la API.
    expect(
      await screen.findByRole('alert')
    ).toHaveTextContent(
      'No hay stock disponible para este producto'
    );

    // El producto debe seguir en el carrito.
    expect(
      screen.getByText('Cantidad: 1')
    ).toBeInTheDocument();

    // Debe seguir disponible la opción de confirmar.
    expect(
      screen.getByRole('button', { name: /confirmar pedido/i })
    ).toBeEnabled();
  });
});
