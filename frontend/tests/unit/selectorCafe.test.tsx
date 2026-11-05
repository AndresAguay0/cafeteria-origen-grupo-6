import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SelectorCafe from '../../src/components/SelectorCafe.tsx'

describe('SelectorCafe', () => {
  it('mantiene Agregar deshabilitado al inicio', () => {
    render(<SelectorCafe />)

    const boton = screen.getByRole('button', { name: /agregar/i })

    expect(boton).toBeDisabled()
  })

  it('mantiene Agregar deshabilitado si falta elegir el origen', async () => {
    const usuario = userEvent.setup()
    render(<SelectorCafe />)

    await usuario.selectOptions(
      screen.getByRole('combobox', { name: /bebida/i }),
      'Expreso'
    )

    await usuario.selectOptions(
      screen.getByRole('combobox', { name: /tamaño/i }),
      'Pocillo'
    )

    expect(
      screen.getByRole('combobox', { name: /origen/i })
    ).toHaveValue('')

    expect(
      screen.getByRole('button', { name: /agregar/i })
    ).toBeDisabled()
  })
})