import express from "express";
import pedidoRoutes from "./routes/pedidoRoutes";

const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
    res.json({ status: "OK", message: "Cafetería Origen API funcionando"});
});

app.use("/pedidos", pedidoRoutes);

export default app;