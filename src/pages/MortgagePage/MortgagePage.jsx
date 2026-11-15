import { useState, useMemo } from 'react';
import { calculateMortgage } from '@features/mortgage/lib/mortgageCalc';
import './MortgagePage.css';

const formatCurrency = (value) =>
  new Intl.NumberFormat('uk-UA', { maximumFractionDigits: 0 }).format(value);

function MortgagePage() {
  // Стан форми
  const [price, setPrice] = useState(150000);
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [rate, setRate] = useState(15);
  const [termYears, setTermYears] = useState(20);

  // Похідні значення
  const downPayment = (price * downPaymentPercent) / 100;
  const principal = price - downPayment;

  // Розрахунок (мемоізований)
  const calc = useMemo(() => {
    return calculateMortgage(principal, rate, termYears);
  }, [principal, rate, termYears]);

  return (
    <div className="mortgage-page">
      <header className="mortgage-page__head">
        <h1 className="mortgage-page__title">
          ІПОТЕКА
          <span className="mortgage-page__title-mark">/ РОЗРАХУНОК</span>
        </h1>
        <p className="mortgage-page__subtitle">
          Оцініть свої фінансові можливості перед покупкою
        </p>
      </header>

      <div className="mortgage-page__layout">
        {/* ЛІВА КОЛОНКА: Слайдери та інпути */}
        <div className="mortgage-page__controls">
          <div className="mortgage-page__group">
            <div className="mortgage-page__group-head">
              <label htmlFor="price">Вартість нерухомості</label>
              <div className="mortgage-page__input-wrap">
                <input
                  id="price"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(Math.max(0, Number(e.target.value)))}
                />
                <span>USD</span>
              </div>
            </div>
            <input
              type="range"
              min="10000"
              max="500000"
              step="5000"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="mortgage-page__slider"
            />
          </div>

          <div className="mortgage-page__group">
            <div className="mortgage-page__group-head">
              <label htmlFor="downPayment">Перший внесок ({downPaymentPercent}%)</label>
              <span className="mortgage-page__value">{formatCurrency(downPayment)} USD</span>
            </div>
            <input
              id="downPayment"
              type="range"
              min="0"
              max="90"
              step="5"
              value={downPaymentPercent}
              onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
              className="mortgage-page__slider"
            />
          </div>

          <div className="mortgage-page__group">
            <div className="mortgage-page__group-head">
              <label htmlFor="rate">Відсоткова ставка</label>
              <div className="mortgage-page__input-wrap">
                <input
                  id="rate"
                  type="number"
                  value={rate}
                  onChange={(e) => setRate(Math.max(0.1, Number(e.target.value)))}
                  step="0.1"
                />
                <span>%</span>
              </div>
            </div>
            <input
              id="rate"
              type="range"
              min="1"
              max="30"
              step="0.5"
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              className="mortgage-page__slider"
            />
          </div>

          <div className="mortgage-page__group">
            <div className="mortgage-page__group-head">
              <label htmlFor="term">Термін кредитування</label>
              <div className="mortgage-page__input-wrap">
                <input
                  id="term"
                  type="number"
                  value={termYears}
                  onChange={(e) => setTermYears(Math.max(1, Number(e.target.value)))}
                />
                <span>років</span>
              </div>
            </div>
            <input
              id="term"
              type="range"
              min="1"
              max="30"
              step="1"
              value={termYears}
              onChange={(e) => setTermYears(Number(e.target.value))}
              className="mortgage-page__slider"
            />
          </div>
        </div>

        {/* ПРАВА КОЛОНКА: Результати та графік */}
        <aside className="mortgage-page__results">
          <div className="mortgage-page__result-card">
            <p className="mortgage-page__result-label">Щомісячний платіж</p>
            <p className="mortgage-page__result-value">
              {formatCurrency(calc.monthlyPayment)} <span>USD</span>
            </p>
          </div>

          <div className="mortgage-page__stats">
            <div className="mortgage-page__stat">
              <span>Сума кредиту</span>
              <b>{formatCurrency(principal)} USD</b>
            </div>
            <div className="mortgage-page__stat">
              <span>Переплата (відсотки)</span>
              <b>{formatCurrency(calc.totalInterest)} USD</b>
            </div>
            <div className="mortgage-page__stat">
              <span>Загальна вартість</span>
              <b>{formatCurrency(calc.totalPayment + downPayment)} USD</b>
            </div>
          </div>

          {/* Візуалізація співвідношення */}
          <div className="mortgage-page__chart">
            <p className="mortgage-page__chart-title">Структура виплат</p>
            <div className="mortgage-page__bar">
              <div
                className="mortgage-page__bar-principal"
                style={{ width: `${(principal / (calc.totalPayment || 1)) * 100}%` }}
                title="Тіло кредиту"
              />
              <div
                className="mortgage-page__bar-interest"
                style={{ width: `${(calc.totalInterest / (calc.totalPayment || 1)) * 100}%` }}
                title="Відсотки"
              />
            </div>
            <div className="mortgage-page__legend">
              <span>■ Тіло кредиту</span>
              <span>■ Відсотки банку</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default MortgagePage;
