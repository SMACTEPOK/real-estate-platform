import { useMemo, useState } from 'react';
import PropertyCard from '@entities/property/PropertyCard';
import { applyFilters } from '@shared/lib/filterProperties';
import { useProperties } from '@entities/property/useProperties';
import Spinner from '@shared/ui/Spinner/Spinner';
import ErrorState from '@shared/ui/ErrorState/ErrorState';
import './CatalogPage.css';

const DEAL_OPTIONS = [
  { key: 'all', label: 'Усі' },
  { key: 'sale', label: 'Продаж' },
  { key: 'rent', label: 'Оренда' },
];

function CatalogPage() {
  const [search, setSearch] = useState('');
  const [deal, setDeal] = useState('all');

  const { status, items, error } = useProperties();

  const filtered = useMemo(
    () => applyFilters(items, { search, deal }),
    [items, search, deal]
  );

  if (status === 'loading') {
    return (
      <div className="catalog-page">
        <Spinner label="Завантаження каталогу…" />
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="catalog-page">
        <ErrorState
          title="Не вдалося завантажити каталог"
          message={error || 'Перевірте з’єднання та спробуйте пізніше.'}
        />
      </div>
    );
  }

  return (
    <div className="catalog-page">
      <header className="catalog-page__head">
        <h1 className="catalog-page__title">
          КАТАЛОГ
          <span className="catalog-page__title-mark">/ESTATE</span>
        </h1>
      </header>

      <div className="catalog-page__toolbar">
        <input
          type="search"
          className="catalog-page__search"
          placeholder="Пошук за назвою, містом, районом або адресою…"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          aria-label="Пошук нерухомості"
        />

        <div className="catalog-page__filters">
          {DEAL_OPTIONS.map((option) => (
            <button
              key={option.key}
              type="button"
              className={
                'catalog-page__filter' +
                (deal === option.key ? ' catalog-page__filter--active' : '')
              }
              onClick={() => setDeal(option.key)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <p className="catalog-page__count" aria-live="polite">
        Знайдено: <b>{filtered.length}</b>
      </p>

      {filtered.length === 0 ? (
        <div className="catalog-page__empty" role="status">
          <p className="catalog-page__empty-title">Нічого не знайдено</p>
          <p className="catalog-page__empty-text">
            За запитом «<b>{search || '—'}</b>» немає об’єктів. Спробуйте змінити запит або
            скинути фільтри.
          </p>
          <button
            type="button"
            className="catalog-page__reset"
            onClick={() => {
              setSearch('');
              setDeal('all');
            }}
          >
            Скинути фільтри
          </button>
        </div>
      ) : (
        <div className="catalog-page__grid">
          {filtered.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </div>
  );
}

export default CatalogPage;
