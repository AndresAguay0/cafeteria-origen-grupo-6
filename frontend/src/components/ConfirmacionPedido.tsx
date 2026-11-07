import { useState } from 'react';

import { crearPedido } from '../api/apiClient';
import { useCart } from '../context/useCart';

import type {
    Pedido,
    Producto,
} from '../schemas/apiSchemas';

import Carrito from './Carrito';

type ConfirmacionPedidoProps = {
    mesaId: number | null;
    productos?: Producto[];
};

export default function ConfirmacionPedido({
    mesaId,
    productos = [],
}: ConfirmacionPedidoProps) {
    const { items, dispatch } = useCart();

    const [pedidoConfirmado, setPedidoConfirmado] =
        useState<Pedido | null>(null);

    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState('');

    async function confirmarPedido() {
        if (items.length === 0 || cargando) {
            return;
        }

        setCargando(true);
        setError('');

        try {
            const pedido = await crearPedido({
                mesaId,
                items: items.map((item) => ({
                    productoId: item.productoId,
                    cantidad: item.cantidad,
                })),
            });

            setPedidoConfirmado(pedido);

            dispatch({ type: 'vaciar' });
        } catch (errorDesconocido) {
            setError(
                errorDesconocido instanceof Error
                    ? errorDesconocido.message
                    : 'No se pudo confirmar el pedido.'
            );
        } finally {
            setCargando(false);
        }
    }

    if (pedidoConfirmado) {
        return (
            <section
                aria-labelledby="titulo-confirmacion"
                className="card p-4 mt-4"
            >
                <h2
                    id="titulo-confirmacion"
                    className="h3 text-success"
                >
                    ¡Pedido confirmado!
                </h2>

                <p className="fs-5">
                    Pedido #{pedidoConfirmado.id}
                </p>

                <p>
                    Estado: <strong>{pedidoConfirmado.estado}</strong>
                </p>

                <p>
                    {pedidoConfirmado.mesaId !== null
                        ? `Mesa: ${pedidoConfirmado.mesaId}`
                        : 'Retiro por mostrador'}
                </p>

                <p className="fs-4 fw-bold">
                    Total: {`$${pedidoConfirmado.total}`}
                </p>

                <p className="text-body-secondary mb-0">
                    Gracias por elegir Cafetería Origen.
                </p>
            </section>
        );
    }

    return (
        <>
            <Carrito
                productos={productos}
                mesaId={mesaId}
                onConfirmar={confirmarPedido}
            />

            {error && (
                <div
                    role="alert"
                    className="alert alert-danger mt-3"
                >
                    {error}
                </div>
            )}

            {cargando && (
                <p role="status" className="text-center mt-3">
                    Enviando pedido...
                </p>
            )}

            {cargando && (
                <div
                    className="progress mt-2"
                    role="progressbar"
                    aria-label="Enviando pedido"
                >
                    <div className="progress-bar progress-bar-striped progress-bar-animated w-100" />
                </div>
            )}
        </>
    );
}