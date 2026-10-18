import { beforeEach, describe, expect, it } from "vitest";
import request from "supertest";
import app from "../../src/app";
import db from "../../src/config/database";
import { runSeedProducto } from "../../src/seeds/seederProductos";

describe("E2E - Pedidos", () => {
    beforeEach(() => {
        db.exec(`
            DELETE FROM pedido_items;
            DELETE FROM pedidos;
            DELETE FROM productos;
        `);

        runSeedProducto();
    });

    it("Debe crear y consultar un pedido correctamente", async () => {
        // Primero obtenemos un producto existente mediante la API
        const productos = await request(app)
            .get("/productos")
            .expect(200);

        expect(productos.body.length).toBeGreaterThan(0);

        const productoId = productos.body[0].id;

        // Creamos el pedido
        const creacion = await request(app)
            .post("/pedidos")
            .send({
                items: [
                    {
                        productoId,
                        cantidad: 2
                    }
                ],
                estado: "pendiente"
            })
            .expect(201);

        expect(creacion.body.id).toBeDefined();

        const pedidoId = creacion.body.id;

        // Consultamos el pedido creado
        const pedido = await request(app)
            .get(`/pedidos/${pedidoId}`)
            .expect(200);

        expect(pedido.body).toEqual(creacion.body);
        expect(pedido.body.estado).toBe("pendiente");
        expect(pedido.body.items).toEqual([
            {
                productoId,
                cantidad: 2
            }
        ]);
    });

    it("Debe rechazar un pedido con una cantidad inválida", async () => {
        const productos = await request(app)
            .get("/productos")
            .expect(200);

        expect(productos.body.length).toBeGreaterThan(0);

        const productoId = productos.body[0].id;

        const respuesta = await request(app)
            .post("/pedidos")
            .send({
                items: [
                    {
                        productoId,
                        cantidad: 0
                    }
                ],
                estado: "pendiente"
            })
            .expect(400);

        expect(respuesta.body).toEqual({
            error: "Ítems del pedido inválidos"
        });
    });
});