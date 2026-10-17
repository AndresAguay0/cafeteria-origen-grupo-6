import express from "express";

const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
    res.json({ status: "OK", message: "Cafetería Origen API funcionando"});
});

export default app;