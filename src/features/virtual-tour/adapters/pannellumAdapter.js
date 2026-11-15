import 'pannellum/build/pannellum.css';
import 'pannellum/build/pannellum.js';

/**
 * Адаптер над бібліотекою Pannellum.
 *
 * Це конкретна реалізація інтерфейсу PanoramaAdapter.
 * Головна ідея: VirtualTourViewer не імпортує Pannellum напряму.
 * Якщо завтра ми вирішимо перейти на Three.js або Photo Sphere Viewer,
 * достатньо написати новий адаптер і передати його у viewer.
 */
export function createPannellumAdapter() {
  let viewerInstance = null;

  return {
    /**
     * Монтує панораму в контейнер.
     * @param {HTMLElement} container
     * @param {string} panoramaUrl
     * @param {Object} [options]
     */
    mount(container, panoramaUrl, options = {}) {
      if (!container || !panoramaUrl) return;

      // Pannellum експортує себе в глобальний об'єкт window
      viewerInstance = window.pannellum.viewer(container, {
        type: 'equirectangular',
        panorama: panoramaUrl,
        autoLoad: true,
        compass: false,
        showControls: true,
        ...options,
      });
    },

    /**
     * Знищує інстанс, щоб уникнути memory leak.
     */
    destroy() {
      if (viewerInstance) {
        viewerInstance.destroy();
        viewerInstance = null;
      }
    },
  };
}
