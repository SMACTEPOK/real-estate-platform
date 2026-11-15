import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import './PlaceholderPage.css';

function PlaceholderPage({ title, iteration, description }) {
  return (
    <div className="placeholder-page">
      <p className="placeholder-page__tag">У РОЗРОБЦІ · ІТЕРАЦІЯ {iteration}</p>
      <h1 className="placeholder-page__title">{title}</h1>
      {description && <p className="placeholder-page__desc">{description}</p>}
      <Link to="/" className="placeholder-page__link">
        ← На головну
      </Link>
    </div>
  );
}

PlaceholderPage.propTypes = {
  title: PropTypes.string.isRequired,
  iteration: PropTypes.number.isRequired,
  description: PropTypes.string,
};

export default PlaceholderPage;
