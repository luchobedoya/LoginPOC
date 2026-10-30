export const extractValueFromCurrency = (valueCurrency: string): string => {
  const match = valueCurrency.match(/-?[\d.]+(?:,\d+)?/);
  if (!match) {
    return '0';
  }

  return match[0].replace(/\./g, '').replace(',', '.');
};
