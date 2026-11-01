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
            precioBase: 2500,
            precio: 2500,
            tipo: "pasteleria"
        });
    });

    it("GET /productos/:id debe devolver un producto existente", async () => {
        const respuesta = await request(app)
            .get(`/productos/${productoId}`);
        
        expect(respuesta.status).toBe(200);
        expect(respuesta.body).toMatchObject({
            id: productoId,
            nombre: "Muffin chocolate",
            precioBase: 2500,
            precio: 2500,
            tipo: "pasteleria"
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

    it("GET /productos/:id debe devolver precio calculado y tipo (expreso) para un café", async () => {
        const resultado = db.prepare(`
            INSERT INTO productos (nombre, precio_base, tipo, tipo_preparacion, tamano, gramos_cafe, variedad, precio_por_gramo)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `).run("Expreso Mediano", 3000, "Cafe", "Expreso", "Mediano", 27, "Colombia", 100);

        const respuesta = await request(app)
            .get(`/productos/${Number(resultado.lastInsertRowid)}`);

        expect(respuesta.status).toBe(200);
        expect(respuesta.body).toMatchObject({
            nombre: "Expreso Mediano",
            tipo: "expreso",
            precio: 5700
        });
    });

    it("GET /productos debe incluir tipo (filtrado) para un café filtrado", async () => {
        db.prepare(`
            INSERT INTO productos (nombre, precio_base, tipo, tipo_preparacion, tamano, gramos_cafe, variedad, precio_por_gramo)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `).run("Filtrado Taza grande", 3000, "Cafe", "Filtrado", "Taza grande", 30, "Brasil", 100);

        const respuesta = await request(app).get("/productos");

        expect(respuesta.status).toBe(200);
        expect(respuesta.body).toContainEqual(
            expect.objectContaining({ nombre: "Filtrado Taza grande", tipo: "filtrado", precio: 6000 })
        );
    });
});

import { runSeedProducto } from "../../src/seeds/seederProductos";

describe("productos con el catálogo del seeder", () => {
    beforeEach(() => {
        db.prepare("DELETE FROM pedido_items").run();
        db.prepare("DELETE FROM pedidos").run();
        db.prepare("DELETE FROM productos").run();
        runSeedProducto();
    });

    it("GET /productos devuelve el catálogo completo con precio y tipo", async () => {
        const respuesta = await request(app).get("/productos");

        expect(respuesta.status).toBe(200);
        expect(respuesta.body).toHaveLength(20);

        for (const producto of respuesta.body) {
            expect(["expreso", "filtrado", "pasteleria"]).toContain(producto.tipo);
            expect(typeof producto.precio).toBe("number");
        }
    });

    it("el expreso mediano de Colombia cuesta 7360", async () => {
        const respuesta = await request(app).get("/productos");

        expect(respuesta.body).toContainEqual(
            expect.objectContaining({
                nombre: "Expreso Mediano - Colombia",
                tipo: "expreso",
                precio: 7360
            })
        );
    });
});