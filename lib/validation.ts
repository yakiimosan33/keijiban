/**
 * Comprehensive form validation utilities with real-time feedback and input sanitization
 */

// Validation error types
export interface ValidationError {
  message: string;
  type: 'required' | 'minLength' | 'maxLength' | 'invalid' | 'rateLimit';
  severity: 'error' | 'warning' | 'info';
}

export interface ValidationResult {
  isValid: boolean;
  error?: ValidationError;
  sanitizedValue?: string;
}

export interface FormFieldState {
  value: string;
  touched: boolean;
  focused: boolean;
  pristine: boolean;
  error?: ValidationError;
}

// Field validation configurations
export const FIELD_CONFIG = {
  title: {
    minLength: 1,
    maxLength: 120,
    required: true,
  },
  body: {
    minLength: 1,
    maxLength: 4000,
    required: true,
  },
  comment: {
    minLength: 1,
    maxLength: 4000,
    required: true,
  },
} as const;

// Character count thresholds for color coding
export const CHARACTER_THRESHOLDS = {
  safe: 0.7, // Green: 0-70% of max
  warning: 0.9, // Yellow: 70-90% of max
  danger: 1.0, // Red: 90-100% of max
} as const;

/**
 * Input sanitization to prevent XSS attacks
 */
export function sanitizeInput(input: string): string {
  // Basic HTML/script tag removal and encoding
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim();
}

/**
 * Validate text field with real-time feedback
 */
export function validateTextField(
  value: string,
  fieldType: keyof typeof FIELD_CONFIG,
  touched: boolean = false
): ValidationResult {
  const config = FIELD_CONFIG[fieldType];
  const trimmedValue = value.trim();
  const sanitizedValue = sanitizeInput(value);
  
  // Skip validation if not touched (for better UX)
  if (!touched && trimmedValue.length === 0) {
    return { isValid: true, sanitizedValue };
  }

  // Required field validation
  if (config.required && trimmedValue.length === 0) {
    const fieldNames = {
      title: 'タイトル',
      body: fieldType === 'body' ? '本文' : 'コメント',
      comment: 'コメント',
    };
    
    return {
      isValid: false,
      error: {
        message: `${fieldNames[fieldType]}を入力してください`,
        type: 'required',
        severity: 'error',
      },
      sanitizedValue,
    };
  }

  // Minimum length validation
  if (trimmedValue.length > 0 && trimmedValue.length < config.minLength) {
    const fieldNames = {
      title: 'タイトル',
      body: fieldType === 'body' ? '本文' : 'コメント',
      comment: 'コメント',
    };
    
    return {
      isValid: false,
      error: {
        message: `${fieldNames[fieldType]}は${config.minLength}文字以上で入力してください`,
        type: 'minLength',
        severity: 'error',
      },
      sanitizedValue,
    };
  }

  // Maximum length validation
  if (value.length > config.maxLength) {
    const fieldNames = {
      title: 'タイトル',
      body: fieldType === 'body' ? '本文' : 'コメント',
      comment: 'コメント',
    };
    
    return {
      isValid: false,
      error: {
        message: `${fieldNames[fieldType]}は${config.maxLength}文字以内で入力してください`,
        type: 'maxLength',
        severity: 'error',
      },
      sanitizedValue,
    };
  }

  // Warning for approaching limit
  const usageRatio = value.length / config.maxLength;
  if (usageRatio >= CHARACTER_THRESHOLDS.warning && usageRatio < CHARACTER_THRESHOLDS.danger) {
    const remaining = config.maxLength - value.length;
    return {
      isValid: true,
      error: {
        message: `残り${remaining}文字です`,
        type: 'invalid',
        severity: 'warning',
      },
      sanitizedValue,
    };
  }

  return { isValid: true, sanitizedValue };
}

/**
 * Get character count color based on usage ratio
 */
export function getCharacterCountColor(current: number, max: number): string {
  const ratio = current / max;
  
  if (ratio >= CHARACTER_THRESHOLDS.danger) {
    return 'text-red-600 font-medium';
  } else if (ratio >= CHARACTER_THRESHOLDS.warning) {
    return 'text-amber-600 font-medium';
  } else if (ratio >= CHARACTER_THRESHOLDS.safe) {
    return 'text-yellow-600';
  } else {
    return 'text-zinc-500';
  }
}

/**
 * Get input field border color based on validation state
 */
export function getInputBorderColor(
  error?: ValidationError,
  focused: boolean = false,
  touched: boolean = false
): string {
  if (!touched && !focused) {
    return 'border-zinc-300 focus:border-primary-500';
  }
  
  if (error) {
    if (error.severity === 'error') {
      return 'border-red-500 focus:border-red-500 focus:ring-red-500';
    } else if (error.severity === 'warning') {
      return 'border-amber-400 focus:border-amber-500 focus:ring-amber-500';
    }
  }
  
  if (touched && !error) {
    return 'border-green-500 focus:border-green-500 focus:ring-green-500';
  }
  
  return 'border-zinc-300 focus:border-primary-500 focus:ring-primary-500';
}

/**
 * Get appropriate ARIA attributes for form fields
 */
export function getAriaAttributes(
  fieldId: string,
  error?: ValidationError,
  characterCount?: { current: number; max: number }
): Record<string, string> {
  const attributes: Record<string, string> = {
    'aria-describedby': `${fieldId}-help`,
  };

  if (error && error.severity === 'error') {
    attributes['aria-invalid'] = 'true';
    attributes['aria-describedby'] += ` ${fieldId}-error`;
  }

  if (characterCount) {
    attributes['aria-describedby'] += ` ${fieldId}-counter`;
  }

  return attributes;
}

/**
 * Debounce validation to avoid excessive re-validation
 */
export function createDebouncedValidator<T extends (...args: any[]) => any>(
  validator: T,
  delay: number = 300
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>): void => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => validator(...args), delay);
  };
}

/**
 * Form validation state manager
 */
export class FormValidator {
  private fields: Map<string, FormFieldState> = new Map();
  private validateCallbacks: Map<string, (result: ValidationResult) => void> = new Map();

  /**
   * Register a field for validation
   */
  registerField(
    fieldId: string,
    fieldType: keyof typeof FIELD_CONFIG,
    callback: (result: ValidationResult) => void
  ): void {
    this.fields.set(fieldId, {
      value: '',
      touched: false,
      focused: false,
      pristine: true,
    });
    
    this.validateCallbacks.set(fieldId, callback);
  }

  /**
   * Update field value and validate
   */
  updateField(
    fieldId: string,
    value: string,
    fieldType: keyof typeof FIELD_CONFIG,
    options: { touched?: boolean; focused?: boolean } = {}
  ): ValidationResult {
    const currentState = this.fields.get(fieldId);
    if (!currentState) {
      throw new Error(`Field ${fieldId} not registered`);
    }

    const newState: FormFieldState = {
      ...currentState,
      value,
      touched: options.touched ?? currentState.touched,
      focused: options.focused ?? currentState.focused,
      pristine: false,
    };

    const result = validateTextField(value, fieldType, newState.touched);
    newState.error = result.error;
    
    this.fields.set(fieldId, newState);
    
    // Notify callback
    const callback = this.validateCallbacks.get(fieldId);
    if (callback) {
      callback(result);
    }

    return result;
  }

  /**
   * Mark field as touched (when user leaves field)
   */
  touchField(fieldId: string, fieldType: keyof typeof FIELD_CONFIG): ValidationResult {
    const currentState = this.fields.get(fieldId);
    if (!currentState) {
      throw new Error(`Field ${fieldId} not registered`);
    }

    return this.updateField(fieldId, currentState.value, fieldType, { touched: true });
  }

  /**
   * Get current field state
   */
  getFieldState(fieldId: string): FormFieldState | undefined {
    return this.fields.get(fieldId);
  }

  /**
   * Check if entire form is valid
   */
  isFormValid(): boolean {
    for (const [, state] of this.fields) {
      if (state.error && state.error.severity === 'error') {
        return false;
      }
    }
    return true;
  }

  /**
   * Get all field values
   */
  getValues(): Record<string, string> {
    const values: Record<string, string> = {};
    for (const [fieldId, state] of this.fields) {
      values[fieldId] = state.value;
    }
    return values;
  }

  /**
   * Reset all fields
   */
  reset(): void {
    for (const [fieldId, state] of this.fields) {
      const resetState: FormFieldState = {
        value: '',
        touched: false,
        focused: false,
        pristine: true,
      };
      
      this.fields.set(fieldId, resetState);
      
      // Notify callback of reset
      const callback = this.validateCallbacks.get(fieldId);
      if (callback) {
        callback({ isValid: true });
      }
    }
  }

  /**
   * Clean up resources
   */
  destroy(): void {
    this.fields.clear();
    this.validateCallbacks.clear();
  }
}