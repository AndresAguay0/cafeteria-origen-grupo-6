import app from "./app";
import { runSeedProducto } from "./seeds/seederProductos";
import { runSeedPedido } from "./seeds/seederPedidos";

const PORT = process.env.PORT || 4000;

// Correr seeders
runSeedProducto();
runSeedPedido();


app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});