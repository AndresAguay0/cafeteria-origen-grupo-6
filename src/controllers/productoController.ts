import { Request, Response } from "express";
import { SqliteProductoRepository } from "../repositories/productoRepository";
import db from "../config/database";

const productoRepository = new SqliteProductoRepository(db);


// Obtiene todos los productos
const getProductos = (req: Request, res: Response) => {
    try {
        const productos = productoRepository.findAll();
        return res.status(200).json(productos);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: "No se pudieron obtener los productos"
        });
    }
};


// Obtiene un producto en específico por su ID
const getProductoById = (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                error: "ID del producto inválido"
            });
        }

        const producto = productoRepository.findById(id);

        if (!producto) {
            return res.status(404).json({
                error: "Producto no encontrado"
            });
        }

        return res.status(200).json(producto);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: "No se pudo obtener el producto"
        });
    }
};

export { getProductos, getProductoById };