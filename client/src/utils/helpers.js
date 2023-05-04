export function pluralize(name, count) {
  if (count === 1) {
    return name;
  }
  return name + 's';
};

export function toMoneyFormat (value) {
  const isInt = Number.isInteger(parseFloat(value));
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: isInt ? 0 : 2,
    maximumFractionDigits: isInt ? 0 : 2
  });
  return formatter.format(value);
};

export function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export function isLoggedIn() {
  return Boolean(sessionStorage?.getItem("loggedIn"));
};

export function formatDate(dateStr) {
  const date = new Date(dateStr);
  const options = {
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  };

  return new Intl.DateTimeFormat('en-US', options).format(date);
};