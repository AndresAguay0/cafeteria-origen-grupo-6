import { describe, expect, it } from 'vitest';
import { leerMesa } from '../../src/utils/mesa';

describe('leerMesa', () => {
  it('devuelve el número de mesa cuando es válido', () => {
    expect(leerMesa('?mesa=5')).toBe(5);
    expect(leerMesa('?mesa=12')).toBe(12);
  });

  it('devuelve null cuando no hay mesa', () => {
    expect(leerMesa('')).toBeNull();
  });

  it('devuelve null cuando la mesa es inválida', () => {
    expect(leerMesa('?mesa=abc')).toBeNull();
    expect(leerMesa('?mesa=-2')).toBeNull();
    expect(leerMesa('?mesa=0')).toBeNull();
  });
});