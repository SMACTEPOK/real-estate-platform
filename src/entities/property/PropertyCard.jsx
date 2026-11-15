import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useFavorites } from '@features/favorites/FavoritesContext';
import './PropertyCard.css';

const TYPE_LABEL = { apartment: 'Квартира', house: 'Будинок', office: 'Офіс' };
const DEAL_LABEL = { sale: 'Продаж', rent: 'Оренда' };

function PropertyCard({ property }) {
  const { id, title, type, deal, price, currency, area, rooms, city, district, address, image, isNew } = property;
  const { isFavorite, toggleFavorite } = useFavorites();
  const isSaved = isFavorite(id);

  function handleFavoriteClick(e) {
    e.preventDefault(); // Запобігаємо переходу за посиланням
    e.stopPropagation();
    toggleFavorite(id);
  }

  return (
    <Link to={`/property/${id}`} className="property-card">
      <div className="property-card__media">
        <img className="property-card__image" src={image} alt={title} loading="lazy" />
        
        <span className="property-card__badge property-card__badge--deal">
          {DEAL_LABEL[deal] ?? deal}
        </span>
        
        {isNew && (
          <span className="property-card__badge property-card__badge--new">Новинка</span>
        )}

        <button
          type="button"
          className={`property-card__fav ${isSaved ? 'is-active' : ''}`}
          onClick={handleFavoriteClick}
          aria-label={isSaved ? 'Видалити з обраного' : 'Додати в обране'}
        >
          {isSaved ? '♥' : '♡'}
        </button>
      </div>

      <div className="property-card__content">
        <p className="property-card__meta">
          {TYPE_LABEL[type] ?? type} · {city}, {district}
        </p>
        <h3 className="property-card__title">{title}</h3>
        <p className="property-card__address">{address}</p>

        <div className="property-card__specs">
          <span>{area} м²</span>
          <span>{rooms} кімн.</span>
        </div>

        <p className="property-card__price">
          {price} {currency}
          {deal === 'rent' && <span className="property-card__per">/доба</span>}
        </p>
      </div>
    </Link>
  );
}

PropertyCard.propTypes = {
  property: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['apartment', 'house', 'office']).isRequired,
    deal: PropTypes.oneOf(['sale', 'rent']).isRequired,
    price: PropTypes.number.isRequired,
    currency: PropTypes.string.isRequired,
    area: PropTypes.number.isRequired,
    rooms: PropTypes.number.isRequired,
    city: PropTypes.string.isRequired,
    district: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    isNew: PropTypes.bool,
  }).isRequired,
};

export default PropertyCard;
