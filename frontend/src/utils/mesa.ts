export function leerMesa(search: string): number | null {
  const parametros = new URLSearchParams(search);
  const mesaTexto = parametros.get('mesa');

  if (mesaTexto === null || !/^[1-9]\d*$/.test(mesaTexto)) {
    return null;
  }

  const mesa = Number(mesaTexto);

  if (!Number.isSafeInteger(mesa)) {
    return null;
  }

  return mesa;
}
