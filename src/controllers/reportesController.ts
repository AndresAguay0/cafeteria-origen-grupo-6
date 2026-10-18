import { Request, Response } from "express";
import db from "../config/database";
import { SqlitePedidoRepository } from "../repositories/pedidoRepository";
import { SqliteProductoRepository } from "../repositories/productoRepository";
import {
    calcularFacturacionTotal,
    calcularCantidadVendidaPorProducto,
    obtenerProductoMasVendido
} from "../services/reportesService";

const pedidoRepository = new SqlitePedidoRepository(db);
const productoRepository = new SqliteProductoRepository(db);


// Obtiene la facturación total
const getFacturacion = (req: Request, res: Response) => {
    try {
        const pedidos = pedidoRepository.findAll();
        const productos = productoRepository.findAll();

        const facturacion = calcularFacturacionTotal(
            pedidos,
            productos.filter(
                (producto): producto is typeof producto & { id: number } =>
                    producto.id !== undefined
            )
        );
        return res.status(200).json({ facturacion });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: "No se pudo calcular la facturación"
        });
    }
};


// Obtiene el producto más vendido
const getMasVendido = (req: Request, res: Response) => {
    try {
        const pedidos = pedidoRepository.findAll();

        const cantidades = calcularCantidadVendidaPorProducto(pedidos);
        const resultado = obtenerProductoMasVendido(cantidades);

        if (!resultado) {
            return res.status(404).json({
                error: "No existen ventas registradas"
            });
        }

        const producto = productoRepository.findById(
            resultado.productoId
        );

        if (!producto) {
            return res.status(404).json({
                error: "No se pudo encontrar el producto"
            });
        }

        return res.status(200).json({
            productoId: resultado.productoId,
            nombre: producto.nombre,
            cantidad: resultado.cantidad
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: "No se pudo obtener el producto más vendido"
        });
    }
};

export { getFacturacion, getMasVendido };