import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { createPannellumAdapter } from './adapters/pannellumAdapter';
import './VirtualTourViewer.css';

/**
 * Універсальний компонент для 360° панорам.
 * Залежить від абстракції (adapter), а не від конкретної бібліотеки.
 *
 * @param {Object} props
 * @param {string} props.src - URL equirectangular-зображення
 * @param {Object} [props.adapter] - кастомний адаптер (для тестів)
 */
function VirtualTourViewer({ src, adapter }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || !src) return;

    // Використовуємо переданий адаптер (для тестів) або реальний Pannellum
    const activeAdapter = adapter || createPannellumAdapter();

    activeAdapter.mount(containerRef.current, src);

    return () => {
      activeAdapter.destroy();
    };
  }, [src, adapter]);

  return (
    <div className="virtual-tour">
      <div className="virtual-tour__container" ref={containerRef} />
      <div className="virtual-tour__overlay">
        <span className="virtual-tour__badge">360°</span>
        <span className="virtual-tour__hint">Затисни ЛКМ та тягни, щоб оглянутись</span>
      </div>
    </div>
  );
}

VirtualTourViewer.propTypes = {
  src: PropTypes.string.isRequired,
  adapter: PropTypes.shape({
    mount: PropTypes.func.isRequired,
    destroy: PropTypes.func.isRequired,
  }),
};

export default VirtualTourViewer;
