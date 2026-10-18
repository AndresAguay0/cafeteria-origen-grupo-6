import { beforeEach, describe, expect, it } from "vitest";
import request from "supertest";
import app from "../../src/app";
import db from "../../src/config/database";
import { Producto } from "../../src/models";

describe("reportes", () => {
    let muffinId: number;
    let tortaId: number;

    beforeEach(() => {
        db.prepare("DELETE FROM pedido_items").run();
        db.prepare("DELETE FROM pedidos").run();
        db.prepare("DELETE FROM productos").run();

        const muffin = db.prepare(`
            INSERT INTO productos (nombre, precio_base, tipo)
            VALUES (?, ?, ?)
        `).run("Muffin chocolate", 2500, "Pastelería");

        const torta = db.prepare(`
            INSERT INTO productos (nombre, precio_base, tipo)
            VALUES (?, ?, ?)
        `).run("Torta de vainilla", 4000, "Pastelería");

        muffinId = Number(muffin.lastInsertRowid);
        tortaId = Number(torta.lastInsertRowid);
    });

    it("GET /reportes/facturación debe devolver 0 si no hay pedidos", async () => {
        const respuesta = await request(app)
            .get("/reportes/facturación");
        
        expect(respuesta.status).toBe(200);
        expect(respuesta.body).toEqual({
            facturacion: 0
        });
    });

    it ("GET /reportes/facturacion debe calcular la facturación de los pedidos", async () => {
        await request(app)
            .post("/pedidos")
            .send({
                estado: "completado",
                items: [
                    { productoId: muffinId, cantidad: 2 }
                ]
            })
            .expect(201);
        
        await request(app)
            .post("/pedidos")
            .send({
                estado: "completado",
                items: [
                    { productoId: tortaId, cantidad: 1 }
                ]
            })
            .expect(201);
        
        const respuesta = await request(app)
            .get("/reportes/facturacion");

        expect(respuesta.status).toBe(200);
        expect(respuesta.body).toEqual({
            facturacion: 9000
        });
    });

    it("GET /reportes/mas-vendido debe devolver 404 si no hay ventas", async () => {
        const respuesta = await request(app)
            .get("/reportes/mas-vendido");
        
        expect(respuesta.status).toBe(404);
        expect(respuesta.body).toEqual({
            error: "No hay ventas registradas"
        });
    });

    it("GET /reportes/mas-vendido debe devolver el producto más vendido", async () => {
        await request(app)
            .post("/pedidos")
            .send({
                estado: "completado",
                items: [
                    { productoId: muffinId, cantidad: 2 }, { productoId: tortaId, cantidad: 1 }
                ]
            })
            .expect(201);
        
        await request(app)
            .post("/pedidos")
            .send({
                estado: "completado",
                items: [
                    { productoId: muffinId, cantidad: 3 }
                ]
            })
            .expect(201);
        
        const respuesta = await request(app)
            .get("/reportes/mas-vendido");

        expect(respuesta.status).toBe(200);
        expect(respuesta.body).toEqual({
            productoId: muffinId,
            nombre: "Muffin chocolate",
            cantidad: 5
        });
    });
});