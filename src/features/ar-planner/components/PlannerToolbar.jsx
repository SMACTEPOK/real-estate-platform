import PropTypes from 'prop-types';
import { FURNITURE_CATALOG } from '../data/furnitureCatalog';

function PlannerToolbar({ selectedType, onSelectType, onRemove, onClear, hasSelected }) {
  return (
    <div className="planner-toolbar">
      <div className="planner-toolbar__section">
        <h3 className="planner-toolbar__title">Додати меблі</h3>
        <div className="planner-toolbar__catalog">
          {Object.entries(FURNITURE_CATALOG).map(([key, config]) => (
            <button
              key={key}
              type="button"
              className={
                'planner-toolbar__item' + (selectedType === key ? ' is-active' : '')
              }
              onClick={() => onSelectType(key)}
            >
              {config.name}
            </button>
          ))}
        </div>
      </div>

      <div className="planner-toolbar__section planner-toolbar__section--actions">
        <button
          type="button"
          className="planner-toolbar__btn planner-toolbar__btn--danger"
          onClick={onRemove}
          disabled={!hasSelected}
        >
          Видалити вибране
        </button>
        <button
          type="button"
          className="planner-toolbar__btn"
          onClick={onClear}
        >
          Очистити все
        </button>
      </div>
    </div>
  );
}

PlannerToolbar.propTypes = {
  selectedType: PropTypes.string,
  onSelectType: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
  hasSelected: PropTypes.bool.isRequired,
};

export default PlannerToolbar;
