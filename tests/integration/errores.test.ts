import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../../src/app";

describe("Errores en formato { error }", () => {
    it("rechaza un JSON mal formado con 400", async () => {
        const respuesta = await request(app)
            .post("/pedidos")
            .set("Content-Type", "application/json")
            .send('{"items": [')
            .expect(400);

        expect(respuesta.headers["content-type"]).toMatch(/json/);
        expect(respuesta.body).toEqual({ error: "JSON inválido" });
    });

    it("responde 404 en JSON para una ruta inexistente", async () => {
        const respuesta = await request(app)
            .get("/ruta-que-no-existe")
            .expect(404);

        expect(respuesta.headers["content-type"]).toMatch(/json/);
        expect(respuesta.body).toEqual({ error: "Ruta no encontrada" });
    });

    it("rechaza un POST /pedidos sin body con 400 y { error }", async () => {
        const respuesta = await request(app)
            .post("/pedidos")
            .expect(400);

        expect(respuesta.body).toHaveProperty("error");
    });
});