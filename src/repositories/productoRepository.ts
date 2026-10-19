import type Database from "better-sqlite3";
import { Producto, Cafe, Pasteleria } from "../models/index";
import { th } from "zod/v4/locales/index.js";

export interface ProductoRepository {
    create(producto: Producto): Producto;
    findAll(): Producto[];
    findById(id: number): Producto | undefined;
}

export class SqliteProductoRepository implements ProductoRepository {
    constructor(private readonly db: Database.Database) {}

    create(producto: Producto): Producto {
        const stmt = this.db.prepare(`
            INSERT INTO productos (nombre, precio_base, tipo, tipo_preparacion, tamano, gramos_cafe, variedad, precio_por_gramo)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `);

        const esCafe = producto instanceof Cafe;
        const tipo = esCafe ? "Cafe" : "Pasteleria";
        const tipoPreparacion = esCafe ? producto.tipoPreparacion  : null;
        const tamano = esCafe ? producto.tamano : null;
        const gramosCafe = esCafe ? producto.gramosCafe : null;
        const variedad = esCafe ? producto.variedad : null;
        const precioPorGramo = esCafe ? producto.precioPorGramo : null;

        const info = stmt.run(
            producto.nombre,
            producto.precioBase,
            tipo,
            tipoPreparacion,
            tamano,
            gramosCafe,
            variedad,
            precioPorGramo
        );

        return this.findById(Number(info.lastInsertRowid))!;
    }

    findAll(): Producto[] {
        const rows = this.db.prepare(`SELECT * FROM productos`).all();
        return rows.map(rowToProducto);
    }

    findById(id: number): Producto | undefined {
        const row = this.db.prepare(`SELECT * FROM productos WHERE id = ?`).get(id);
        return row ? rowToProducto(row) : undefined;
    }
}

function rowToProducto(row: any): Producto {
    if (row.tipo === "Cafe") {
        return new Cafe({
            id: row.id,
            nombre: row.nombre,
            precioBase: row.precio_base,
            tipoPreparacion: row.tipo_preparacion,
            tamano: row.tamano,
            gramosCafe: row.gramos_cafe,
            variedad: row.variedad,
            precioPorGramo: row.precio_por_gramo,
        });
    } else {
        return new Pasteleria({
            id: row.id,
            nombre: row.nombre,
            precioBase: row.precio_base,
        });
    }
}