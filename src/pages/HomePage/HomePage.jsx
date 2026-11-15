import { Link } from 'react-router-dom';
import './HomePage.css';

function HomePage() {
  return (
    <div className="home-page">
      <section className="home-page__hero">
        <h1 className="home-page__title">
          ЗНАЙДИ
          <br />
          СВОЄ
        </h1>
        <p className="home-page__subtitle">
          Платформа нерухомості з 360° турами, іпотечним калькулятором та 3D-планувальником
          інтер'єру. Пошук, аналіз і вибір — в одному місці.
        </p>
        <div className="home-page__actions">
          <Link to="/catalog" className="home-page__cta">
            До каталогу →
          </Link>
          <Link to="/analytics" className="home-page__cta home-page__cta--ghost">
            Аналітика районів
          </Link>
        </div>
      </section>

      <section className="home-page__features">
        <article className="home-page__feature">
          <p className="home-page__feature-num">01</p>
          <h2 className="home-page__feature-title">360° тури</h2>
          <p className="home-page__feature-text">
            Панорамний огляд кожного об'єкта прямо в браузері — без візиту.
          </p>
        </article>
        <article className="home-page__feature">
          <p className="home-page__feature-num">02</p>
          <h2 className="home-page__feature-title">Іпотека</h2>
          <p className="home-page__feature-text">
            Розрахунок щомісячного платежу та графік амортизації за кілька секунд.
          </p>
        </article>
        <article className="home-page__feature">
          <p className="home-page__feature-num">03</p>
          <h2 className="home-page__feature-title">3D-планер</h2>
          <p className="home-page__feature-text">
            Розставте меблі у 3D-сцені та перегляньте результат із підтримкою WebXR.
          </p>
        </article>
      </section>
    </div>
  );
}

export default HomePage;
