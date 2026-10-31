import db from "../config/database";

export const runSeedPedido = () => {
    try {
        const totalPedidos = db
            .prepare("SELECT COUNT(*) as total FROM pedidos")
            .get() as { total: number };

        if (totalPedidos.total === 0) {
            console.log("Ejecutando seeder de pedidos...");

            const pedidosCatalogo = [
                {
                    estado: "pendiente",
                    items: [
                        { productoId: 1, cantidad: 2 },
                        { productoId: 19, cantidad: 1 }
                    ]
                },
                {
                    estado: "en_preparacion",
                    items: [
                        { productoId: 5, cantidad: 1 },
                        { productoId: 20, cantidad: 1 }
                    ]
                },
                {
                    estado: "entregado",
                    items: [
                        { productoId: 12, cantidad: 3 }
                    ]
                }
            ];

            const insertarPedidoTransaccion = db.transaction((pedidos) => {
                const insertPedidoStmt = db.prepare("INSERT INTO pedidos (estado) VALUES (?)");
                const insertItemStmt = db.prepare(`
                    INSERT INTO pedido_items (pedido_id, producto_id, cantidad)
                    VALUES (?, ?, ?)
                `);

                for (const p of pedidos) {
                    const resultado = insertPedidoStmt.run(p.estado);
                    const pedidoId = Number(resultado.lastInsertRowid);

                    for (const item of p.items) {
                        insertItemStmt.run(pedidoId, item.productoId, item.cantidad);
                    }
                }
            });

            insertarPedidoTransaccion(pedidosCatalogo);
            console.log("Seeder: Pedidos insertados exitosamente");
        }
    } catch (error) {
        console.error("Error al ejecutar el seeder de pedidos:", error);
    }
};