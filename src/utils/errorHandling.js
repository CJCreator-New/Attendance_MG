// Consistent error handling

export class AppError extends Error {
  constructor(message, code, statusCode = 500) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
    this.name = 'AppError';
  }
}

export const ERROR_CODES = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  SERVER_ERROR: 'SERVER_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
  STORAGE_ERROR: 'STORAGE_ERROR',
};

export const handleError = (error, showToast) => {
  console.error('[Error]', error);

  if (error instanceof AppError) {
    showToast(error.message, 'error');
    return;
  }

  if (error.name === 'QuotaExceededError') {
    showToast('Storage quota exceeded. Please export and clear old data.', 'error');
    return;
  }

  if (error.message?.includes('network') || error.message?.includes('fetch')) {
    showToast('Network error. Please check your connection.', 'error');
    return;
  }

  showToast('An unexpected error occurred. Please try again.', 'error');
};

export const tryCatch = async (fn, errorHandler) => {
  try {
    return await fn();
  } catch (error) {
    if (errorHandler) {
      errorHandler(error);
    }
    throw error;
  }
};
