export abstract class Producto {

    id?: number;
    nombre: string;
    precioBase: number;

    constructor(nombre: string, precioBase: number, id?: number) {
        this.id = id;
        this.nombre = nombre;
        this.precioBase = precioBase;
    }

    abstract calcularPrecio(): number;
}