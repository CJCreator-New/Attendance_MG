// Date validation utilities

export const validateDateRange = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return { valid: false, error: 'Invalid date format' };
  }
  
  if (end < start) {
    return { valid: false, error: 'End date must be after start date' };
  }
  
  return { valid: true };
};

export const validateNotPastDate = (date) => {
  const selected = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (selected < today) {
    return { valid: false, error: 'Cannot select past dates' };
  }
  
  return { valid: true };
};

export const validateLeaveOverlap = (newLeave, existingLeaves) => {
  const newStart = new Date(newLeave.startDate);
  const newEnd = new Date(newLeave.endDate);
  
  for (const leave of existingLeaves) {
    const existingStart = new Date(leave.startDate);
    const existingEnd = new Date(leave.endDate);
    
    if (
      (newStart >= existingStart && newStart <= existingEnd) ||
      (newEnd >= existingStart && newEnd <= existingEnd) ||
      (newStart <= existingStart && newEnd >= existingEnd)
    ) {
      return { 
        valid: false, 
        error: `Leave overlaps with existing leave (${leave.startDate} to ${leave.endDate})` 
      };
    }
  }
  
  return { valid: true };
};

export const getWorkingDays = (startDate, endDate, holidays = []) => {
  let count = 0;
  const current = new Date(startDate);
  const end = new Date(endDate);
  
  while (current <= end) {
    const day = current.getDay();
    const dateStr = current.toISOString().split('T')[0];
    
    if (day !== 0 && day !== 6 && !holidays.includes(dateStr)) {
      count++;
    }
    
    current.setDate(current.getDate() + 1);
  }
  
  return count;
};
