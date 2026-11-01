import { describe, it, expect } from "vitest";
import { Cafe, Pasteleria } from "../../src/models/index";
import { productoToResponse } from "../../src/mappers/productoMapper";

describe("productoToResponse", () => {
    it("agrega precio y tipo (expreso) a un café expreso", () => {
        const cafe = new Cafe({
            id: 5,
            nombre: "Expreso Mediano",
            precioBase: 3000,
            tipoPreparacion: "Expreso",
            tamano: "Mediano",
            gramosCafe: 27,
            variedad: "Colombia",
            precioPorGramo: 100,
        });

        expect(productoToResponse(cafe)).toMatchObject({
            id: 5,
            nombre: "Expreso Mediano",
            tipo: "expreso",
            precio: 5700,
        });
    });

    it("agrega tipo (filtrado) a un café filtrado", () => {
        const cafe = new Cafe({
            id: 6,
            nombre: "Filtrado Taza grande",
            precioBase: 3000,
            tipoPreparacion: "Filtrado",
            tamano: "Taza grande",
            gramosCafe: 30,
            variedad: "Brasil",
            precioPorGramo: 100,
        });

        expect(productoToResponse(cafe)).toMatchObject({
            tipo: "filtrado",
            precio: 6000,
        });
    });

    it("agrega tipo (pasteleria) y precio igual al precio base", () => {
        const muffin = new Pasteleria({
            id: 19,
            nombre: "Muffin de chocolate",
            precioBase: 2500,
        });

        expect(productoToResponse(muffin)).toMatchObject({
            id: 19,
            tipo: "pasteleria",
            precio: 2500,
        });
    });

    it("tira error si el tipo de preparación es desconocido", () => {
        const cafe = new Cafe({
            id: 7,
            nombre: "Café raro",
            precioBase: 3000,
            tipoPreparacion: "Cold brew",
            tamano: "Mediano",
            gramosCafe: 20,
            variedad: "Brasil",
            precioPorGramo: 100,
        });

        expect(() => productoToResponse(cafe)).toThrow("Tipo de preparación desconocido");
    });

    it.each([
        ["Colombia", "Acidez media, cuerpo equilibrado y notas cítricas y florales"],
        ["Etiopía", "Acidez muy viva, cuerpo ligero y notas frutales"],
        ["Brasil", "Acidez baja, cuerpo denso y notas de avellana"],
    ])("devuelve la variedad con su descripción", (variedad, descripcion) => {
        const cafe = new Cafe({
            id: 8,
            nombre: `Expreso Mediano - ${variedad}`,
            precioBase: 2500,
            tipoPreparacion: "Expreso",
            tamano: "Mediano",
            gramosCafe: 27,
            variedad,
            precioPorGramo: 180,
        });

        expect(productoToResponse(cafe)).toMatchObject({
            variedad: { nombre: variedad, descripcion },
        });
    });

    it("no incluye variedad en la pastelería", () => {
        const muffin = new Pasteleria({
            id: 19,
            nombre: "Muffin de chocolate",
            precioBase: 2500,
        });

        expect(productoToResponse(muffin)).not.toHaveProperty("variedad");
    });
});