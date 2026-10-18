import { Router } from "express";
import {
    getProductos,
    getProductoById
} from "../controllers/productoController";

const router = Router();

router.get("/", getProductos);
router.get("/:id", getProductoById);

export default router;