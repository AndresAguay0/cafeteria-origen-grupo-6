import { Request, Response } from "express";
import db from "../config/database";
import { runSeedProducto } from "../seeds/seederProductos";

// Vacía productos y pedidos, y reinicia los contadores de id
const resetDatos = (_req: Request, res: Response) => {
    db.exec(`
        DELETE FROM pedido_items;
        DELETE FROM pedidos;
        DELETE FROM productos;
        DELETE FROM sqlite_sequence
            WHERE name IN ('pedido_items', 'pedidos', 'productos');
    `);

    return res.status(204).send();
};

// Carga el catálogo y responde cuántos productos quedaron
const cargarSeed = (_req: Request, res: Response) => {
    runSeedProducto();

    const { total } = db
        .prepare("SELECT COUNT(*) AS total FROM productos")
        .get() as { total: number };

    return res.status(200).json({ productos: total });
};

export { resetDatos, cargarSeed };