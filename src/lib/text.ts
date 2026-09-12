// Türkçe arama için sadeleştirme: küçük harf, şapka ve çengelleri at, ı yerine i.
export function normalizeTr(value: string): string {
  return value
    .toLocaleLowerCase('tr')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/ı/g, 'i');
}
