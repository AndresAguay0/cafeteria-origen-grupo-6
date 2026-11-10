import type { Request, Response, NextFunction } from "express";

// Ruta que no existe
export function notFoundHandler(_req: Request, res: Response) {
    return res.status(404).json({ error: "Ruta no encontrada" });
}

// Errores fuera de los controllers o del parseo del body
export function errorHandler(
    err: unknown,
    _req: Request,
    res: Response,
    _next: NextFunction
) {
    if (esJsonInvalido(err)) {
        return res.status(400).json({ error: "JSON inválido" });
    }

    console.error(err);

    return res.status(500).json({ error: "Error interno del servidor" });
}

function esJsonInvalido(err: unknown): boolean {
    return (
        typeof err === "object" &&
        err !== null &&
        "type" in err &&
        err.type === "entity.parse.failed"
    );
}