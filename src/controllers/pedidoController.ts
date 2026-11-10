import { Request, Response } from "express";
import { Pedido } from "../models/index";
import { SqlitePedidoRepository } from "../repositories/pedidoRepository";
import { SqliteProductoRepository } from "../repositories/productoRepository";
import { pedidoToResponse } from "../mappers/pedidoMapper";
import db from "../config/database";

const pedidoRepository = new SqlitePedidoRepository(db);
const productoRepository = new SqliteProductoRepository(db);

// Obtener todos los pedidos
const getPedidoAll = (req: Request, res: Response) => {
    try {
        const pedidos = pedidoRepository.findAll();
        const productos = productoRepository.findAll();

        return res.status(200).json(
            pedidos.map((p) => pedidoToResponse(p, productos))
        );
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            error: "No se pudieron obtener los pedidos"
        });
    }
};

// Obtener un pedido por su ID
const getPedidoById = (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                error: "ID de pedido inválido"
            });
        }

        const pedido = pedidoRepository.findById(id);

        if (!pedido) {
            return res.status(404).json({
                error: "Pedido no encontrado"
            });
        }

        return res.status(200).json(
            pedidoToResponse(pedido, productoRepository.findAll())
        );
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            error: "No se pudo obtener el pedido"
        });
    }
};

// Crear un pedido nuevo
const postNewPedido = (req: Request, res: Response) => {
    try {
        const { items, estado, mesaId } = req.body ?? {};

        const estadoPedido = estado ?? "pendiente";

        if (
            !Array.isArray(items) ||
            items.length === 0 ||
            typeof estadoPedido !== "string" ||
            !estadoPedido.trim()
        ) {
            return res.status(400).json({
                error: "Datos del pedido inválidos"
            });
        }

        if (
            mesaId !== undefined &&
            mesaId !== null &&
            (!Number.isInteger(mesaId) || mesaId <= 0)
        ) {
            return res.status(400).json({
                error: "Mesa inválida"
            });
        }

        for (const item of items) {
            if (
                !Number.isInteger(item?.productoId) ||
                item.productoId <= 0 ||
                !Number.isInteger(item?.cantidad) ||
                item.cantidad <= 0
            ) {
                return res.status(400).json({
                    error: "Ítems del pedido inválidos"
                });
            }

            const producto = productoRepository.findById(
                item.productoId
            );

            if (!producto) {
                return res.status(400).json({
                    error: "Producto no encontrado"
                });
            }
        }

        const nuevoPedido = new Pedido(
            0,
            items,
            estadoPedido.trim(),
            mesaId ?? null
        );

        const pedidoCreado = pedidoRepository.create(nuevoPedido);

        return res.status(201).json(
            pedidoToResponse(pedidoCreado, productoRepository.findAll())
        );
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            error: "No se pudo crear el pedido"
        });
    }
};

export { getPedidoAll, getPedidoById, postNewPedido };