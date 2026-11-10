import { Router } from "express";
import type { Express } from "express";
import { resetDatos, cargarSeed } from "../controllers/testController";

const router = Router();

router.post("/reset", resetDatos);
router.post("/seed", cargarSeed);

export function montarRutasDeTest(app: Express, entorno: string | undefined) {
    if (entorno === "test") {
        app.use("/__test__", router);
    }
}