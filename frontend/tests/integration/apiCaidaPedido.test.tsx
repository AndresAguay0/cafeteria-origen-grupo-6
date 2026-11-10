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

describe('Integración: caída de la API', () => {
  it('muestra un mensaje de conexión y conserva el carrito cuando la API no responde', async () => {
    const usuario = userEvent.setup();

    server.use(
      http.post('http://localhost:4000/pedidos', () => {
        // Simulamos que no se puede establecer conexión con la API.
        return HttpResponse.error();
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

    // Intentamos confirmar el pedido.
    await usuario.click(
      screen.getByRole('button', { name: /confirmar pedido/i })
    );

    // Comprobamos que se muestre un mensaje amigable.
    expect(await screen.findByRole('alert'))
      .toHaveTextContent(
        'No se pudo conectar con el servidor. Intentá nuevamente.'
      );

    // El producto debe seguir en el carrito.
    expect(screen.getByText(/Cantidad: 1/i))
      .toBeInTheDocument();

    // El usuario debe poder volver a intentar.
    expect(
      screen.getByRole('button', { name: /confirmar pedido/i })
    ).toBeEnabled();
  });
});
