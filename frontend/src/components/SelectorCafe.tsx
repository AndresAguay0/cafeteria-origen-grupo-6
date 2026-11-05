import { useState } from 'react'

export default function SelectorCafe() {
  const [bebida, setBebida] = useState('')
  const [tamano, setTamano] = useState('')
  const [origen, setOrigen] = useState('')

  return (
    <div>
      <label htmlFor="bebida">Bebida</label>
      <select
        id="bebida"
        value={bebida}
        onChange={(evento) => setBebida(evento.target.value)}
      >
        <option value="">Elegí una bebida</option>
        <option value="Expreso">Expreso</option>
        <option value="Filtrado">Filtrado</option>
      </select>

      <label htmlFor="tamano">Tamaño</label>
      <select
        id="tamano"
        value={tamano}
        onChange={(evento) => setTamano(evento.target.value)}
      >
        <option value="">Elegí un tamaño</option>
        <option value="Pocillo">Pocillo</option>
        <option value="Mediano">Mediano</option>
        <option value="Taza grande">Taza grande</option>
      </select>

      <label htmlFor="origen">Origen</label>
      <select
        id="origen"
        value={origen}
        onChange={(evento) => setOrigen(evento.target.value)}
      >
        <option value="">Elegí un origen</option>
        <option value="Colombia">Colombia</option>
        <option value="Etiopía">Etiopía</option>
        <option value="Brasil">Brasil</option>
      </select>

      <button disabled={!bebida || !tamano || !origen}>
        Agregar
      </button>
    </div>
  )
}