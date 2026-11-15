import './RouteFallback.css';

function RouteFallback() {
  return (
    <div className="route-fallback" role="status" aria-live="polite">
      <p className="route-fallback__text">Завантаження сторінки…</p>
    </div>
  );
}

export default RouteFallback;
