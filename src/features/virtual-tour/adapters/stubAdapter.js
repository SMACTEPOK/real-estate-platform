/**
 * Заглушка адаптера для юніт-тестів.
 * Дозволяє тестувати VirtualTourViewer без реальної бібліотеки Pannellum.
 */
export function createStubAdapter() {
  return {
    mount: () => {
      /* no-op */
    },
    destroy: () => {
      /* no-op */
    },
  };
}
