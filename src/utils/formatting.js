export const formatCurrency = (amount) => {
  if (!amount || isNaN(amount) || amount === null || amount === undefined) {
    return '₹0';
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

export const formatNumber = (num) => {
  if (!num || isNaN(num) || num === null || num === undefined) {
    return '0';
  }
  return num % 1 === 0 ? num : num.toFixed(1);
};

export const formatCasualLeave = (cl) => {
  if (!cl && cl !== 0) return '0';
  if (cl < 0) {
    return `${Math.abs(cl)} (Over)`;
  }
  return cl % 1 === 0 ? cl : cl.toFixed(1);
};

export const formatEmployeeId = (id) => {
  if (!id) return 'N/A';
  if (typeof id === 'number') {
    return `EMP${String(id).padStart(3, '0')}`;
  }
  return id;
};

export const formatAttendanceDays = (days) => {
  if (!days && days !== 0) return '0';
  return days % 1 === 0 ? days : days.toFixed(1);
};
