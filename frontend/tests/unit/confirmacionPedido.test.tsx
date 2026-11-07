import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import ConfirmacionPedido from '../../src/components/ConfirmacionPedido';
import { CartProvider } from '../../src/context/CartContext';
import { useCart } from '../../src/context/useCart';

import { crearPedido } from '../../src/api/apiClient';

vi.mock('../../src/api/apiClient', () => ({
    crearPedido: vi.fn(),
}));

const crearPedidoMock = vi.mocked(crearPedido);

function PedidoConProducto() {
    const { dispatch } = useCart();

    return (
        <>
            <button
                type="button"
                onClick={() => dispatch({ type: 'agregar', productoId: 19 })}
            >
                Agregar producto de prueba
            </button>

            <ConfirmacionPedido mesaId={4} />
        </>
    );
}

function renderConfirmacion() {
    return render(
        <CartProvider>
            <PedidoConProducto />
        </CartProvider>
    );
}

describe('Confirmación del pedido', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('envía el pedido a la API con la mesa y los productos', async () => {
        const usuario = userEvent.setup();

        crearPedidoMock.mockResolvedValue({
            id: 1,
            items: [{ productoId: 19, cantidad: 1 }],
            estado: 'pendiente',
            mesaId: 4,
            total: 2500,
        });

        renderConfirmacion();

        await usuario.click(
            screen.getByRole('button', {
                name: 'Agregar producto de prueba',
            })
        );

        await usuario.click(
            screen.getByRole('button', {
                name: /confirmar pedido/i,
            })
        );

        expect(crearPedidoMock).toHaveBeenCalledWith({
            mesaId: 4,
            items: [{ productoId: 19, cantidad: 1 }],
        });
    });

    it('muestra el número y el estado del pedido confirmado', async () => {
        const usuario = userEvent.setup();

        crearPedidoMock.mockResolvedValue({
            id: 1,
            items: [{ productoId: 19, cantidad: 1 }],
            estado: 'pendiente',
            mesaId: 4,
            total: 2500,
        });

        renderConfirmacion();

        await usuario.click(
            screen.getByRole('button', {
                name: 'Agregar producto de prueba',
            })
        );

        await usuario.click(
            screen.getByRole('button', {
                name: /confirmar pedido/i,
            })
        );

        expect(await screen.findByText(/pedido #1/i)).toBeInTheDocument();
        expect(screen.getByText(/pendiente/i)).toBeInTheDocument();
        expect(screen.getByText(/Total: \$2500/)).toBeInTheDocument();
    });

    it('conserva el carrito cuando la API rechaza el pedido', async () => {
        const usuario = userEvent.setup();

        crearPedidoMock.mockRejectedValue(
            new Error('No se pudo crear el pedido')
        );

        renderConfirmacion();

        await usuario.click(
            screen.getByRole('button', {
                name: 'Agregar producto de prueba',
            })
        );

        await usuario.click(
            screen.getByRole('button', {
                name: /confirmar pedido/i,
            })
        );

        expect(
            await screen.findByRole('alert')
        ).toHaveTextContent('No se pudo crear el pedido');
    });
});