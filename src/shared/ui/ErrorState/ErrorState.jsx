import PropTypes from 'prop-types';
import './ErrorState.css';

function ErrorState({ title = 'Помилка', message }) {
  return (
    <div className="error-state" role="alert">
      <p className="error-state__tag">ПОМИЛКА</p>
      <h2 className="error-state__title">{title}</h2>
      <p className="error-state__text">{message || 'Спробуйте пізніше.'}</p>
    </div>
  );
}

ErrorState.propTypes = {
  title: PropTypes.string,
  message: PropTypes.string,
};

export default ErrorState;
