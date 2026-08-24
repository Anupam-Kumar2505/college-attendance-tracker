/**
 * Validate YYYY-MM-DD string
 */
export const isValidDateFormat = (dateStr) => {
  if (typeof dateStr !== 'string') return false;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return false;
  const d = new Date(dateStr + 'T00:00:00Z');
  return !isNaN(d.getTime());
};

/**
 * Validate that startDate is on or before endDate
 */
export const isDateRangeValid = (startDate, endDate) => {
  if (!isValidDateFormat(startDate) || !isValidDateFormat(endDate)) {
    return false;
  }
  return startDate <= endDate;
};

/**
 * Checks if targetDate is within inclusive [startDate, endDate]
 */
export const isDateInRange = (targetDate, startDate, endDate) => {
  return targetDate >= startDate && targetDate <= endDate;
};

/**
 * Format YYYY-MM-DD into human-readable date e.g. "19 Aug 2026"
 */
export const formatDisplayDate = (dateStr) => {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-');
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthIdx = parseInt(month, 10) - 1;
  return `${parseInt(day, 10)} ${months[monthIdx] || month} ${year}`;
};
