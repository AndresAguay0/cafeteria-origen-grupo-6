import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../../src/app";

const ORIGEN_FRONT = "http://localhost:5173";

describe("Cors", () => {
    it("incluye la cabecera de cors en una respuesta normal", async () => {
        const respuesta = await request(app)
            .get("/productos")
            .set("Origin", ORIGEN_FRONT)
            .expect(200);

        expect(respuesta.headers["access-control-allow-origin"]).toBe("*");
    });

    it("responde el preflight de un POST con JSON", async () => {
        const respuesta = await request(app)
            .options("/pedidos")
            .set("Origin", ORIGEN_FRONT)
            .set("Access-Control-Request-Method", "POST")
            .set("Access-Control-Request-Headers", "content-type")
            .expect(204);

        expect(respuesta.headers["access-control-allow-origin"]).toBe("*");
        expect(respuesta.headers["access-control-allow-methods"]).toContain("POST");
        expect(respuesta.headers["access-control-allow-headers"]).toMatch(/content-type/i);
    });

    it("incluye la cabecera de cors también en los errores, para que el front pueda leer el mensaje", async () => {
        const respuesta = await request(app)
            .post("/pedidos")
            .set("Origin", ORIGEN_FRONT)
            .send({ items: [] })
            .expect(400);

        expect(respuesta.headers["access-control-allow-origin"]).toBe("*");
        expect(respuesta.body).toHaveProperty("error");
    });
});