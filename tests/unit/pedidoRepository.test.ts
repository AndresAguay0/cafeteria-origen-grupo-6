import { describe, it, expect } from "vitest";
import Database from "better-sqlite3";
import { Pedido } from "../../src/models/Pedido";
import { SqlitePedidoRepository } from "../../src/repositories/pedidoRepository";

describe("SqlitePedidoRepository", () => {
  it("debe guardar un pedido y recuperarlo por su ID", () => {
    const db = new Database(":memory:");

    try {
      db.exec(`
        CREATE TABLE pedidos (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          estado TEXT NOT NULL
        );

        CREATE TABLE pedido_items (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          pedido_id INTEGER NOT NULL,
          producto_id INTEGER NOT NULL,
          cantidad INTEGER NOT NULL
        );
      `);

      const repository = new SqlitePedidoRepository(db);

      const pedido = new Pedido(
        1,
        [{ productoId: 1, cantidad: 2 }],
        "pendiente"
      );

      const guardado = repository.create(pedido);
      const recuperado = repository.findById(guardado.id);

      expect(recuperado).toEqual(guardado);
    } finally {
      db.close();
    }
  });

    it("debe devolver undefined si el pedido no existe", () => {
    const db = new Database(":memory:");

    try {
        db.exec(`
        CREATE TABLE pedidos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            estado TEXT NOT NULL
        );
        `);

        const repository = new SqlitePedidoRepository(db);

        const resultado = repository.findById(999);

        expect(resultado).toBeUndefined();
    } finally {
        db.close();
    }
    });

});
