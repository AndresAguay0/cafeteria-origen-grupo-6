export default function SelectorCafe() {
  return (
    <div>
        <label htmlFor="bebida">Bebida</label>
            <select id="bebida" defaultValue="">
            <option value="">Elegí una bebida</option>
            <option value="Expreso">Expreso</option>
            <option value="Filtrado">Filtrado</option>
            </select>

        <label htmlFor="tamano">Tamaño</label>
            <select id="tamano" defaultValue="">
            <option value="">Elegí un tamaño</option>
            <option value="Pocillo">Pocillo</option>
            <option value="Mediano">Mediano</option>
            <option value="Taza grande">Taza grande</option>
            </select>

        <label htmlFor="origen">Origen</label>
            <select id="origen" defaultValue="">
            <option value="">Elegí un origen</option>
            <option value="Colombia">Colombia</option>
            <option value="Etiopía">Etiopía</option>
            <option value="Brasil">Brasil</option>
            </select>

        <button disabled>Agregar</button>
    </div>
  )
}