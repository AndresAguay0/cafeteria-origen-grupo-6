import { useState, useEffect } from 'react'
import { obtenerProductos } from '../api/apiClient'
import type { Producto } from '../schemas/apiSchemas'

export default function SelectorCafe() {
  const [bebida, setBebida] = useState('')
  const [tamano, setTamano] = useState('')
  const [origen, setOrigen] = useState('')

  const [productos, setProductos] = useState<Producto[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    let activo = true

    obtenerProductos()
      .then((datos) => {
        if (activo) setProductos(datos)
      })
      .catch(() => {
        if (activo) setError('No se pudo cargar el catálogo')
      })

    return () => {
      activo = false
    }
  }, [])

  const cafeDelOrigen = productos.find(
    (producto) =>
      producto.tipo !== 'pasteleria' &&
      producto.variedad.nombre === origen
  )

  const cafeSeleccionado = productos.find(
    (producto) =>
      producto.tipo !== 'pasteleria' &&
      producto.tipoPreparacion === bebida &&
      producto.tamano === tamano &&
      producto.variedad.nombre === origen
  )

  return (
    <section
      aria-labelledby="titulo-selector"
      className="card p-3 p-md-4 mx-auto text-start"
      style={{ maxWidth: '480px' }}
    >
      <h1 id="titulo-selector" className="h3">
        Armá tu café
      </h1>
      <p className="text-body-secondary">
        Elegí bebida, tamaño y origen.
      </p>

      <label htmlFor="bebida" className="form-label mt-3">
        1. Bebida
      </label>
      <select
        id="bebida"
        className="form-select"
        value={bebida}
        onChange={(evento) => setBebida(evento.target.value)}
      >
        <option value="">Elegí una bebida</option>
        <option value="Expreso">Expreso</option>
        <option value="Filtrado">Filtrado</option>
      </select>

      <label htmlFor="tamano" className="form-label mt-3">
        2. Tamaño
      </label>
      <select
        id="tamano"
        className="form-select"
        value={tamano}
        onChange={(evento) => setTamano(evento.target.value)}
      >
        <option value="">Elegí un tamaño</option>
        <option value="Pocillo">Pocillo</option>
        <option value="Mediano">Mediano</option>
        <option value="Taza grande">Taza grande</option>
      </select>

      <label htmlFor="origen" className="form-label mt-3">
        3. Origen
      </label>
      <select
        id="origen"
        className="form-select"
        value={origen}
        onChange={(evento) => setOrigen(evento.target.value)}
      >
        <option value="">Elegí un origen</option>
        <option value="Colombia">Colombia</option>
        <option value="Etiopía">Etiopía</option>
        <option value="Brasil">Brasil</option>
      </select>

      {error && (
        <p role="alert" className="alert alert-danger mt-3 mb-0">
          {error}
        </p>
      )}

      <div aria-live="polite">
        {cafeDelOrigen && cafeDelOrigen.tipo !== 'pasteleria' && (
          <p className="mt-3 mb-2">
            {cafeDelOrigen.variedad.descripcion}
          </p>
        )}

        {cafeSeleccionado && (
          <p className="fs-4 fw-semibold mt-3 mb-0">
            Precio: ${cafeSeleccionado.precio}
          </p>
        )}
      </div>

      <button
        type="button"
        className="btn btn-primary w-100 mt-3"
        disabled={!bebida || !tamano || !origen}
      >
        Agregar
      </button>
    </section>
  )
}