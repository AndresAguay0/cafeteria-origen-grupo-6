import { createContext, type Dispatch } from 'react';

import type {
  AccionCarrito,
  ItemCarrito,
} from './carritoReducer';

export type CartContextType = {
  items: ItemCarrito[];
  dispatch: Dispatch<AccionCarrito>;
};

export const CartContext = createContext<CartContextType | undefined>(
  undefined
);
