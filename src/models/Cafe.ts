import { Producto } from "./Producto";

export interface CafeProps {
    id?: number;
    nombre: string;
    precioBase: number;
    tipoPreparacion: string;
    tamano: string;
    gramosCafe: number;
    variedad: string;
    precioPorGramo: number;
}

export class Cafe extends Producto {

    tipoPreparacion: string;
    tamano: string;
    gramosCafe: number;
    variedad: string;
    precioPorGramo: number;

    constructor(props: CafeProps) {
        super(props.nombre, props.precioBase, props.id);
        this.tipoPreparacion = props.tipoPreparacion;
        this.tamano = props.tamano;
        this.gramosCafe = props.gramosCafe;
        this.variedad = props.variedad;
        this.precioPorGramo = props.precioPorGramo;
    }

    calcularPrecio(): number {
        const costoCafe = this.gramosCafe * this.precioPorGramo;
        return this.precioBase + costoCafe;
    }
}