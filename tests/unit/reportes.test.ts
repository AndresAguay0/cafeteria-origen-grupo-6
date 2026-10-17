import { describe, it, expect, vi } from "vitest";
import { Pedido } from "../../src/models/Pedido";
import {
    calcularFacturacionTotal,
    calcularCantidadVendidaPorProducto,
    obtenerProductoMasVendido
} from "../../src/services/reportesService";

describe("Reportes", () => {
    describe("Facturación total", () => {
        it("devuelve cero cuando no hay pedidos", () => {
            const pedidos: Pedido[] = [];

            const resultado = calcularFacturacionTotal(pedidos, []);

            expect(resultado).toBe(0);
        });

        it("calcula la facturación de un pedido", () => {
            // Preparar
            const pedido = new Pedido(1, [], "pendiente");
            vi.spyOn(pedido, "calcularTotal").mockReturnValue(2000);

            // Actuar
            const resultado = calcularFacturacionTotal([pedido], []);

            // Comprobar
            expect(resultado).toBe(2000);
        });

        it("suma los totales de varios pedidos", () => {
            // Preparar
            const pedido1 = new Pedido(1, [], "pendiente");
            const pedido2 = new Pedido(2, [], "pendiente");
            const pedido3 = new Pedido(3, [], "pendiente");

            vi.spyOn(pedido1, "calcularTotal").mockReturnValue(2000);
            vi.spyOn(pedido2, "calcularTotal").mockReturnValue(1500);
            vi.spyOn(pedido3, "calcularTotal").mockReturnValue(500);

            const pedidos = [pedido1, pedido2, pedido3];

            // Actuar
            const resultado = calcularFacturacionTotal(pedidos, []);

            // Comprobar
            expect(resultado).toBe(4000);
        });
    });

    describe("Cantidad vendida por producto", () => {
        it("devuelve un objeto vacío cuando no hay pedidos", () => {
            const pedidos: Pedido[] = [];

            const resultado = calcularCantidadVendidaPorProducto(pedidos);

            expect(resultado).toEqual({});
        });

        it("acumula las cantidades entre distintos pedidos", () => {
            const pedidos = [
                new Pedido(
                    1,
                    [
                        { productoId: 1, cantidad: 2 },
                        { productoId: 2, cantidad: 1 }
                    ],
                    "pendiente"
                ),
                new Pedido(
                    2,
                    [{ productoId: 1, cantidad: 3 }],
                    "pendiente"
                )
            ];

            const resultado = calcularCantidadVendidaPorProducto(pedidos);

            expect(resultado).toEqual({
                1: 5,
                2: 1
            });
        });
    });

    describe("Producto más vendido", () => {
        it("devuelve undefined cuando no hay ventas", () => {
            const cantidades = {};

            const resultado = obtenerProductoMasVendido(cantidades);

            expect(resultado).toBeUndefined();
        });

        it("devuelve el producto con mayor cantidad vendida", () => {
            const cantidades = {
                1: 5,
                2: 8,
                3: 2
            };

            const resultado = obtenerProductoMasVendido(cantidades);

            expect(resultado).toEqual({
                productoId: 2,
                cantidad: 8
            });
        });
    });
});