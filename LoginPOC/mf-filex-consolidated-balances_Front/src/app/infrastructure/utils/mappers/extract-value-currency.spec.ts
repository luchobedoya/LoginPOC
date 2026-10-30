import { extractValueFromCurrency } from './extract-value-currency';

describe('extractValueFromCurrency', () => {
  test('should extract number value from currency string with thousands and decimals', () => {
    const currencyValue = 'COP $ 1.500.200,12';
    const expectedValue = '1500200.12';
    const value = extractValueFromCurrency(currencyValue);
    expect(value).toBe(expectedValue);
  });

  test('should extract negative number correctly', () => {
    const currencyValue = 'USD $ -36,00';
    const expectedValue = '-36.00';
    const value = extractValueFromCurrency(currencyValue);
    expect(value).toBe(expectedValue);
  });

  test('should extract zero if input is not numeric', () => {
    const currencyValue = 'ABC';
    const expectedValue = '0';
    const value = extractValueFromCurrency(currencyValue);
    expect(value).toBe(expectedValue);
  });

  test('should handle currency without decimals', () => {
    const currencyValue = 'USD $ 100';
    const expectedValue = '100';
    const value = extractValueFromCurrency(currencyValue);
    expect(value).toBe(expectedValue);
  });
});
