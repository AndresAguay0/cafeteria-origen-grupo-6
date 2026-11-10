import { describe, it, expect } from "vitest";
import express from "express";
import request from "supertest";
import { montarRutasDeTest } from "../../src/routes/testRoutes";

describe("rutas de testing según el entorno", () => {
    it("no expone /__test__ en producción", async () => {
        const app = express();
        montarRutasDeTest(app, "production");

        await request(app).post("/__test__/reset").expect(404);
        await request(app).post("/__test__/seed").expect(404);
    });

    it("no expone /__test__ si NODE_ENV no está definido", async () => {
        const app = express();
        montarRutasDeTest(app, undefined);

        await request(app).post("/__test__/reset").expect(404);
    });

    it("expone /__test__ cuando NODE_ENV es test", async () => {
        const app = express();
        montarRutasDeTest(app, "test");

        await request(app).post("/__test__/reset").expect(204);
    });
});