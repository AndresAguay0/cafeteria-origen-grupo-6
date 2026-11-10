import { describe, it, expect } from "vitest";
import { Cafe, Pasteleria } from "../../src/models/index";
import { Pedido } from "../../src/models/Pedido";
import { pedidoToResponse } from "../../src/mappers/pedidoMapper";

describe("pedidoToResponse", () => {
    const expresoColombia = new Cafe({
        id: 5,
        nombre: "Expreso Mediano - Colombia",
        precioBase: 2500,
        tipoPreparacion: "Expreso",
        tamano: "Mediano",
        gramosCafe: 27,
        variedad: "Colombia",
        precioPorGramo: 180,
    });

    const muffin = new Pasteleria({
        id: 19,
        nombre: "Muffin de chocolate",
        precioBase: 2500,
    });

    it("agrega el total calculado con los precios de los productos", () => {
        const pedido = new Pedido(
            1,
            [
                { productoId: 5, cantidad: 2 },
                { productoId: 19, cantidad: 1 },
            ],
            "pendiente",
            4
        );

        expect(pedidoToResponse(pedido, [expresoColombia, muffin])).toMatchObject({
            id: 1,
            estado: "pendiente",
            mesaId: 4,
            items: [
                { productoId: 5, cantidad: 2 },
                { productoId: 19, cantidad: 1 },
            ],
            total: 17220,
        });
    });

    it("calcula el total de un pedido sin mesa y conserva mesaId en null", () => {
        const pedido = new Pedido(2, [{ productoId: 5, cantidad: 1 }], "pendiente");

        expect(pedidoToResponse(pedido, [expresoColombia, muffin])).toMatchObject({
            mesaId: null,
            total: 7360,
        });
    });
});