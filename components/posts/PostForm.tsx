'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import Toast, { ToastType } from '@/components/common/Toast';
import CharacterCounter from '@/components/common/CharacterCounter';
import RateLimitIndicator from '@/components/common/RateLimitIndicator';
import { postsApi, rateLimiting } from '@/lib/api';
import { 
  validateTextField, 
  getInputBorderColor, 
  getAriaAttributes, 
  sanitizeInput,
  FIELD_CONFIG 
} from '@/lib/validation';
import type { PostInsert } from '@/lib/types';
import type { ValidationError } from '@/lib/validation';

interface PostFormProps {
  onSubmitted: () => void;
  onCancel: () => void;
}

interface FormState {
  title: {
    value: string;
    error?: ValidationError;
    touched: boolean;
    focused: boolean;
  };
  body: {
    value: string;
    error?: ValidationError;
    touched: boolean;
    focused: boolean;
  };
}

export default function PostForm({ onSubmitted, onCancel }: PostFormProps) {
  const [formState, setFormState] = useState<FormState>({
    title: { value: '', touched: false, focused: false },
    body: { value: '', touched: false, focused: false },
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [canSubmit, setCanSubmit] = useState(true);
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
    isVisible: boolean;
  }>({ message: '', type: 'info', isVisible: false });
  
  const titleInputRef = useRef<HTMLInputElement>(null);
  const bodyInputRef = useRef<HTMLTextAreaElement>(null);
  const submitAttempts = useRef(0);

  const validateForm = useCallback((): boolean => {
    const titleResult = validateTextField(formState.title.value, 'title', true);
    const bodyResult = validateTextField(formState.body.value, 'body', true);
    
    const newFormState = {
      title: { ...formState.title, error: titleResult.error, touched: true },
      body: { ...formState.body, error: bodyResult.error, touched: true },
    };
    
    setFormState(newFormState);
    
    return titleResult.isValid && bodyResult.isValid;
  }, [formState]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    submitAttempts.current += 1;

    if (!validateForm()) {
      // Focus on first error field
      if (formState.title.error && titleInputRef.current) {
        titleInputRef.current.focus();
      } else if (formState.body.error && bodyInputRef.current) {
        bodyInputRef.current.focus();
      }
      return;
    }

    // Check rate limiting
    const rateLimitInfo = rateLimiting.checkPostRateLimit();
    if (!rateLimitInfo.isAllowed) {
      showToast(rateLimitInfo.message || '投稿制限に達しました。', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      const sanitizedTitle = sanitizeInput(formState.title.value.trim());
      const sanitizedBody = sanitizeInput(formState.body.value.trim());
      
      const postData: PostInsert = {
        title: sanitizedTitle,
        body: sanitizedBody,
        // Note: ip_hash would typically be set server-side for security
      };

      await postsApi.create(postData);

      // Reset form
      resetForm();
      
      showToast('投稿を受け付けました', 'success');
      onSubmitted();
    } catch (error) {
      console.error('Failed to submit post:', error);
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : '投稿に失敗しました。もう一度お試しください。';
      
      showToast(errorMessage, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormState({
      title: { value: '', touched: false, focused: false },
      body: { value: '', touched: false, focused: false },
    });
    submitAttempts.current = 0;
  };

  const showToast = (message: string, type: ToastType) => {
    setToast({ message, type, isVisible: true });
  };

  const closeToast = () => {
    setToast((prev) => ({ ...prev, isVisible: false }));
  };

  const handleTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const result = validateTextField(value, 'title', formState.title.touched);
    
    setFormState(prev => ({
      ...prev,
      title: {
        ...prev.title,
        value,
        error: result.error,
      }
    }));
  }, [formState.title.touched]);

  const handleBodyChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    const result = validateTextField(value, 'body', formState.body.touched);
    
    setFormState(prev => ({
      ...prev,
      body: {
        ...prev.body,
        value,
        error: result.error,
      }
    }));
  }, [formState.body.touched]);

  const handleTitleFocus = () => {
    setFormState(prev => ({
      ...prev,
      title: { ...prev.title, focused: true }
    }));
  };

  const handleTitleBlur = () => {
    const result = validateTextField(formState.title.value, 'title', true);
    setFormState(prev => ({
      ...prev,
      title: {
        ...prev.title,
        focused: false,
        touched: true,
        error: result.error,
      }
    }));
  };

  const handleBodyFocus = () => {
    setFormState(prev => ({
      ...prev,
      body: { ...prev.body, focused: true }
    }));
  };

  const handleBodyBlur = () => {
    const result = validateTextField(formState.body.value, 'body', true);
    setFormState(prev => ({
      ...prev,
      body: {
        ...prev.body,
        focused: false,
        touched: true,
        error: result.error,
      }
    }));
  };

  const handleRateLimitUpdate = ({ isAllowed }: { isAllowed: boolean }) => {
    setCanSubmit(isAllowed);
  };

  // Check if form can be submitted
  const isFormValid = !formState.title.error?.message || formState.title.error?.severity !== 'error'
    && (!formState.body.error?.message || formState.body.error?.severity !== 'error')
    && formState.title.value.trim().length > 0
    && formState.body.value.trim().length > 0;

  const isSubmitDisabled = isSubmitting || !canSubmit || !isFormValid;

  // Auto-focus title field on mount
  useEffect(() => {
    if (titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, []);

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Rate limiting indicator */}
        <RateLimitIndicator 
          type="post" 
          className="-mt-2" 
          onUpdate={handleRateLimitUpdate}
        />

        {/* Title field */}
        <div>
          <label
            htmlFor="post-title"
            className="block text-sm font-medium text-zinc-700 mb-2"
          >
            タイトル <span className="text-red-500" aria-label="必須">*</span>
          </label>
          <input
            ref={titleInputRef}
            id="post-title"
            type="text"
            value={formState.title.value}
            onChange={handleTitleChange}
            onFocus={handleTitleFocus}
            onBlur={handleTitleBlur}
            className={`input-field ${getInputBorderColor(
              formState.title.error,
              formState.title.focused,
              formState.title.touched
            )}`}
            style={{ minHeight: '44px' }}
            placeholder="投稿のタイトルを入力してください"
            maxLength={FIELD_CONFIG.title.maxLength}
            disabled={isSubmitting}
            {...getAriaAttributes(
              'post-title',
              formState.title.error,
              { current: formState.title.value.length, max: FIELD_CONFIG.title.maxLength }
            )}
          />
          
          <div className="mt-2">
            {/* Error message */}
            {formState.title.error && formState.title.touched && (
              <div 
                id="post-title-error" 
                className="mb-2"
                role="alert"
                aria-live="polite"
              >
                <p className={`text-sm ${
                  formState.title.error.severity === 'error' 
                    ? 'text-red-600' 
                    : 'text-amber-600'
                }`}>
                  {formState.title.error.message}
                </p>
              </div>
            )}
            
            {/* Character counter */}
            <CharacterCounter
              current={formState.title.value.length}
              max={FIELD_CONFIG.title.maxLength}
              fieldId="post-title"
            />
          </div>
        </div>

        {/* Body field */}
        <div>
          <label
            htmlFor="post-body"
            className="block text-sm font-medium text-zinc-700 mb-2"
          >
            本文 <span className="text-red-500" aria-label="必須">*</span>
          </label>
          <textarea
            ref={bodyInputRef}
            id="post-body"
            value={formState.body.value}
            onChange={handleBodyChange}
            onFocus={handleBodyFocus}
            onBlur={handleBodyBlur}
            className={`textarea-field ${getInputBorderColor(
              formState.body.error,
              formState.body.focused,
              formState.body.touched
            )}`}
            placeholder="投稿の内容を入力してください"
            rows={6}
            maxLength={FIELD_CONFIG.body.maxLength}
            disabled={isSubmitting}
            style={{ minHeight: '120px' }}
            {...getAriaAttributes(
              'post-body',
              formState.body.error,
              { current: formState.body.value.length, max: FIELD_CONFIG.body.maxLength }
            )}
          />
          
          <div className="mt-2">
            {/* Error message */}
            {formState.body.error && formState.body.touched && (
              <div 
                id="post-body-error" 
                className="mb-2"
                role="alert"
                aria-live="polite"
              >
                <p className={`text-sm ${
                  formState.body.error.severity === 'error' 
                    ? 'text-red-600' 
                    : 'text-amber-600'
                }`}>
                  {formState.body.error.message}
                </p>
              </div>
            )}
            
            {/* Character counter */}
            <CharacterCounter
              current={formState.body.value.length}
              max={FIELD_CONFIG.body.maxLength}
              fieldId="post-body"
            />
          </div>
        </div>

        {/* Submit buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <button
            type="submit"
            disabled={isSubmitDisabled}
            className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity duration-200"
            style={{ minHeight: '44px' }}
            aria-describedby="submit-help"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg 
                  className="animate-spin w-4 h-4" 
                  fill="none" 
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <circle 
                    className="opacity-25" 
                    cx="12" 
                    cy="12" 
                    r="10" 
                    stroke="currentColor" 
                    strokeWidth="4"
                  />
                  <path 
                    className="opacity-75" 
                    fill="currentColor" 
                    d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                投稿中...
              </span>
            ) : (
              '投稿する'
            )}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed sm:w-auto w-full transition-opacity duration-200"
            style={{ minHeight: '44px' }}
          >
            キャンセル
          </button>
        </div>
        
        {/* Submit help text */}
        <div id="submit-help" className="sr-only">
          {!isFormValid && '投稿するには、タイトルと本文の両方を正しく入力してください'}
          {!canSubmit && '投稿制限に達しています。しばらく待ってから再度お試しください'}
        </div>
      </form>

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={closeToast}
      />
    </>
  );
}
