export const formatMoney = (value?: string | number | null) => {
  const number = typeof value === 'string' ? Number(value) : value;
  if (!number || Number.isNaN(number)) {
    return '£0';
  }
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    maximumFractionDigits: 0,
  }).format(number);
};

export const formatDate = (value?: string | null) => {
  if (!value) {
    return 'Not set';
  }
  return new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium' }).format(new Date(value));
};

export const initials = (value?: string | null) =>
  (value ?? 'Customer')
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
