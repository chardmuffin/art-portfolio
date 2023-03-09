export function pluralize(name, count) {
  if (count === 1) {
    return name;
  }
  return name + 's';
};

export function toMoneyFormat (value) {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
    maximumFractionDigits: Number.isInteger(value) ? 0 : 2
  });
  return formatter.format(value);
};

export function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
};