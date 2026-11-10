import { useContext } from 'react';
import { CartContext } from './cartContextDefinition';

export function useCart() {
  const context = useContext(CartContext);

  if (context === undefined) {
    throw new Error(
      'useCart debe utilizarse dentro de CartProvider'
    );
  }

  return context;
}