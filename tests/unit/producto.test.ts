import { describe, it, expect } from "vitest";
import { Cafe, Pasteleria } from "../../src/models/producto.js";
import { isValidApiRequest } from "vitest/node";

describe("Clases Producto y cálculo de precios", () => {
    it("calcular correctamente precio final (Cafe expreso, pocillo, Brasil", () => {

        const expresoBrasil = new Cafe({
            nombre: "Café Expreso Brasil",
            precioBase: 2500,
            tipoPreparacion: "Expreso",
            tamano: "Pocillo",
            gramosCafe: 18,
            variedad: "Brasil",
            precioPorGramo: 140
        });

        expect(expresoBrasil.calcularPrecio()).toBe(5020);
    });

    it("calcular correctamente precio final (Torta selva negra)", () => {

        const torta = new Pasteleria({
            nombre: "Porcion de torta selva negra",
            precioBase: 4200
        });

        expect(torta.calcularPrecio()).toBe(4200);
    });
});