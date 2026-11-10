import { http, HttpResponse } from 'msw';
import type { RequestHandler } from 'msw';

export const handlers: RequestHandler[] = [
  http.get('http://localhost:4000/productos', () => {
    return HttpResponse.json([
      {
        id: 1,
        nombre: 'Expreso Pocillo - Brasil',
        precioBase: 2500,
        precio: 5020,
        tipo: 'expreso',
        tipoPreparacion: 'Expreso',
        tamano: 'Pocillo',
        gramosCafe: 18,
        variedad: {
          nombre: 'Brasil',
          descripcion: 'Acidez baja, cuerpo denso y notas de avellana.',
        },
        precioPorGramo: 140,
      },
    ]);
  }),
];
