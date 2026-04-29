export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validateRequired(value: string): boolean {
  return value.trim().length > 0;
}

export function validateDateRange(start: string, end: string): boolean {
  const startDate = new Date(start);
  const endDate = new Date(end);
  return startDate < endDate;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export function validateLeaveForm(data: {
  startTime: string;
  endTime: string;
  reason: string;
}): ValidationResult {
  const errors: Record<string, string> = {};

  if (!validateRequired(data.startTime)) {
    errors.startTime = '请选择开始时间';
  }

  if (!validateRequired(data.endTime)) {
    errors.endTime = '请选择结束时间';
  }

  if (data.startTime && data.endTime && !validateDateRange(data.startTime, data.endTime)) {
    errors.endTime = '结束时间必须晚于开始时间';
  }

  if (!validateRequired(data.reason)) {
    errors.reason = '请输入请假原因';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}