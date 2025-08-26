'use client';

import { useState } from 'react';
import Toast, { ToastType } from '@/components/common/Toast';

interface PostFormProps {
  onSubmitted: () => void;
  onCancel: () => void;
}

interface FormErrors {
  title?: string;
  body?: string;
}

export default function PostForm({ onSubmitted, onCancel }: PostFormProps) {
  const [title, setTitle] = useState('');
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

    if (!title.trim()) {
      newErrors.title = 'タイトルを入力してください';
    } else if (title.length > 120) {
      newErrors.title = 'タイトルは120文字以内で入力してください';
    }

    if (!body.trim()) {
      newErrors.body = '本文を入力してください';
    } else if (body.length > 4000) {
      newErrors.body = '本文は4000文字以内で入力してください';
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

      showToast('投稿を受け付けました', 'success');
      onSubmitted();
    } catch (error) {
      console.error('Failed to submit post:', error);
      showToast('投稿に失敗しました。もう一度お試しください。', 'error');
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

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTitle(value);
    if (errors.title) {
      setErrors((prev) => ({ ...prev, title: undefined }));
    }
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
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-zinc-700 mb-2"
          >
            タイトル <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={handleTitleChange}
            className={`input-field ${errors.title ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
            placeholder="投稿のタイトルを入力してください"
            maxLength={120}
            disabled={isSubmitting}
          />
          <div className="flex justify-between items-center mt-1">
            {errors.title && <p className="error-text">{errors.title}</p>}
            <p className="text-xs text-zinc-500 ml-auto">{title.length}/120</p>
          </div>
        </div>

        <div>
          <label
            htmlFor="body"
            className="block text-sm font-medium text-zinc-700 mb-2"
          >
            本文 <span className="text-red-500">*</span>
          </label>
          <textarea
            id="body"
            value={body}
            onChange={handleBodyChange}
            className={`textarea-field ${errors.body ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
            placeholder="投稿の内容を入力してください"
            rows={6}
            maxLength={4000}
            disabled={isSubmitting}
          />
          <div className="flex justify-between items-center mt-1">
            {errors.body && <p className="error-text">{errors.body}</p>}
            <p className="text-xs text-zinc-500 ml-auto">{body.length}/4000</p>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? '投稿中...' : '投稿する'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            キャンセル
          </button>
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
