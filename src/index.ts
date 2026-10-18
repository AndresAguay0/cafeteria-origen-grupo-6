import app from "./app";
import { runSeedProducto } from "./seeds/seederProductos";

const PORT = process.env.PORT || 4000;

// Correr seeders
runSeedProducto();

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});