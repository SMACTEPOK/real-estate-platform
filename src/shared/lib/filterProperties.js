/**
 * Фільтрує масив об'єктів нерухомості за пошуковим запитом і типом угоди.
 *
 * Чиста функція: не звертається до DOM і глобального стану, не мутує
 * вхідний масив, стійка до некоректних входів.
 *
 * @param {ReadonlyArray<Object>} properties
 * @param {{ search?: string, deal?: 'all'|'sale'|'rent' }} [filters]
 * @returns {Array}
 */
export function applyFilters(properties, filters = {}) {
  if (!Array.isArray(properties)) {
    return [];
  }

  const { search = '', deal = 'all' } = filters;
  const query = String(search).trim().toLowerCase();

  return properties.filter((property) => {
    if (deal !== 'all' && property.deal !== deal) {
      return false;
    }

    if (!query) {
      return true;
    }

    const haystack = [
      property.title ?? '',
      property.city ?? '',
      property.district ?? '',
      property.address ?? '',
    ]
      .join(' ')
      .toLowerCase();

    return haystack.includes(query);
  });
}
