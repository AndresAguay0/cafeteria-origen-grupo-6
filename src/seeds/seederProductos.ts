import db from "../config/database";

export const runSeedProducto = () => {
    try {
        const totalProductos = db
            .prepare("SELECT COUNT(*) as total FROM productos")
            .get() as { total: number };

        if (totalProductos.total === 0) {
            console.log("Ejecutando seeder con el catálogo de la cafetería");

            const insertStmt = db.prepare(`
                INSERT INTO productos (nombre, precio_base, tipo, tipo_preparacion, tamano, gramos_cafe, variedad, precio_por_gramo)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `);

            const productosCatalogo = [
                // --- EXPRESOS (1 al 9) ---
                ["Expreso Pocillo - Brasil", 2500, "Cafe", "Expreso", "Pocillo", 18, "Brasil", 140],
                ["Expreso Pocillo - Colombia", 2500, "Cafe", "Expreso", "Pocillo", 18, "Colombia", 180],
                ["Expreso Pocillo - Etiopía", 2500, "Cafe", "Expreso", "Pocillo", 18, "Etiopía", 240],
                
                ["Expreso Mediano - Brasil", 2500, "Cafe", "Expreso", "Mediano", 27, "Brasil", 140],
                ["Expreso Mediano - Colombia", 2500, "Cafe", "Expreso", "Mediano", 27, "Colombia", 180],
                ["Expreso Mediano - Etiopía", 2500, "Cafe", "Expreso", "Mediano", 27, "Etiopía", 240],
                
                ["Expreso Taza grande - Brasil", 2500, "Cafe", "Expreso", "Taza grande", 36, "Brasil", 140],
                ["Expreso Taza grande - Colombia", 2500, "Cafe", "Expreso", "Taza grande", 36, "Colombia", 180],
                ["Expreso Taza grande - Etiopía", 2500, "Cafe", "Expreso", "Taza grande", 36, "Etiopía", 240],

                // --- FILTRADOS (10 al 18) ---
                ["Filtrado Pocillo - Brasil", 3200, "Cafe", "Filtrado", "Pocillo", 6, "Brasil", 140],
                ["Filtrado Pocillo - Colombia", 3200, "Cafe", "Filtrado", "Pocillo", 6, "Colombia", 180],
                ["Filtrado Pocillo - Etiopía", 3200, "Cafe", "Filtrado", "Pocillo", 6, "Etiopía", 240],
                
                ["Filtrado Mediano - Brasil", 3200, "Cafe", "Filtrado", "Mediano", 15, "Brasil", 140],
                ["Filtrado Mediano - Colombia", 3200, "Cafe", "Filtrado", "Mediano", 15, "Colombia", 180],
                ["Filtrado Mediano - Etiopía", 3200, "Cafe", "Filtrado", "Mediano", 15, "Etiopía", 240],
                
                ["Filtrado Taza grande - Brasil", 3200, "Cafe", "Filtrado", "Taza grande", 25, "Brasil", 140],
                ["Filtrado Taza grande - Colombia", 3200, "Cafe", "Filtrado", "Taza grande", 25, "Colombia", 180],
                ["Filtrado Taza grande - Etiopía", 3200, "Cafe", "Filtrado", "Taza grande", 25, "Etiopía", 240],

                // --- PASTELERÍA (19 y 20) ---
                ["Muffin de chocolate", 2500, "Pasteleria", null, null, null, null, null],
                ["Torta selva negra", 4200, "Pasteleria", null, null, null, null, null]
            ];

            const insertMany = db.transaction((productos) => {
                for (const p of productos) {
                    insertStmt.run(...p);
                }
            });

            insertMany(productosCatalogo);
            console.log("Seeder: 20 productos insertados exitosamente");
        }
    } catch (error) {
        console.error("Error al ejecutar el seeder:", error);
    }
};