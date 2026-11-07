import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Pasteleria from '../../src/components/Pasteleria';
import { CartProvider } from '../../src/context/CartContext';
import { useCart } from '../../src/context/useCart';

import type { Producto } from '../../src/schemas/apiSchemas';

const productos: Producto[] = [
    {
        id: 19,
        nombre: 'Muffin de chocolate',
        precioBase: 2500,
        precio: 2500,
        tipo: 'pasteleria',
    },
    {
        id: 20,
        nombre: 'Torta selva negra',
        precioBase: 4200,
        precio: 4200,
        tipo: 'pasteleria',
    },
];

function CarritoPrueba() {
    const { items } = useCart();

    return (
        <div>
            {items.map((item) => (
                <p key={item.productoId}>
                    Producto {item.productoId}: {item.cantidad}
                </p>
            ))}
        </div>
    );
}

function renderPasteleria() {
    return render(
        <CartProvider>
            <Pasteleria productos={productos} />
            <CarritoPrueba />
        </CartProvider>
    );
}

describe('Pastelería', () => {
    it('muestra los dos productos de pastelería', () => {
        renderPasteleria();

        expect(
            screen.getByText('Muffin de chocolate')
        ).toBeInTheDocument();

        expect(
            screen.getByText('Torta selva negra')
        ).toBeInTheDocument();
    });

    it('muestra el precio de cada producto', () => {
        renderPasteleria();

        expect(screen.getByText('$2500')).toBeInTheDocument();
        expect(screen.getByText('$4200')).toBeInTheDocument();
    });

    it('agrega un muffin al carrito', async () => {
        const usuario = userEvent.setup();

        renderPasteleria();

        await usuario.click(
            screen.getByRole('button', {
                name: /agregar muffin de chocolate/i,
            })
        );

        expect(
            screen.getByText('Producto 19: 1')
        ).toBeInTheDocument();
    });

    it('agrega una torta al carrito', async () => {
        const usuario = userEvent.setup();

        renderPasteleria();

        await usuario.click(
            screen.getByRole('button', {
                name: /agregar torta selva negra/i,
            })
        );

        expect(
            screen.getByText('Producto 20: 1')
        ).toBeInTheDocument();
    });
});