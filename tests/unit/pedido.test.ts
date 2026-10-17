import { describe, it, expect } from "vitest";
import { Pedido } from "../../src/models/Pedido";

describe("Pedido", () => {
  it("debe crear un pedido con id, items y estado", () => {
    const items = [
      { productoId: 1, cantidad: 2 },
      { productoId: 2, cantidad: 1 }
    ];

    const pedido = new Pedido(1, items, "pendiente");

    expect(pedido.id).toBe(1);
    expect(pedido.items).toEqual(items);
    expect(pedido.estado).toBe("pendiente");
  });

  it("no debe permitir items con cantidad menor o igual a cero", () => {
    const items = [
      { productoId: 1, cantidad: 0 }
    ];

    expect(() => {
      new Pedido(2, items, "pendiente");
    }).toThrow();
  });

});
