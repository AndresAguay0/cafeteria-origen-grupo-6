import { useReducer, type ReactNode } from 'react';

import {
  carritoReducer,
  estadoInicialCarrito,
} from './carritoReducer';

import { CartContext } from './cartContextDefinition';

export function CartProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [items, dispatch] = useReducer(
    carritoReducer,
    estadoInicialCarrito
  );

  return (
    <CartContext.Provider value={{ items, dispatch }}>
      {children}
    </CartContext.Provider>
  );
}
