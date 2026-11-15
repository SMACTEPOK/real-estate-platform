import PropTypes from 'prop-types';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
} from 'recharts';

function CustomTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip__label">{payload[0].payload.name}</p>
      <p className="chart-tooltip__row">
        <span>{payload[0].value} USD/м²</span>
      </p>
    </div>
  );
}

CustomTooltip.propTypes = {
  active: PropTypes.bool,
  payload: PropTypes.array,
};

/**
 * Стовпчикова діаграма середніх цін за районами.
 * Вертикальне розташування підписів для щільних районів.
 */
function DistrictComparison({ data }) {
  return (
    <div className="chart-block">
      <h3 className="chart-block__title">Середня ціна за районами</h3>
      <p className="chart-block__subtitle">USD за м²</p>

      <div className="chart-block__canvas" style={{ height: 360 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 60 }}>
            <CartesianGrid stroke="#383838" strokeDasharray="3 6" vertical={false} />

            <XAxis
              dataKey="name"
              stroke="#898989"
              tick={{ fill: '#898989', fontSize: 10, fontFamily: 'Roboto Mono' }}
              tickLine={false}
              axisLine={{ stroke: '#626262' }}
              angle={-35}
              textAnchor="end"
              height={70}
            />

            <YAxis
              stroke="#898989"
              tick={{ fill: '#898989', fontSize: 11, fontFamily: 'Roboto Mono' }}
              tickLine={false}
              axisLine={false}
              width={48}
            />

            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(237,237,237,0.06)' }} />

            <Bar dataKey="price" fill="#ededed" stroke="#111111" strokeWidth={2} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

DistrictComparison.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default DistrictComparison;
