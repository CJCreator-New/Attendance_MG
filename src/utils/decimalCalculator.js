// Precise decimal calculations for salary

export class DecimalCalculator {
  static add(a, b) {
    return Math.round((a + b) * 100) / 100;
  }

  static subtract(a, b) {
    return Math.round((a - b) * 100) / 100;
  }

  static multiply(a, b) {
    return Math.round(a * b * 100) / 100;
  }

  static divide(a, b) {
    if (b === 0) throw new Error('Division by zero');
    return Math.round((a / b) * 100) / 100;
  }

  static percentage(value, percent) {
    return this.multiply(value, percent / 100);
  }

  static round(value, decimals = 2) {
    const factor = Math.pow(10, decimals);
    return Math.round(value * factor) / factor;
  }
}

export const formatCurrency = (amount, currency = 'INR') => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2
  }).format(amount);
};

export const parseCurrency = (str) => {
  return parseFloat(str.replace(/[^0-9.-]+/g, '')) || 0;
};
