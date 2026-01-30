export const excelSerialToDate = (serial) => {
  if (!serial || typeof serial !== 'number') return null;
  const utcDays = Math.floor(serial - 25569);
  const utcValue = utcDays * 86400;
  const dateInfo = new Date(utcValue * 1000);
  return new Date(dateInfo.getFullYear(), dateInfo.getMonth(), dateInfo.getDate());
};

export const formatDate = (date) => {
  if (!date) return '';
  if (typeof date === 'number') {
    date = excelSerialToDate(date);
  }
  if (!(date instanceof Date) || isNaN(date)) return '';
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

export const isValidDate = (date) => {
  return date instanceof Date && !isNaN(date);
};

export const isFutureDate = (date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const checkDate = typeof date === 'number' ? excelSerialToDate(date) : new Date(date);
  return checkDate > today;
};
