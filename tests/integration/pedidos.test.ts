import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import app from "../../src/app";
import db from "../../src/config/database";

describe("Pedidos", () => {
    let productoId: number;

    beforeEach(() => {
        db.exec(`
            DELETE FROM pedido_items;
            DELETE FROM pedidos;
            DELETE FROM productos;
        `);

        const resultado = db.prepare(`
            INSERT INTO productos (nombre, precio_base, tipo)
            VALUES (?, ?, ?)
        `).run("Muffin chocolate", 2500, "Pasteleria");

        productoId = Number(resultado.lastInsertRowid);
    });

    describe("Tests de integración", () => {

        describe("POST /pedidos", () => {
            it("Debe crear un pedido correctamente", async () => {
                const respuesta = await request(app)
                    .post("/pedidos")
                    .send({
                        items: [{ productoId, cantidad: 2 }],
                        estado: "pendiente"
                    })
                    .expect(201);

                expect(respuesta.body.id).toBeDefined();
                expect(respuesta.body.estado).toBe("pendiente");
                expect(respuesta.body.items).toEqual([
                    { productoId, cantidad: 2 }
                ]);
            });

            it("Debe rechazar un pedido con cantidad inválida", async () => {
                const respuesta = await request(app)
                    .post("/pedidos")
                    .send({
                        items: [{ productoId, cantidad: 0 }],
                        estado: "pendiente"
                    })
                    .expect(400);

                expect(respuesta.body.error).toBeDefined();
            });

            it("Debe guardar y devolver la mesa del pedido", async () => {
                const respuesta = await request(app)
                    .post("/pedidos")
                    .send({
                        mesaId: 4,
                        items: [{ productoId, cantidad: 2 }],
                        estado: "pendiente"
                    })
                    .expect(201);

                expect(respuesta.body.mesaId).toBe(4);

                const consulta = await request(app)
                    .get(`/pedidos/${respuesta.body.id}`)
                    .expect(200);

                expect(consulta.body.mesaId).toBe(4);
            });

            it("Debe aceptar un pedido sin mesa (retiro en la barra)", async () => {
                const respuesta = await request(app)
                    .post("/pedidos")
                    .send({
                        items: [{ productoId, cantidad: 1 }],
                        estado: "pendiente"
                    })
                    .expect(201);

                expect(respuesta.body.mesaId).toBeNull();
            });

            it.each([0, -1, 1.5, "abc"])("Debe rechazar la mesa inválida", async (mesaId) => {
                const respuesta = await request(app)
                    .post("/pedidos")
                    .send({
                        mesaId,
                        items: [{ productoId, cantidad: 1 }],
                        estado: "pendiente"
                    })
                    .expect(400);

                expect(respuesta.body).toEqual({ error: "Mesa inválida" });
            });

            it("Debe dejar el pedido en estado pendiente si no se envía estado", async () => {
                const respuesta = await request(app)
                    .post("/pedidos")
                    .send({
                        mesaId: 4,
                        items: [{ productoId, cantidad: 1 }]
                    })
                    .expect(201);

                expect(respuesta.body.estado).toBe("pendiente");
            });
        });

        describe("GET /pedidos", () => {
            it("Debe devolver la lista de pedidos", async () => {
                await request(app)
                    .post("/pedidos")
                    .send({
                        items: [{ productoId, cantidad: 2 }],
                        estado: "pendiente"
                    })
                    .expect(201);

                const respuesta = await request(app)
                    .get("/pedidos")
                    .expect(200);

                expect(respuesta.body).toHaveLength(1);
                expect(respuesta.body[0].estado).toBe("pendiente");
                expect(respuesta.body[0].items).toEqual([
                    { productoId, cantidad: 2 }
                ]);
            });
        });

        describe("GET /pedidos/:id", () => {
            it("Debe devolver un pedido existente", async () => {
                const creacion = await request(app)
                    .post("/pedidos")
                    .send({
                        items: [{ productoId, cantidad: 1 }],
                        estado: "pendiente"
                    })
                    .expect(201);

                const id = creacion.body.id;

                const respuesta = await request(app)
                    .get(`/pedidos/${id}`)
                    .expect(200);

                expect(respuesta.body).toEqual(creacion.body);
            });

            it("Debe devolver 404 cuando el pedido no existe", async () => {
                const respuesta = await request(app)
                    .get("/pedidos/99999")
                    .expect(404);

                expect(respuesta.body).toEqual({
                    error: "Pedido no encontrado"
                });
            });
        });
    });
});