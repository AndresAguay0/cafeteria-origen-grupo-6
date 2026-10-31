import { Router } from "express";
import {
    getFacturacion,
    getMasVendido
} from "../controllers/reportesController";

const router = Router();

router.get("/facturacion", getFacturacion);
router.get("/mas-vendido", getMasVendido);

export default router;