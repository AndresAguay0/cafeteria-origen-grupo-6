# Cafetería Origen — API

API de pedidos de la cafetería Origen (Node.js, Express 5, TypeScript, SQLite).

## Comandos

- **npm run dev** - Levanta la API en modo desarrollo
- **npm test** - Corre tests unitarios y de integración
- **npm run test:watch** - Corre vitest en modo watch
- **npm run test:coverage** - Reporte de cobertura
- **npm run test:ui** - Interfaz gráfica para ver los tests

---

- **npm run build** - Compila de TypeScript a JavaScript
- **npm run start** - Levanta la API compilada
- **npm run start:test** - Levanta la API con `NODE_ENV=test`: base en memoria y endpoints `/__test__` habilitados. Es la que usan los E2E

La API escucha en `http://localhost:4000` (se cambia con la variable de entorno `PORT`).

## Contrato de la API

Las respuestas son JSON (salvo los 204). CORS está habilitado para cualquier origen.

**Todos los errores tienen la misma forma**, con el mensaje listo para mostrar:

```json
{ "error": "mensaje" }
```

Errores generales, válidos para cualquier ruta:

| Situación | Código | `error` |
|---|---|---|
| Ruta inexistente | 404 | `Ruta no encontrada` |
| Body que no es JSON válido | 400 | `JSON inválido` |
| Falla inesperada | 500 | `Error interno del servidor` |

### GET /health

```json
{ "status": "OK", "message": "Cafetería Origen API funcionando" }
```

### Productos

#### GET /productos

Devuelve `200` con un array de productos (20 en el catálogo actual). No tiene filtros: el front filtra la lista.

Un café:

```json
{
  "id": 5,
  "nombre": "Expreso Mediano - Colombia",
  "precioBase": 2500,
  "tipoPreparacion": "Expreso",
  "tamano": "Mediano",
  "gramosCafe": 27,
  "variedad": {
    "nombre": "Colombia",
    "descripcion": "Acidez media, cuerpo equilibrado y notas cítricas y florales"
  },
  "precioPorGramo": 180,
  "tipo": "expreso",
  "precio": 7360
}
```

Un producto de pastelería (no tiene `variedad`, `tamano` ni los campos de café):

```json
{
  "id": 19,
  "nombre": "Muffin de chocolate",
  "precioBase": 2500,
  "tipo": "pasteleria",
  "precio": 2500
}
```

Campos y valores:

| Campo | Descripción |
|---|---|
| `tipo` | `"expreso"`, `"filtrado"` o `"pasteleria"`. Es el campo que distingue los productos |
| `precio` | Precio final, calculado por la API con `calcularPrecio()`. **Es el que se muestra**; el front no calcula precios |
| `precioBase`, `gramosCafe`, `precioPorGramo` | Datos del dominio con los que se calcula el precio. No hace falta usarlos |
| `tamano` | `"Pocillo"`, `"Mediano"` o `"Taza grande"` |
| `variedad.nombre` | `"Brasil"`, `"Colombia"` o `"Etiopía"` (con tilde) |
| `variedad.descripcion` | Acidez, cuerpo y notas del origen |
| `tipoPreparacion` | `"Expreso"` o `"Filtrado"` (con mayúscula). Usar `tipo`, que viene en minúscula |

Para encontrar el café que corresponde a una elección, se busca en la lista el producto con el `tipo`, el `tamano` y el `variedad.nombre` elegidos.

#### GET /productos/:id

Devuelve `200` con un producto, con la misma forma de arriba.

| Situación | Código | `error` |
|---|---|---|
| El id no es un entero positivo | 400 | `ID del producto inválido` |
| No existe el producto | 404 | `Producto no encontrado` |

#### Catálogo (después de `reset` + `seed`)

Cada celda es `id · precio`. Los ids son estables solo en una base recién sembrada.

| Tipo | Tamaño | Gramos | Brasil | Colombia | Etiopía |
|---|---|---|---|---|---|
| Expreso | Pocillo | 18 | 1 · 5020 | 2 · 5740 | 3 · 6820 |
| Expreso | Mediano | 27 | 4 · 6280 | 5 · 7360 | 6 · 8980 |
| Expreso | Taza grande | 36 | 7 · 7540 | 8 · 8980 | 9 · 11140 |
| Filtrado | Pocillo | 6 | 10 · 4040 | 11 · 4280 | 12 · 4640 |
| Filtrado | Mediano | 15 | 13 · 5300 | 14 · 5900 | 15 · 6800 |
| Filtrado | Taza grande | 25 | 16 · 6700 | 17 · 7700 | 18 · 9200 |

Pastelería: `19` Muffin de chocolate (2500) y `20` Torta selva negra (4200).

### Pedidos

#### POST /pedidos

Crea un pedido. Cuerpo:

```json
{
  "mesaId": 4,
  "items": [
    { "productoId": 5, "cantidad": 2 },
    { "productoId": 19, "cantidad": 1 }
  ]
}
```

- `items`: obligatorio, array no vacío. Cada ítem lleva `productoId` y `cantidad`, enteros positivos.
- `mesaId`: opcional, entero positivo. Si no se manda (o es `null`), el pedido es para retirar en la barra.
- `estado`: opcional. Si no se manda queda `"pendiente"`. El menú no lo envía.

Respuesta `201`:

```json
{
  "id": 1,
  "items": [
    {
      "productoId": 5,
      "cantidad": 2
    },
    {
      "productoId": 19,
      "cantidad": 1
    }
  ],
  "estado": "pendiente",
  "mesaId": 4,
  "total": 17220
}
```

Sin mesa, la respuesta trae `"mesaId": null`. El `total` lo calcula la API (2 × 7360 + 2500 = 17220).

Los ítems del pedido solo traen `productoId` y `cantidad`; para mostrar nombres hay que buscarlos en `GET /productos`.

Errores, todos con código `400`:

| Situación | `error` |
|---|---|
| `items` falta, no es un array o está vacío (o `estado` no es un texto válido) | `Datos del pedido inválidos` |
| `mesaId` no es un entero positivo | `Mesa inválida` |
| Un ítem tiene `productoId` o `cantidad` inválidos | `Ítems del pedido inválidos` |
| Un `productoId` no existe en el catálogo | `Producto no encontrado` |

Si algo falla por dentro, responde `500` con `No se pudo crear el pedido`.

#### GET /pedidos/:id

Devuelve `200` con el pedido, con la misma forma que la respuesta del POST (`id`, `items`, `estado`, `mesaId`, `total`).

| Situación | Código | `error` |
|---|---|---|
| El id no es un entero positivo | 400 | `ID de pedido inválido` |
| No existe el pedido | 404 | `Pedido no encontrado` |

#### GET /pedidos

Devuelve `200` con un array de pedidos, cada uno con la misma forma.

Los pedidos que crea el menú quedan en estado `"pendiente"`. La API no tiene un endpoint para cambiar el estado.

### Reportes

- **GET /reportes/facturacion** → `200` `{ "facturacion": 9000 }`
- **GET /reportes/mas-vendido** → `200` `{ "productoId": 1, "nombre": "Muffin chocolate", "cantidad": 5 }`. Sin ventas responde `404` con `{ "error": "No existen ventas registradas" }`.

### Endpoints para los tests E2E

Solo existen si la API arranca con `NODE_ENV=test` (`npm run start:test`). En cualquier otro entorno responden `404`.

- **POST /__test__/reset** → `204` sin cuerpo. Vacía productos y pedidos y reinicia los ids.
- **POST /__test__/seed** → `200` `{ "productos": 20 }`. Carga el catálogo. Si ya estaba cargado, no lo duplica.

Antes de cada test E2E se llama primero a `reset` y después a `seed`. Así el expreso mediano de Colombia es siempre el id 5 ($7.360), el muffin el 19 y el primer pedido el 1.