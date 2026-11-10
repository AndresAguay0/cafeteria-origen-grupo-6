import SelectorCafe from './components/SelectorCafe.tsx'
import { useEffect, useState } from 'react'
import Pasteleria from './components/Pasteleria.tsx'
import ConfirmacionPedido from './components/ConfirmacionPedido.tsx'
import { CartProvider } from './context/CartContext'
import { obtenerProductos } from './api/apiClient'
import { leerMesa } from './utils/mesa'
import type { Producto } from './schemas/apiSchemas'
import './App.css'

function App() {
  const [productos, setProductos] = useState<Producto[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  const mesaId = leerMesa(window.location.search)

  const cargarProductos = async () => {
    try {
      setCargando(true)
      setError('')

      const datos = await obtenerProductos()
      setProductos(datos)
    } catch {
      setError('No se pudieron cargar los productos. Intentá nuevamente.')
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    void cargarProductos()
  }, [])

  return (
    <CartProvider>
      <main className="container py-4">

        <header className="text-center mb-4">
          <h1>Cafetería Origen</h1>

          <p>
            {mesaId !== null
              ? `Mesa ${mesaId}`
              : 'Pedido para retirar en mostrador'}
          </p>
        </header>

        {cargando && (
          <p className="text-center">
            Cargando productos...
          </p>
        )}

        {error && (
          <div className="alert alert-danger text-center" role="alert">
            <p>{error}</p>

            <button
              className="btn btn-outline-danger"
              onClick={() => void cargarProductos()}
            >
              Reintentar
            </button>
          </div>
        )}

        {!cargando && !error && (
          <div className="row g-4">

            <section className="col-12 col-lg-7">
              <SelectorCafe />

              <Pasteleria productos={productos} />
            </section>

            <section className="col-12 col-lg-5">
              <ConfirmacionPedido mesaId={mesaId} productos={productos} />
            </section>

          </div>
        )}

      </main>
    </CartProvider>
  )
}

export default App