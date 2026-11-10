import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { http, HttpResponse } from 'msw';

import SelectorCafe from '../../src/components/SelectorCafe';
import { CartProvider } from '../../src/context/CartContext';
import { server } from '../mocks/server';

describe('Integración: respuesta inválida de la API', () => {
    it('muestra un error cuando la API devuelve productos con datos inválidos', async () => {
        server.use(
            http.get('http://localhost:4000/productos', () => {
                return HttpResponse.json([
                    {
                        id: 1,
                        nombre: 'Expreso Pocillo - Brasil',
                        precioBase: 2500,
                        precio: '5020',
                        tipo: 'expreso',
                        tipoPreparacion: 'Expreso',
                        tamano: 'Pocillo',
                        gramosCafe: 18,
                        variedad: {
                            nombre: 'Brasil',
                            descripcion: 'Acidez baja, cuerpo denso y notas de avellana.',
                        },
                        precioPorGramo: 140,
                    },
                ]);
            })
        );

        render(
            <CartProvider>
                <SelectorCafe />
            </CartProvider>
        );

        expect(
            await screen.findByRole('alert')
        ).toHaveTextContent(
            'La API devolvió datos inválidos. No se pudo cargar el catálogo.'
        );

        expect(
            screen.queryByText('Expreso Pocillo - Brasil')
        ).not.toBeInTheDocument();
    });
});
