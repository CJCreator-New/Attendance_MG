// Date utilities with leap year and timezone handling

export const getDaysInMonth = (year, month) => {
  return new Date(year, month + 1, 0).getDate();
};

export const isLeapYear = (year) => {
  return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
};

export const getLocalDate = (date) => {
  const d = new Date(date);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
};

export const formatDateLocal = (date) => {
  const d = getLocalDate(date);
  return d.toISOString().split('T')[0];
};

export const isFutureDate = (date) => {
  const today = getLocalDate(new Date());
  const checkDate = getLocalDate(date);
  return checkDate > today;
};

export const excelSerialToDate = (serial) => {
  const utc_days = Math.floor(serial - 25569);
  const utc_value = utc_days * 86400;
  const date_info = new Date(utc_value * 1000);
  return getLocalDate(date_info);
};
