import { useCart } from '../context/useCart';
import type { Producto } from '../schemas/apiSchemas';

type CarritoProps = {
    productos: Producto[];
    mesaId: number | null;
    onConfirmar?: () => void;
};

export default function Carrito({
    productos,
    mesaId,
    onConfirmar,
}: CarritoProps) {
    const { items, dispatch } = useCart();

    const productosCarrito = items.map((item) => ({
        ...item,
        producto: productos.find(
            (producto) => producto.id === item.productoId
        ),
    }));

    const subtotal = productosCarrito.reduce(
        (total, item) =>
            total + (item.producto?.precio ?? 0) * item.cantidad,
        0
    );

    return (
        <section
            aria-labelledby="titulo-carrito"
            className="card p-3 p-md-4 mt-4"
        >
            <h2 id="titulo-carrito" className="h3">
                Tu carrito
            </h2>

            <p className="text-body-secondary">
                {mesaId !== null
                    ? `Pedido para la mesa ${mesaId}`
                    : 'Pedido para retirar por mostrador'}
            </p>

            {items.length === 0 ? (
                <p className="text-body-secondary mb-0">
                    El carrito está vacío.
                </p>
            ) : (
                <>
                    <ul className="list-group list-group-flush">
                        {productosCarrito.map((item) => {
                            const producto = item.producto;

                            if (!producto) {
                                return (
                                    <li
                                        key={item.productoId}
                                        className="list-group-item px-0"
                                    >
                                        <p>Producto #{item.productoId}</p>

                                        <button
                                            type="button"
                                            className="btn btn-outline-danger btn-sm"
                                            onClick={() =>
                                                dispatch({
                                                    type: 'eliminar',
                                                    productoId: item.productoId,
                                                })
                                            }
                                        >
                                            Eliminar
                                        </button>
                                    </li>
                                );
                            }

                            const subtotalProducto =
                                producto.precio * item.cantidad;

                            return (
                                <li
                                    key={item.productoId}
                                    className="list-group-item px-0 py-3"
                                >
                                    <div className="d-flex justify-content-between align-items-start gap-3">
                                        <div>
                                            <h3 className="h6 mb-1">
                                                {producto.nombre}
                                            </h3>

                                            <p className="text-body-secondary mb-1">
                                                Precio unitario: ${producto.precio}
                                            </p>

                                            <p className="fw-semibold mb-0">
                                                Subtotal: ${subtotalProducto}
                                            </p>
                                        </div>

                                        <button
                                            type="button"
                                            className="btn btn-outline-danger btn-sm"
                                            aria-label={`Eliminar ${producto.nombre}`}
                                            onClick={() =>
                                                dispatch({
                                                    type: 'eliminar',
                                                    productoId: item.productoId,
                                                })
                                            }
                                        >
                                            Eliminar
                                        </button>
                                    </div>

                                    <div className="d-flex align-items-center gap-2 mt-3">
                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary btn-sm"
                                            aria-label={`Disminuir ${producto.nombre}`}
                                            onClick={() =>
                                                dispatch({
                                                    type: 'decrementar',
                                                    productoId: item.productoId,
                                                })
                                            }
                                        >
                                            −
                                        </button>

                                        <span className="fw-semibold">
                                            Cantidad: {item.cantidad}
                                        </span>

                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary btn-sm"
                                            aria-label={`Aumentar ${producto.nombre}`}
                                            onClick={() =>
                                                dispatch({
                                                    type: 'incrementar',
                                                    productoId: item.productoId,
                                                })
                                            }
                                        >
                                            +
                                        </button>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>

                    <div className="border-top pt-3 mt-3">
                        <div className="d-flex justify-content-between align-items-center">
                            <span className="fw-semibold">
                                Subtotal estimado:
                            </span>

                            <span className="fs-4 fw-bold">
                                ${subtotal}
                            </span>
                        </div>

                        <p className="text-body-secondary small mt-2 mb-0">
                            El total definitivo será calculado y confirmado por el servidor.
                        </p>
                    </div>
                </>
            )}

            <button
                type="button"
                className="btn btn-primary w-100 mt-3"
                disabled={items.length === 0 || !onConfirmar}
                onClick={onConfirmar}
            >
                Confirmar pedido
            </button>
        </section>
    );
}