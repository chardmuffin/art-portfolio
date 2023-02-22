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
  });
  return formatter.format(value);
};