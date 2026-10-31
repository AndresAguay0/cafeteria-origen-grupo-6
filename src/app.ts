import express from "express";
import pedidoRoutes from "./routes/pedidoRoutes";
import productoRoutes from "./routes/productoRoutes";
import reportesRoutes from "./routes/reportesRoutes";

const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
    res.json({ status: "OK", message: "Cafetería Origen API funcionando"});
});

app.use("/pedidos", pedidoRoutes);
app.use("/productos", productoRoutes);
app.use("/reportes", reportesRoutes);

export default app;