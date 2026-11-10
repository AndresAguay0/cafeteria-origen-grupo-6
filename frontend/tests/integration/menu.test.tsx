
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import SelectorCafe from '../../src/components/SelectorCafe';
import { CartProvider } from '../../src/context/CartContext';

describe('Integración: carga del menú', () => {
  it('muestra los productos recibidos desde la API', async () => {
    const usuario = userEvent.setup();

    render(
      <CartProvider>
        <SelectorCafe />
      </CartProvider>
    );

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

    expect(
      await screen.findByText(
        'Acidez baja, cuerpo denso y notas de avellana.'
      )
    ).toBeInTheDocument();
  });
});
