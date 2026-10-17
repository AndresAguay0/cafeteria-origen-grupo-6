import { Producto } from "./Producto";

export interface PasteleriaProps {
    id?: number;
    nombre: string;
    precioBase: number;
}

export class Pasteleria extends Producto {
    constructor(props: PasteleriaProps) {
        super(props.nombre, props.precioBase, props.id);
    }

    calcularPrecio(): number {
        return this.precioBase;
    }
}