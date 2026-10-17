import { describe, it, expect } from "vitest";
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
            const productos = [
                { id: 1, calcularPrecio: () => 1000 }
            ];

            const resultado = calcularFacturacionTotal(pedidos, productos);

            expect(resultado).toBe(0);
        });

        it("calcula la facturación de un pedido", () => {
            const pedidos = [
                new Pedido(
                    1,
                    [{ productoId: 1, cantidad: 2 }],
                    "pendiente"
                )
            ];
            const productos = [
                { id: 1, calcularPrecio: () => 1000 }
            ];

            const resultado = calcularFacturacionTotal(pedidos, productos);

            expect(resultado).toBe(2000);
        });

        it("suma los totales de varios pedidos", () => {
            const pedidos = [
                new Pedido(
                    1,
                    [{ productoId: 1, cantidad: 2 }],
                    "pendiente"
                ),
                new Pedido(
                    2,
                    [{ productoId: 2, cantidad: 3 }],
                    "pendiente"
                )
            ];
            const productos = [
                { id: 1, calcularPrecio: () => 1000 },
                { id: 2, calcularPrecio: () => 500 }
            ];

            const resultado = calcularFacturacionTotal(pedidos, productos);

            expect(resultado).toBe(3500);
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