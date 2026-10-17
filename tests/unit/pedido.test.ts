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


  it("no debe permitir items con productoId menor o igual a cero", () => {
    const items = [
      { productoId: 0, cantidad: 2 }
    ];

    expect(() => {
      new Pedido(3, items, "pendiente");
    }).toThrow();
  });

  it("debe calcular el total del pedido", () => {
    const items = [
      { productoId: 1, cantidad: 2 },
      { productoId: 2, cantidad: 3 }
    ];

    const pedido = new Pedido(4, items, "pendiente");

    const productos = [
      { id: 1, calcularPrecio: () => 2000 },
      { id: 2, calcularPrecio: () => 1000 }
    ];

    expect(pedido.calcularTotal(productos)).toBe(7000);
  });

});