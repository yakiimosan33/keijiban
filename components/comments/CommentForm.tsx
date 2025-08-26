'use client';

import { useState } from 'react';
import Toast, { ToastType } from '@/components/common/Toast';

interface CommentFormProps {
  postId: number;
}

interface FormErrors {
  body?: string;
}

export default function CommentForm({ postId }: CommentFormProps) {
  const [body, setBody] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: ToastType;
    isVisible: boolean;
  }>({ message: '', type: 'info', isVisible: false });

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!body.trim()) {
      newErrors.body = 'コメントを入力してください';
    } else if (body.length > 4000) {
      newErrors.body = 'コメントは4000文字以内で入力してください';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Submit to Supabase
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      showToast('コメントを投稿しました', 'success');
      setBody('');
      setErrors({});
    } catch (error) {
      console.error('Failed to submit comment:', error);
      showToast(
        'コメントの投稿に失敗しました。もう一度お試しください。',
        'error',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const showToast = (message: string, type: ToastType) => {
    setToast({ message, type, isVisible: true });
  };

  const closeToast = () => {
    setToast((prev) => ({ ...prev, isVisible: false }));
  };

  const handleBodyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setBody(value);
    if (errors.body) {
      setErrors((prev) => ({ ...prev, body: undefined }));
    }
  };

  return (
    <>
      <div className="card p-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="comment-body"
              className="block text-sm font-medium text-zinc-700 mb-2"
            >
              コメントを追加 <span className="text-red-500">*</span>
            </label>
            <textarea
              id="comment-body"
              value={body}
              onChange={handleBodyChange}
              className={`textarea-field ${errors.body ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
              placeholder="コメントを入力してください"
              rows={3}
              maxLength={4000}
              disabled={isSubmitting}
            />
            <div className="flex justify-between items-center mt-1">
              {errors.body && <p className="error-text">{errors.body}</p>}
              <p className="text-xs text-zinc-500 ml-auto">
                {body.length}/4000
              </p>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting || !body.trim()}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'コメント中...' : 'コメントする'}
            </button>
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
