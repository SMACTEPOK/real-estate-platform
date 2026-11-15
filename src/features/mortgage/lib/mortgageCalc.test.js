import { describe, it, expect } from 'vitest';
import { calculateMortgage, generateAmortizationSchedule } from './mortgageCalc';

describe('calculateMortgage', () => {
  it('повертає нулі, якщо сума або термін некоректні', () => {
    expect(calculateMortgage(0, 10, 10)).toEqual({ monthlyPayment: 0, totalPayment: 0, totalInterest: 0 });
    expect(calculateMortgage(1000, 10, 0)).toEqual({ monthlyPayment: 0, totalPayment: 0, totalInterest: 0 });
  });

  it('розраховує кредит із нульовою ставкою', () => {
    const result = calculateMortgage(1200, 0, 1);
    expect(result.monthlyPayment).toBe(100);
    expect(result.totalPayment).toBe(1200);
    expect(result.totalInterest).toBe(0);
  });

  it('розраховує стандартний ануїтетний кредит', () => {
    const result = calculateMortgage(100000, 10, 10);
    expect(result.monthlyPayment).toBeCloseTo(1321.51, 1);
    expect(result.totalPayment).toBeCloseTo(158580.88, 1);
    expect(result.totalInterest).toBeCloseTo(58580.88, 1);
  });
});

describe('generateAmortizationSchedule', () => {
  it('генерує правильну кількість місяців', () => {
    const schedule = generateAmortizationSchedule(10000, 10, 1);
    expect(schedule).toHaveLength(12);
  });

  it('наприкінці терміну баланс дорівнює нулю', () => {
    const schedule = generateAmortizationSchedule(10000, 10, 1);
    const lastMonth = schedule[schedule.length - 1];
    expect(lastMonth.balance).toBe(0);
  });

  it('сума відсотків у графіку дорівнює загальній переплаті', () => {
    const schedule = generateAmortizationSchedule(10000, 10, 1);
    const totalInterestFromSchedule = schedule.reduce((sum, row) => sum + row.interestPart, 0);
    const { totalInterest } = calculateMortgage(10000, 10, 1);
    expect(totalInterestFromSchedule).toBeCloseTo(totalInterest, 1);
  });
});
