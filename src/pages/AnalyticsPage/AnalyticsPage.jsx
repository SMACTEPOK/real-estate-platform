import { useState } from 'react';
import MarketTrendChart from '@entities/market/MarketTrendChart';
import DistrictComparison from '@entities/market/DistrictComparison';
import { useAnalytics } from '@entities/market/useAnalytics';
import Spinner from '@shared/ui/Spinner/Spinner';
import ErrorState from '@shared/ui/ErrorState/ErrorState';
import './AnalyticsPage.css';

const CITIES = ['Київ', 'Львів', 'Одеса', 'Харків'];

function AnalyticsPage() {
  const [city, setCity] = useState('Київ');
  const { status, data, error } = useAnalytics(city);

  return (
    <div className="analytics-page">
      <header className="analytics-page__head">
        <h1 className="analytics-page__title">
          АНАЛІТИКА
          <span className="analytics-page__title-mark">/ РИНОК НЕРУХОМОСТІ</span>
        </h1>
        <p className="analytics-page__subtitle">
          Ціни, тренди та порівняння районів за 12 місяців
        </p>
      </header>

      <div className="analytics-page__filters" role="tablist" aria-label="Місто">
        {CITIES.map((c) => (
          <button
            key={c}
            type="button"
            role="tab"
            aria-selected={c === city}
            className={
              'analytics-page__filter' + (c === city ? ' analytics-page__filter--active' : '')
            }
            onClick={() => setCity(c)}
          >
            {c}
          </button>
        ))}
      </div>

      {status === 'loading' && <Spinner label="Завантаження аналітики…" />}
      {status === 'error' && <ErrorState title="Помилка" message={error} />}

      {status === 'success' && data && (
        <>
          <section className="analytics-page__stats">
            <div className="analytics-page__stat-card">
              <p className="analytics-page__stat-label">Середня ціна</p>
              <p className="analytics-page__stat-value">{data.stats.avgPrice} <span>USD/м²</span></p>
            </div>
            <div className="analytics-page__stat-card">
              <p className="analytics-page__stat-label">Зростання за рік</p>
              <p className="analytics-page__stat-value analytics-page__stat-value--accent">
                +{data.stats.growth}%
              </p>
            </div>
            <div className="analytics-page__stat-card">
              <p className="analytics-page__stat-label">Активних оголошень</p>
              <p className="analytics-page__stat-value">{data.stats.listings}</p>
            </div>
          </section>

          <section className="analytics-page__charts">
            <MarketTrendChart data={data.monthly} />
            <DistrictComparison data={data.districts} />
          </section>
        </>
      )}
    </div>
  );
}

export default AnalyticsPage;
