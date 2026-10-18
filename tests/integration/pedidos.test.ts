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
                        items: [
                            { productoId, cantidad: 2 }
                        ],
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
                        items: [
                            { productoId, cantidad: 0 }
                        ],
                        estado: "pendiente"
                    })
                    .expect(400);

                expect(respuesta.body.error).toBeDefined();
            });
        });

        describe("GET /pedidos", () => {

            it("Debe devolver la lista de pedidos", async () => {
                await request(app)
                    .post("/pedidos")
                    .send({
                        items: [
                            { productoId, cantidad: 2 }
                        ],
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
                        items: [
                            { productoId, cantidad: 1 }
                        ],
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

    describe("Tests E2E", () => {

        it("Happy path: debe crear un pedido y luego poder consultarlo", async () => {
            const creacion = await request(app)
                .post("/pedidos")
                .send({
                    items: [
                        { productoId, cantidad: 2 }
                    ],
                    estado: "pendiente"
                })
                .expect(201);

            const id = creacion.body.id;

            const respuesta = await request(app)
                .get(`/pedidos/${id}`)
                .expect(200);

            expect(respuesta.body).toEqual(creacion.body);
        });

        it("Error: no debe crear un pedido con cantidad inválida", async () => {
            const respuesta = await request(app)
                .post("/pedidos")
                .send({
                    items: [
                        { productoId, cantidad: 0 }
                    ],
                    estado: "pendiente"
                })
                .expect(400);

            expect(respuesta.body.error).toBeDefined();
        });
    });
});