import type Database from "better-sqlite3";
import { Pedido, ItemPedido } from "../models/Pedido";

export interface PedidoRepository {
  create(pedido: Pedido): Pedido;
  findAll(): Pedido[];
  findById(id: number): Pedido | undefined;
}

export class SqlitePedidoRepository implements PedidoRepository {
  constructor(private readonly db: Database.Database) {}

  create(pedido: Pedido): Pedido {
    const guardar = this.db.transaction(() => {
      const resultado = this.db
        .prepare("INSERT INTO pedidos (estado) VALUES (?)")
        .run(pedido.estado);

      const pedidoId = Number(resultado.lastInsertRowid);

      const insertarItem = this.db.prepare(`
        INSERT INTO pedido_items (pedido_id, producto_id, cantidad)
        VALUES (?, ?, ?)
      `);

      for (const item of pedido.items) {
        insertarItem.run(
          pedidoId,
          item.productoId,
          item.cantidad
        );
      }

      return this.findById(pedidoId)!;
    });

    return guardar();
  }

  findAll(): Pedido[] {
    const filas = this.db
        .prepare("SELECT id FROM pedidos")
        .all() as { id: number }[];

    return filas.map(fila => this.findById(fila.id)!);
  }

  findById(id: number): Pedido | undefined {
    const row = this.db
      .prepare("SELECT * FROM pedidos WHERE id = ?")
      .get(id) as { id: number; estado: string } | undefined;

    if (!row) {
      return undefined;
    }

    const items = this.db
      .prepare(`
        SELECT producto_id, cantidad
        FROM pedido_items
        WHERE pedido_id = ?
      `)
      .all(id) as { producto_id: number; cantidad: number }[];

    const itemsPedido: ItemPedido[] = items.map(item => ({
      productoId: item.producto_id,
      cantidad: item.cantidad
    }));

    return new Pedido(row.id, itemsPedido, row.estado);
  }
}

/*create() guarda el pedido y sus ítems.
findById() recupera el pedido desde SQLite.
// findAll() recupera todos los pedidos desde SQLite.
transaction() asegura que el pedido y sus ítems se guarden juntos o que no se 
guarde ninguno si ocurre un error.*/