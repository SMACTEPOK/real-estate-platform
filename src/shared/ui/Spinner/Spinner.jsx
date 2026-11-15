import PropTypes from 'prop-types';
import './Spinner.css';

function Spinner({ label = 'Завантаження…' }) {
  return (
    <div className="spinner" role="status" aria-live="polite">
      <div className="spinner__block" aria-hidden="true" />
      <p className="spinner__label">{label}</p>
    </div>
  );
}

Spinner.propTypes = {
  label: PropTypes.string,
};

export default Spinner;
