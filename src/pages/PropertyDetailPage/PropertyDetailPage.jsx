import { useParams, Link, useNavigate } from 'react-router-dom';
import { useProperty } from '@entities/property/useProperty';
import Spinner from '@shared/ui/Spinner/Spinner';
import ErrorState from '@shared/ui/ErrorState/ErrorState';
import './PropertyDetailPage.css';

function PropertyDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { status, item: property, error } = useProperty(id);

  if (status === 'loading') {
    return (
      <div className="property-detail">
        <Spinner label="Завантаження об'єкта…" />
      </div>
    );
  }

  if (status === 'error' || !property) {
    return (
      <div className="property-detail">
        <ErrorState title="Об'єкт не знайдено" message={error} />
        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <button type="button" className="property-detail__btn" onClick={() => navigate('/catalog')}>
            ← Повернутися до каталогу
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="property-detail">
      <header className="property-detail__head">
        <Link to="/catalog" className="property-detail__back">
          ← Назад до каталогу
        </Link>
        <h1 className="property-detail__title">{property.title}</h1>
        <p className="property-detail__location">
          {property.city}, {property.district} · {property.address}
        </p>
      </header>

      <div className="property-detail__layout">
        {/* ЛІВА КОЛОНКА: Медіа та опис */}
        <div className="property-detail__main">
          <div className="property-detail__media">
            <img src={property.image} alt={property.title} className="property-detail__image" />
            {property.panorama && (
              <Link to={`/property/${property.id}/tour`} className="property-detail__tour-btn">
                <span>360°</span> Панорамний тур
              </Link>
            )}
          </div>

          <section className="property-detail__section">
            <h2 className="property-detail__section-title">Опис</h2>
            <p className="property-detail__desc">{property.description}</p>
          </section>

          <section className="property-detail__section">
            <h2 className="property-detail__section-title">Характеристики</h2>
            <div className="property-detail__specs">
              <div className="property-detail__spec">
                <span>Площа</span>
                <b>{property.area} м²</b>
              </div>
              <div className="property-detail__spec">
                <span>Кімнат</span>
                <b>{property.rooms}</b>
              </div>
              <div className="property-detail__spec">
                <span>Поверх</span>
                <b>{property.floor} / {property.totalFloors}</b>
              </div>
            </div>
          </section>

          <section className="property-detail__section">
            <h2 className="property-detail__section-title">Особливості</h2>
            <ul className="property-detail__features">
              {property.features?.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </section>
        </div>

        {/* ПРАВА КОЛОНКА: Ціна та дії */}
        <aside className="property-detail__aside">
          <div className="property-detail__price-card">
            <p className="property-detail__price-label">Ціна</p>
            <p className="property-detail__price">
              {property.price} {property.currency}
              {property.deal === 'rent' && <span className="property-detail__per">/доба</span>}
            </p>
            <button type="button" className="property-detail__btn">
              Зв'язатися з агентом
            </button>
          </div>

          <div className="property-detail__tools">
            <h3 className="property-detail__tools-title">Інструменти</h3>
            <Link to="/mortgage" className="property-detail__tool-link">
              Розрахувати іпотеку
            </Link>
            <Link to="/ar-planner" className="property-detail__tool-link">
              3D-планер кімнати
            </Link>
            <Link to="/analytics" className="property-detail__tool-link">
              Аналітика району
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default PropertyDetailPage;
