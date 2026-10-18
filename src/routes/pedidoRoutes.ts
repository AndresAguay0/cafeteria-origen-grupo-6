import { Router } from "express";
import {
    getPedidoAll,
    getPedidoById,
    postNewPedido
} from "../controllers/pedidoController";

const router = Router();

router.get("/", getPedidoAll);
router.get("/:id", getPedidoById);
router.post("/", postNewPedido);

export default router;