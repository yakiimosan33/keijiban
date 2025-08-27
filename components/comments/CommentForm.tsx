'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import Toast, { ToastType } from '@/components/common/Toast';
import CharacterCounter from '@/components/common/CharacterCounter';
import RateLimitIndicator from '@/components/common/RateLimitIndicator';
import { commentsApi, rateLimiting } from '@/lib/api';
import { 
  validateTextField, 
  getInputBorderColor, 
  getAriaAttributes, 
  sanitizeInput,
  FIELD_CONFIG 
} from '@/lib/validation';
import type { CommentInsert } from '@/lib/types';
import type { ValidationError } from '@/lib/validation';

interface CommentFormProps {
  postId: number;
}

interface FormState {
  body: {
    value: string;
    error?: ValidationError;
    touched: boolean;
    focused: boolean;
  };
}

export default function CommentForm({ postId }: CommentFormProps) {
  const [formState, setFormState] = useState<FormState>({
    body: { value: '', touched: false, focused: false },
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [canSubmit, setCanSubmit] = useState(true);
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
    isVisible: boolean;
  }>({ message: '', type: 'info', isVisible: false });
  
  const bodyInputRef = useRef<HTMLTextAreaElement>(null);
  const submitAttempts = useRef(0);

  const validateForm = useCallback((): boolean => {
    const bodyResult = validateTextField(formState.body.value, 'comment', true);
    
    const newFormState = {
      body: { ...formState.body, error: bodyResult.error, touched: true },
    };
    
    setFormState(newFormState);
    
    return bodyResult.isValid;
  }, [formState]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    submitAttempts.current += 1;

    if (!validateForm()) {
      // Focus on error field
      if (formState.body.error && bodyInputRef.current) {
        bodyInputRef.current.focus();
      }
      return;
    }

    // Check rate limiting
    const rateLimitInfo = rateLimiting.checkCommentRateLimit();
    if (!rateLimitInfo.isAllowed) {
      showToast(rateLimitInfo.message || 'コメント制限に達しました。', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      const sanitizedBody = sanitizeInput(formState.body.value.trim());
      
      const commentData: CommentInsert = {
        post_id: postId,
        body: sanitizedBody,
        // Note: ip_hash would typically be set server-side for security
      };

      await commentsApi.create(commentData);

      // Reset form
      resetForm();

      showToast('コメントを投稿しました', 'success');
    } catch (error) {
      console.error('Failed to submit comment:', error);
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'コメントの投稿に失敗しました。もう一度お試しください。';
      
      showToast(errorMessage, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormState({
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

  const handleBodyChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    const result = validateTextField(value, 'comment', formState.body.touched);
    
    setFormState(prev => ({
      ...prev,
      body: {
        ...prev.body,
        value,
        error: result.error,
      }
    }));
  }, [formState.body.touched]);

  const handleBodyFocus = () => {
    setFormState(prev => ({
      ...prev,
      body: { ...prev.body, focused: true }
    }));
  };

  const handleBodyBlur = () => {
    const result = validateTextField(formState.body.value, 'comment', true);
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
  const isFormValid = (!formState.body.error?.message || formState.body.error?.severity !== 'error')
    && formState.body.value.trim().length > 0;

  const isSubmitDisabled = isSubmitting || !canSubmit || !isFormValid;

  return (
    <>
      <div className="card p-4">
        {/* Rate limiting indicator */}
        <RateLimitIndicator 
          type="comment" 
          className="mb-4" 
          onUpdate={handleRateLimitUpdate}
        />
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="comment-body"
              className="block text-sm font-medium text-zinc-700 mb-2"
            >
              コメントを追加 <span className="text-red-500" aria-label="必須">*</span>
            </label>
            <textarea
              ref={bodyInputRef}
              id="comment-body"
              value={formState.body.value}
              onChange={handleBodyChange}
              onFocus={handleBodyFocus}
              onBlur={handleBodyBlur}
              className={`textarea-field ${getInputBorderColor(
                formState.body.error,
                formState.body.focused,
                formState.body.touched
              )}`}
              placeholder="コメントを入力してください"
              rows={3}
              maxLength={FIELD_CONFIG.comment.maxLength}
              disabled={isSubmitting}
              {...getAriaAttributes(
                'comment-body',
                formState.body.error,
                { current: formState.body.value.length, max: FIELD_CONFIG.comment.maxLength }
              )}
            />
            
            <div className="mt-2">
              {/* Error message */}
              {formState.body.error && formState.body.touched && (
                <div 
                  id="comment-body-error" 
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
                max={FIELD_CONFIG.comment.maxLength}
                fieldId="comment-body"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitDisabled}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed transition-opacity duration-200"
              aria-describedby="comment-submit-help"
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
                  コメント中...
                </span>
              ) : (
                'コメントする'
              )}
            </button>
          </div>
          
          {/* Submit help text */}
          <div id="comment-submit-help" className="sr-only">
            {!isFormValid && 'コメントするには、コメントを正しく入力してください'}
            {!canSubmit && 'コメント制限に達しています。しばらく待ってから再度お試しください'}
          </div>
        </form>
      </div>

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={closeToast}
      />
    </>
  );
}
