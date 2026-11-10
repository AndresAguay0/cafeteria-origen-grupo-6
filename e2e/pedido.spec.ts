import { test, expect } from '@playwright/test';

test.beforeEach(async ({ request }) => {
    // Dejamos la base de datos limpia.
    const reset = await request.post(
        'http://127.0.0.1:4000/__test__/reset'
    );

    expect(reset.status()).toBe(204);

    // Cargamos los 20 productos del catalogo.
    const seed = await request.post(
        'http://127.0.0.1:4000/__test__/seed'
    );

    expect(seed.status()).toBe(200);
});

test('Debe permitir crear un pedido desde el menú', async ({ page }) => {
    // 1. Ingresamos al menu de la mesa 4.
    await page.goto('/?mesa=4', {
        waitUntil: 'domcontentloaded',
    });

    await expect(
        page.getByRole('heading', {
            name: 'Cafetería Origen',
            exact: true,
        })
    ).toBeVisible();

    // 2. Seleccionamos un cafe.
    await page.getByLabel('1. Bebida').selectOption('Expreso');
    await page.getByLabel('2. Tamaño').selectOption('Mediano');
    await page.getByLabel('3. Origen').selectOption('Colombia');

    // 3. Agregamos el cafe al carrito.
    await page.getByRole('button', {
        name: 'Agregar',
        exact: true,
    }).click();

    // 4. Agregamos un muffin.
    await page.getByRole('button', {
        name: 'Agregar Muffin de chocolate',
    }).click();

    // 5. Comprobamos que ambos productos esten en el carrito.
    await expect(
        page.getByRole('heading', { name: 'Tu carrito' })
    ).toBeVisible();

    await expect(
        page.getByRole('heading', { name: /Expreso/ })
    ).toBeVisible();

    await expect(
        page.getByRole('list').getByRole('heading', {
            name: 'Muffin de chocolate',
        })
    ).toBeVisible();
    
    // 6. Confirmamos el pedido.
    await page.getByRole('button', {
        name: 'Confirmar pedido',
    }).click();

    // 7. Verificamos la confirmacion.
    await expect(
        page.getByRole('heading', {
            name: '¡Pedido confirmado!',
        })
    ).toBeVisible();

    await expect(page.getByText('pendiente', { exact: true }))
        .toBeVisible();

    await expect(page.getByText('Mesa: 4', { exact: true }))
        .toBeVisible();

    await expect(page.getByText('Total: $9860', { exact: true }))
        .toBeVisible();
});
