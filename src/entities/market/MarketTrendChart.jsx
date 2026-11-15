import PropTypes from 'prop-types';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
} from 'recharts';

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip__label">{label}</p>
      <p className="chart-tooltip__row">
        <span>{payload[0].payload.price} USD/м²</span>
      </p>
    </div>
  );
}

CustomTooltip.propTypes = {
  active: PropTypes.bool,
  payload: PropTypes.array,
  label: PropTypes.string,
};

/**
 * Лінійний графік динаміки цін по місяцях.
 * Використовує AreaChart із градієнтом для акценту на «зростанні».
 */
function MarketTrendChart({ data }) {
  return (
    <div className="chart-block">
      <h3 className="chart-block__title">Динаміка ціни за 12 місяців</h3>
      <p className="chart-block__subtitle">USD за м²</p>

      <div className="chart-block__canvas" style={{ height: 320 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ededed" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#ededed" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid stroke="#383838" strokeDasharray="3 6" vertical={false} />

            <XAxis
              dataKey="month"
              stroke="#898989"
              tick={{ fill: '#898989', fontSize: 11, fontFamily: 'Roboto Mono' }}
              tickLine={false}
              axisLine={{ stroke: '#626262' }}
            />

            <YAxis
              stroke="#898989"
              tick={{ fill: '#898989', fontSize: 11, fontFamily: 'Roboto Mono' }}
              tickLine={false}
              axisLine={false}
              width={48}
            />

            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#ededed', strokeDasharray: '3 3' }} />

            <Area
              type="monotone"
              dataKey="price"
              stroke="#ededed"
              strokeWidth={3}
              fill="url(#priceGradient)"
              dot={{ r: 0 }}
              activeDot={{ r: 5, fill: '#ededed', stroke: '#111111', strokeWidth: 3 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

MarketTrendChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      month: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default MarketTrendChart;
