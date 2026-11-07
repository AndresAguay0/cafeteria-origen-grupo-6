import { useCart } from '../context/useCart';
import type { Producto } from '../schemas/apiSchemas';

type PasteleriaProps = {
    productos: Producto[];
};

export default function Pasteleria({
    productos,
}: PasteleriaProps) {
    const { dispatch } = useCart();

    const productosPasteleria = productos.filter(
        (producto) =>
            producto.tipo === 'pasteleria' &&
            (
                producto.nombre.toLocaleLowerCase().includes('muffin') ||
                producto.nombre.toLocaleLowerCase().includes('selva negra')
            )
    );

    if (productosPasteleria.length === 0) {
        return (
            <section
                aria-labelledby="titulo-pasteleria"
                className="mt-4"
            >
                <h2 id="titulo-pasteleria" className="h3">
                    Nuestra pastelería
                </h2>
                <p>No hay productos de pastelería disponibles.</p>
            </section>
        );
    }

    return (
        <section
            aria-labelledby="titulo-pasteleria"
            className="mt-4"
        >
            <h2 id="titulo-pasteleria" className="h3 mb-3">
                Nuestra pastelería
            </h2>

            <div className="row g-3">
                {productosPasteleria.map((producto) => (
                    <div className="col-12 col-md-6" key={producto.id}>
                        <article className="card h-100 p-3">
                            <h3 className="h5">
                                {producto.nombre}
                            </h3>

                            <p className="text-body-secondary mb-3">
                                {producto.nombre.toLowerCase().includes('muffin')
                                    ? 'Delicioso muffin de chocolate.'
                                    : 'Porción de torta Selva Negra.'}
                            </p>

                            <div className="mt-auto">
                                <p className="fs-5 fw-semibold">
                                    ${producto.precio}
                                </p>

                                <button
                                    type="button"
                                    className="btn btn-primary w-100"
                                    aria-label={`Agregar ${producto.nombre}`}
                                    onClick={() =>
                                        dispatch({
                                            type: 'agregar',
                                            productoId: producto.id,
                                        })
                                    }
                                >
                                    Agregar al carrito
                                </button>
                            </div>
                        </article>
                    </div>
                ))}
            </div>
        </section>
    );
}