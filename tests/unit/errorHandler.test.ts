import { describe, it, expect, vi, afterEach } from "vitest";
import type { Request, Response, NextFunction } from "express";
import { errorHandler, notFoundHandler } from "../../src/middlewares/errorHandler";

function crearRespuesta() {
    const status = vi.fn();
    const json = vi.fn();
    const res = { status, json } as unknown as Response;
    status.mockReturnValue(res);
    return { res, status, json };
}

describe("notFoundHandler", () => {
    it("responde 404 con el mensaje en formato { error }", () => {
        const { res, status, json } = crearRespuesta();

        notFoundHandler({} as Request, res);

        expect(status).toHaveBeenCalledWith(404);
        expect(json).toHaveBeenCalledWith({ error: "Ruta no encontrada" });
    });
});

describe("errorHandler", () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("responde 400 cuando el body no es un JSON válido", () => {
        const { res, status, json } = crearRespuesta();
        const error = Object.assign(new SyntaxError("Unexpected token"), {
            status: 400,
            type: "entity.parse.failed",
        });

        errorHandler(error, {} as Request, res, vi.fn() as NextFunction);

        expect(status).toHaveBeenCalledWith(400);
        expect(json).toHaveBeenCalledWith({ error: "JSON inválido" });
    });

    it("responde 500 genérico, sin filtrar el detalle, ante un error inesperado", () => {
        vi.spyOn(console, "error").mockImplementation(() => {});
        const { res, status, json } = crearRespuesta();

        errorHandler(new Error("falló la base"), {} as Request, res, vi.fn() as NextFunction);

        expect(status).toHaveBeenCalledWith(500);
        expect(json).toHaveBeenCalledWith({ error: "Error interno del servidor" });
    });
});