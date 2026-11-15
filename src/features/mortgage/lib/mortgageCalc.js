/**
 * Модуль чистих функцій для розрахунку іпотеки.
 * Не залежить від React, DOM або сторонніх бібліотек.
 * Легко піддається юніт-тестуванню.
 */

/**
 * Розраховує щомісячний платіж за формулою ануїтету.
 *
 * @param {number} principal - тіло кредиту (сума позики)
 * @param {number} annualRate - річна відсоткова ставка (у відсотках, напр. 18.5)
 * @param {number} years - термін у роках
 * @returns {Object} { monthlyPayment, totalPayment, totalInterest }
 */
export function calculateMortgage(principal, annualRate, years) {
  if (principal <= 0 || years <= 0) {
    return { monthlyPayment: 0, totalPayment: 0, totalInterest: 0 };
  }

  const n = years * 12; // кількість місяців
  const r = annualRate / 100 / 12; // місячна ставка

  let monthlyPayment = 0;

  if (r === 0) {
    // Якщо ставка 0%, це просто рівномірне погашення тіла
    monthlyPayment = principal / n;
  } else {
    // Формула ануїтетного платежу
    monthlyPayment = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  }

  const totalPayment = monthlyPayment * n;
  const totalInterest = totalPayment - principal;

  return {
    monthlyPayment: Math.round(monthlyPayment * 100) / 100,
    totalPayment: Math.round(totalPayment * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
  };
}

/**
 * Генерує графік амортизації (розподіл платежів по місяцях).
 * Використовується переважно для тестів та перевірки логіки.
 *
 * @param {number} principal
 * @param {number} annualRate
 * @param {number} years
 * @returns {Array} масив об'єктів { month, payment, principalPart, interestPart, balance }
 */
export function generateAmortizationSchedule(principal, annualRate, years) {
  if (principal <= 0 || years <= 0) return [];

  const { monthlyPayment } = calculateMortgage(principal, annualRate, years);
  const n = years * 12;
  const r = annualRate / 100 / 12;

  let balance = principal;
  const schedule = [];

  for (let month = 1; month <= n; month++) {
    const interestPart = balance * r;
    const principalPart = monthlyPayment - interestPart;
    balance -= principalPart;

    schedule.push({
      month,
      payment: monthlyPayment,
      principalPart: Math.max(0, Math.round(principalPart * 100) / 100),
      interestPart: Math.round(interestPart * 100) / 100,
      balance: Math.max(0, Math.round(balance * 100) / 100),
    });
  }

  return schedule;
}
