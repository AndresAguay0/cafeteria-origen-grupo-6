import { beforeEach, describe, expect, it } from "vitest";
import request from "supertest";
import app from "../../src/app";
import db from "../../src/config/database";

describe("productos", () => {
    let productoId: number;

    beforeEach(() => {
        // Limpia las tablas antes de cada test y pone un producto para probar
        db.prepare("DELETE FROM pedido_items").run();
        db.prepare("DELETE FROM pedidos").run();
        db.prepare("DELETE FROM productos").run();

        const resultado = db.prepare(`
            INSERT INTO productos (nombre, precio_base, tipo)
            VALUES (?, ?, ?)
        `).run("Muffin chocolate", 2500, "Pasteleria");

        productoId = Number(resultado.lastInsertRowid);
    });

    it("GET /productos debe devolver todos los productos", async () => {
        const respuesta = await request(app).get("/productos");

        expect(respuesta.status).toBe(200);
        expect(respuesta.body).toHaveLength(1);
        expect(respuesta.body[0]).toMatchObject({
            id: productoId,
            nombre: "Muffin chocolate",
            precioBase: 2500
        });
    });

    it("GET /productos/:id debe devolver un producto existente", async () => {
        const respuesta = await request(app)
            .get(`/productos/${productoId}`);
        
        expect(respuesta.status).toBe(200);
        expect(respuesta.body).toMatchObject({
            id: productoId,
            nombre: "Muffin chocolate",
            precioBase: 2500
        });
    });

    it("GET /productos/:id debe devolver 404 si el producto no existe", async () => {
        const respuesta = await request(app).get("/productos/99999");

        expect(respuesta.status).toBe(404);
        expect(respuesta.body).toEqual({
            error: "Producto no encontrado"
        });
    });

    it("GET /productos/:id debe devolver 400 si el ID es inválido", async () => {
        const respuesta = await request(app).get("/productos/abc");

        expect(respuesta.status).toBe(400);
        expect(respuesta.body).toEqual({
            error: "ID del producto inválido"
        });
    });
});