import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Carrito from '../../src/components/Carrito';
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

function CarritoConProductosIniciales() {
    const { dispatch } = useCart();

    return (
        <>
            <button
                type="button"
                onClick={() => dispatch({ type: 'agregar', productoId: 19 })}
            >
                Cargar muffin
            </button>

            <button
                type="button"
                onClick={() => dispatch({ type: 'agregar', productoId: 20 })}
            >
                Cargar torta
            </button>

            <Carrito productos={productos} mesaId={4} onConfirmar={() => {}}/>
        </>
    );
}

function renderCarrito() {
    return render(
        <CartProvider>
            <CarritoConProductosIniciales />
        </CartProvider>
    );
}

describe('Carrito', () => {
    it('muestra un mensaje cuando está vacío', () => {
        renderCarrito();

        expect(
            screen.getByText(/el carrito está vacío/i)
        ).toBeInTheDocument();
    });

    it('muestra los productos agregados', async () => {
        const usuario = userEvent.setup();

        renderCarrito();

        await usuario.click(screen.getByRole('button', { name: 'Cargar muffin' }));

        expect(
            screen.getByText('Muffin de chocolate')
        ).toBeInTheDocument();
    });

    it('incrementa la cantidad de un producto', async () => {
        const usuario = userEvent.setup();

        renderCarrito();

        await usuario.click(screen.getByRole('button', { name: 'Cargar muffin' }));

        await usuario.click(
            screen.getByRole('button', {
                name: /aumentar muffin de chocolate/i,
            })
        );

        expect(screen.getByText('Cantidad: 2')).toBeInTheDocument();
    });

    it('disminuye la cantidad de un producto', async () => {
        const usuario = userEvent.setup();

        renderCarrito();

        await usuario.click(screen.getByRole('button', { name: 'Cargar muffin' }));

        await usuario.click(
            screen.getByRole('button', {
                name: /aumentar muffin de chocolate/i,
            })
        );

        await usuario.click(
            screen.getByRole('button', {
                name: /disminuir muffin de chocolate/i,
            })
        );

        expect(screen.getByText('Cantidad: 1')).toBeInTheDocument();
    });

    it('elimina un producto del carrito', async () => {
        const usuario = userEvent.setup();

        renderCarrito();

        await usuario.click(screen.getByRole('button', { name: 'Cargar muffin' }));

        await usuario.click(
            screen.getByRole('button', {
                name: /eliminar muffin de chocolate/i,
            })
        );

        expect(
            screen.queryByText('Muffin de chocolate')
        ).not.toBeInTheDocument();
    });

    it('calcula el subtotal estimado de los productos', async () => {
        const usuario = userEvent.setup();

        renderCarrito();

        await usuario.click(screen.getByRole('button', { name: 'Cargar muffin' }));
        await usuario.click(screen.getByRole('button', { name: 'Cargar torta' }));

        expect(screen.getByText('$6700')).toBeInTheDocument();
    });

    it('no permite confirmar un carrito vacío', () => {
        renderCarrito();

        expect(
            screen.getByRole('button', { name: /confirmar pedido/i })
        ).toBeDisabled();
    });
});