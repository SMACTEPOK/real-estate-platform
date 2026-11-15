import { useParams, Link, useNavigate } from 'react-router-dom';
import { useProperty } from '@entities/property/useProperty';
import VirtualTourViewer from '@features/virtual-tour/VirtualTourViewer';
import Spinner from '@shared/ui/Spinner/Spinner';
import ErrorState from '@shared/ui/ErrorState/ErrorState';
import './VirtualTourPage.css';

function VirtualTourPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { status, item: property, error } = useProperty(id);

  if (status === 'loading') {
    return (
      <div className="tour-page">
        <Spinner label="Завантаження туру…" />
      </div>
    );
  }

  if (status === 'error' || !property || !property.panorama) {
    return (
      <div className="tour-page">
        <ErrorState title="Тур недоступний" message={error || 'Для цього об’єкта немає панорами.'} />
        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <button type="button" className="tour-page__back-btn" onClick={() => navigate(-1)}>
            ← Повернутися
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="tour-page">
      <header className="tour-page__header">
        <div>
          <h1 className="tour-page__title">360° ТУР</h1>
          <p className="tour-page__subtitle">{property.title}</p>
        </div>
        <Link to={`/property/${property.id}`} className="tour-page__back-btn">
          ✕ Закрити тур
        </Link>
      </header>

      <div className="tour-page__viewer">
        <VirtualTourViewer src={property.panorama} />
      </div>
    </div>
  );
}

export default VirtualTourPage;
