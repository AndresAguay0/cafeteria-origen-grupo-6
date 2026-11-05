import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SelectorCafe from '../../src/components/SelectorCafe.tsx'
import { obtenerProductos } from '../../src/api/apiClient'

vi.mock('../../src/api/apiClient', () => ({
    obtenerProductos: vi.fn(),
}))

beforeEach(() => {
    vi.mocked(obtenerProductos).mockReset()
    vi.mocked(obtenerProductos).mockResolvedValue([])
})

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

    it('habilita Agregar al completar las tres elecciones', async () => {
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

        await usuario.selectOptions(
            screen.getByRole('combobox', { name: /origen/i }),
            'Brasil'
        )

        expect(
            screen.getByRole('button', { name: /agregar/i })
        ).toBeEnabled()
    })

    it('muestra la descripción del origen elegido desde la API', async () => {
        const usuario = userEvent.setup()

        const descripcion = 'Acidez baja, cuerpo denso y notas de avellana.'

        vi.mocked(obtenerProductos).mockResolvedValue([
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
                descripcion,
            },
            precioPorGramo: 140,
            },
        ])

        render(<SelectorCafe />)

        await usuario.selectOptions(
            screen.getByRole('combobox', { name: /bebida/i }),
            'Expreso'
        )

        await usuario.selectOptions(
            screen.getByRole('combobox', { name: /tamaño/i }),
            'Pocillo'
        )

        await usuario.selectOptions(
            screen.getByRole('combobox', { name: /origen/i }),
            'Brasil'
        )

        expect(await screen.findByText(descripcion)).toBeInTheDocument()
    })

    it('muestra el precio de la combinación elegida desde la API', async () => {
        const usuario = userEvent.setup()

        vi.mocked(obtenerProductos).mockResolvedValue([
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
            {
            id: 2,
            nombre: 'Expreso Mediano - Brasil',
            precioBase: 2500,
            precio: 6280,
            tipo: 'expreso',
            tipoPreparacion: 'Expreso',
            tamano: 'Mediano',
            gramosCafe: 27,
            variedad: {
                nombre: 'Brasil',
                descripcion: 'Acidez baja, cuerpo denso y notas de avellana.',
            },
            precioPorGramo: 140,
            },
        ])

        render(<SelectorCafe />)

        await usuario.selectOptions(
            screen.getByRole('combobox', { name: /bebida/i }),
            'Expreso'
        )

        await usuario.selectOptions(
            screen.getByRole('combobox', { name: /tamaño/i }),
            'Pocillo'
        )

        await usuario.selectOptions(
            screen.getByRole('combobox', { name: /origen/i }),
            'Brasil'
        )

        expect(await screen.findByText('Precio: $5020')).toBeInTheDocument()

        await usuario.selectOptions(
            screen.getByRole('combobox', { name: /tamaño/i }),
            'Mediano'
        )

        expect(await screen.findByText('Precio: $6280')).toBeInTheDocument()
        expect(screen.queryByText('Precio: $5020')).not.toBeInTheDocument()
    })

    it('deshabilita Agregar y oculta el precio al vaciar el tamaño', async () => {
        const usuario = userEvent.setup()

        vi.mocked(obtenerProductos).mockResolvedValue([
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
        ])

        render(<SelectorCafe />)

        await usuario.selectOptions(
            screen.getByRole('combobox', { name: /bebida/i }),
            'Expreso'
        )

        await usuario.selectOptions(
            screen.getByRole('combobox', { name: /tamaño/i }),
            'Pocillo'
        )

        await usuario.selectOptions(
            screen.getByRole('combobox', { name: /origen/i }),
            'Brasil'
        )

        expect(await screen.findByText('Precio: $5020')).toBeInTheDocument()

        const boton = screen.getByRole('button', { name: /agregar/i })
        expect(boton).toBeEnabled()

        // Volver a la opción “Elegí un tamaño”
        await usuario.selectOptions(
            screen.getByRole('combobox', { name: /tamaño/i }),
            ''
        )

        expect(boton).toBeDisabled()
        expect(screen.queryByText('Precio: $5020')).not.toBeInTheDocument()
    })

    it('actualiza descripción y precio al cambiar el origen', async () => {
        const usuario = userEvent.setup()

        const descripcionBrasil =
            'Acidez baja, cuerpo denso y notas de avellana.'
        const descripcionColombia =
            'Acidez media, cuerpo equilibrado y notas cítricas y florales.'

        vi.mocked(obtenerProductos).mockResolvedValue([
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
                descripcion: descripcionBrasil,
            },
            precioPorGramo: 140,
            },
            {
            id: 2,
            nombre: 'Expreso Pocillo - Colombia',
            precioBase: 2500,
            precio: 5740,
            tipo: 'expreso',
            tipoPreparacion: 'Expreso',
            tamano: 'Pocillo',
            gramosCafe: 18,
            variedad: {
                nombre: 'Colombia',
                descripcion: descripcionColombia,
            },
            precioPorGramo: 180,
            },
        ])

        render(<SelectorCafe />)

        await usuario.selectOptions(
            screen.getByRole('combobox', { name: /bebida/i }),
            'Expreso'
        )

        await usuario.selectOptions(
            screen.getByRole('combobox', { name: /tamaño/i }),
            'Pocillo'
        )

        const selectorOrigen = screen.getByRole('combobox', {
            name: /origen/i,
        })

        await usuario.selectOptions(selectorOrigen, 'Brasil')

        expect(await screen.findByText(descripcionBrasil)).toBeInTheDocument()
        expect(await screen.findByText('Precio: $5020')).toBeInTheDocument()

        await usuario.selectOptions(selectorOrigen, 'Colombia')

        expect(await screen.findByText(descripcionColombia)).toBeInTheDocument()
        expect(await screen.findByText('Precio: $5740')).toBeInTheDocument()

        expect(screen.queryByText(descripcionBrasil)).not.toBeInTheDocument()
        expect(screen.queryByText('Precio: $5020')).not.toBeInTheDocument()
    })
})