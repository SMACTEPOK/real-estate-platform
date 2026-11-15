import { Link } from 'react-router-dom';
import { useAuth } from '@features/auth/AuthContext';
import { useFavorites } from '@features/favorites/FavoritesContext';
import { useProperties } from '@entities/property/useProperties';
import PropertyCard from '@entities/property/PropertyCard';
import Spinner from '@shared/ui/Spinner/Spinner';
import './ProfilePage.css';

function ProfilePage() {
  const { user, logout } = useAuth();
  const { favorites, clearFavorites } = useFavorites();
  const { items, status } = useProperties();

  if (!user) return null;

  // Фільтруємо всі об'єкти, залишаючи тільки ті, що в обраному
  const savedProperties = items.filter((p) => favorites.includes(p.id));

  return (
    <div className="profile-page">
      <header className="profile-page__head">
        <h1 className="profile-page__title">
          ПРОФІЛЬ
          <span className="profile-page__title-mark">/ {user.displayName}</span>
        </h1>
      </header>

      <div className="profile-page__layout">
        {/* Інформація про користувача */}
        <div className="profile-page__card">
          <div className="profile-page__row">
            <span className="profile-page__label">Ім’я</span>
            <span className="profile-page__value">{user.displayName}</span>
          </div>
          <div className="profile-page__row">
            <span className="profile-page__label">Email</span>
            <span className="profile-page__value">{user.email}</span>
          </div>
          <div className="profile-page__row">
            <span className="profile-page__label">ID</span>
            <span className="profile-page__value profile-page__value--mono">{user.id}</span>
          </div>

          <div className="profile-page__actions">
            <Link to="/catalog" className="profile-page__btn">
              До каталогу
            </Link>
            <button type="button" className="profile-page__btn profile-page__btn--ghost" onClick={logout}>
              Вийти
            </button>
          </div>
        </div>

        {/* Секція обраного */}
        <div className="profile-page__favorites">
          <div className="profile-page__favorites-head">
            <h2 className="profile-page__favorites-title">
              Обране <span>({savedProperties.length})</span>
            </h2>
            {favorites.length > 0 && (
              <button type="button" className="profile-page__clear-btn" onClick={clearFavorites}>
                Очистити все
              </button>
            )}
          </div>

          {status === 'loading' && <Spinner label="Завантаження…" />}

          {status === 'success' && savedProperties.length === 0 && (
            <div className="profile-page__empty-fav">
              <p>Ви ще не додали жодного об'єкта в обране.</p>
              <Link to="/catalog" className="profile-page__btn">Перейти до каталогу</Link>
            </div>
          )}

          {status === 'success' && savedProperties.length > 0 && (
            <div className="profile-page__grid">
              {savedProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
