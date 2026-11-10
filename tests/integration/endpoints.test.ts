import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import app from "../../src/app";
import db from "../../src/config/database";
import { runSeedProducto } from "../../src/seeds/seederProductos";

describe("Endpoints de testing (/__test__)", () => {
    beforeEach(() => {
        db.exec(`
            DELETE FROM pedido_items;
            DELETE FROM pedidos;
            DELETE FROM productos;
        `);
    });

    it("POST /__test__/reset vacía productos y pedidos", async () => {
        runSeedProducto();
        const muffin = db
            .prepare("SELECT id FROM productos WHERE nombre = ?")
            .get("Muffin de chocolate") as { id: number };

        await request(app)
            .post("/pedidos")
            .send({ items: [{ productoId: muffin.id, cantidad: 1 }] })
            .expect(201);

        await request(app).post("/__test__/reset").expect(204);

        const productos = await request(app).get("/productos").expect(200);
        const pedidos = await request(app).get("/pedidos").expect(200);

        expect(productos.body).toEqual([]);
        expect(pedidos.body).toEqual([]);
    });

    it("POST /__test__/seed carga los 20 productos del catálogo", async () => {
        const respuesta = await request(app).post("/__test__/seed").expect(200);

        expect(respuesta.body).toEqual({ productos: 20 });

        const productos = await request(app).get("/productos").expect(200);
        expect(productos.body).toHaveLength(20);
    });

    it("POST /__test__/seed repetido no duplica el catálogo", async () => {
        await request(app).post("/__test__/seed").expect(200);
        const segunda = await request(app).post("/__test__/seed").expect(200);

        expect(segunda.body).toEqual({ productos: 20 });
    });

    it("después de reset y seed los ids son siempre los mismos", async () => {
        runSeedProducto();

        await request(app).post("/__test__/reset").expect(204);
        await request(app).post("/__test__/seed").expect(200);

        const expreso = await request(app).get("/productos/5").expect(200);
        expect(expreso.body).toMatchObject({
            nombre: "Expreso Mediano - Colombia",
            precio: 7360
        });

        const muffin = await request(app).get("/productos/19").expect(200);
        expect(muffin.body).toMatchObject({ nombre: "Muffin de chocolate" });

        const pedido = await request(app)
            .post("/pedidos")
            .send({ items: [{ productoId: 5, cantidad: 1 }] })
            .expect(201);

        expect(pedido.body.id).toBe(1);
    });
});