import { z } from 'zod';

// Campos que comparten todos los productos
const ProductoBaseSchema = z.object({
  id: z.number().int().positive(),
  nombre: z.string(),
  precioBase: z.number().nonnegative(),
  precio: z.number().nonnegative(),
});

// Variedad de origen del café
const VariedadSchema = z.object({
  nombre: z.enum(['Brasil', 'Colombia', 'Etiopía']),
  descripcion: z.string(),
});

// Café expreso o filtrado
const CafeSchema = ProductoBaseSchema.extend({
  tipo: z.enum(['expreso', 'filtrado']),
  tipoPreparacion: z.enum(['Expreso', 'Filtrado']),
  tamano: z.enum(['Pocillo', 'Mediano', 'Taza grande']),
  gramosCafe: z.number().positive(),
  variedad: VariedadSchema,
  precioPorGramo: z.number().nonnegative(),
});

// Producto de pastelería
const PasteleriaSchema = ProductoBaseSchema.extend({
  tipo: z.literal('pasteleria'),
});

// Producto: café o pastelería
export const ProductoSchema = z.discriminatedUnion('tipo', [
  CafeSchema,
  PasteleriaSchema,
]);

// Respuesta de GET /productos
export const ProductosSchema = z.array(ProductoSchema);

// Cada ítem de un pedido
export const ItemPedidoSchema = z.object({
  productoId: z.number().int().positive(),
  cantidad: z.number().int().positive(),
});

// Respuesta de POST /pedidos y GET /pedidos/:id
export const PedidoSchema = z.object({
  id: z.number().int().positive(),
  items: z.array(ItemPedidoSchema),
  estado: z.string(),
  mesaId: z.number().int().positive().nullable(),
  total: z.number().nonnegative(),
});

// Respuesta de error de la API
export const ErrorApiSchema = z.object({
  error: z.string(),
});

// Tipos TypeScript derivados de Zod
export type Producto = z.infer<typeof ProductoSchema>;
export type Pedido = z.infer<typeof PedidoSchema>;
export type ItemPedido = z.infer<typeof ItemPedidoSchema>;
export type ErrorApi = z.infer<typeof ErrorApiSchema>;
