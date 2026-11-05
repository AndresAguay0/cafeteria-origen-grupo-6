import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import SelectorCafe from '../../src/components/SelectorCafe'

describe('SelectorCafe', () => {
  it('mantiene Agregar deshabilitado al inicio', () => {
    // Preparar: mostrar el componente
    render(<SelectorCafe />)

    // Buscar el botón
    const boton = screen.getByRole('button', { name: /agregar/i })

    // Comprobar
    expect(boton).toBeDisabled()
  })
})