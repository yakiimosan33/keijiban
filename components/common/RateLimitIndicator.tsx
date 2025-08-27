'use client';

import { useState, useEffect } from 'react';
import { rateLimiting } from '@/lib/api';

interface RateLimitIndicatorProps {
  type: 'post' | 'comment';
  className?: string;
  showCountdown?: boolean;
  onUpdate?: (info: { isAllowed: boolean; remaining: number; timeUntilReset: number }) => void;
}

export default function RateLimitIndicator({ 
  type, 
  className = '', 
  showCountdown = true,
  onUpdate 
}: RateLimitIndicatorProps) {
  const [rateLimitInfo, setRateLimitInfo] = useState<{
    isAllowed: boolean;
    remaining: number;
    timeUntilReset: number;
    message?: string;
  } | null>(null);
  
  const [countdown, setCountdown] = useState(0);

  // Get rate limit status
  const updateRateLimit = () => {
    const info = type === 'post' 
      ? rateLimiting.getPostRateLimitStatus()
      : rateLimiting.getCommentRateLimitStatus();
    
    setRateLimitInfo(info);
    setCountdown(info.timeUntilReset);
    
    if (onUpdate) {
      onUpdate(info);
    }
  };

  // Update rate limit status periodically
  useEffect(() => {
    updateRateLimit();
    
    const interval = setInterval(() => {
      updateRateLimit();
    }, 1000); // Update every second

    return () => clearInterval(interval);
  }, [type]);

  // Countdown timer
  useEffect(() => {
    if (countdown > 0 && !rateLimitInfo?.isAllowed) {
      const timer = setTimeout(() => {
        setCountdown(prev => Math.max(0, prev - 1));
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [countdown, rateLimitInfo?.isAllowed]);

  if (!rateLimitInfo) {
    return null;
  }

  // Don't show if everything is fine
  if (rateLimitInfo.isAllowed && rateLimitInfo.remaining > 1) {
    return null;
  }

  const formatTime = (seconds: number): string => {
    if (seconds < 60) {
      return `${seconds}秒`;
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}分${remainingSeconds}秒`;
  };

  return (
    <div className={`${className}`}>
      {/* Rate limit exceeded */}
      {!rateLimitInfo.isAllowed && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex-shrink-0">
            <svg 
              className="w-5 h-5 text-red-600" 
              fill="currentColor" 
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-red-800">
              {type === 'post' ? '投稿' : 'コメント'}制限に達しました
            </p>
            {showCountdown && countdown > 0 && (
              <p className="text-sm text-red-700 mt-1">
                {formatTime(countdown)}後に再度お試しください
              </p>
            )}
          </div>
          {showCountdown && countdown > 0 && (
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center w-8 h-8 bg-red-100 rounded-full">
                <span className="text-sm font-bold text-red-800">
                  {countdown}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Low remaining attempts warning */}
      {rateLimitInfo.isAllowed && rateLimitInfo.remaining <= 1 && (
        <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex-shrink-0">
            <svg 
              className="w-5 h-5 text-amber-600" 
              fill="currentColor" 
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-amber-800">
              {type === 'post' ? '投稿' : 'コメント'}制限に注意
            </p>
            <p className="text-sm text-amber-700 mt-1">
              残り{rateLimitInfo.remaining}回まで
              {type === 'post' ? '投稿' : 'コメント'}できます
            </p>
          </div>
          <div className="flex-shrink-0">
            <div className="flex items-center justify-center w-8 h-8 bg-amber-100 rounded-full">
              <span className="text-sm font-bold text-amber-800">
                {rateLimitInfo.remaining}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}