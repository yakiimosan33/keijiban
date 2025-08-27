'use client';

import { getCharacterCountColor, CHARACTER_THRESHOLDS } from '@/lib/validation';

interface CharacterCounterProps {
  current: number;
  max: number;
  fieldId: string;
  className?: string;
  showProgressBar?: boolean;
}

export default function CharacterCounter({ 
  current, 
  max, 
  fieldId, 
  className = '',
  showProgressBar = true 
}: CharacterCounterProps) {
  const ratio = current / max;
  const remaining = max - current;
  
  // Determine color and style based on usage ratio
  const colorClass = getCharacterCountColor(current, max);
  
  // Get progress bar color
  const getProgressColor = () => {
    if (ratio >= CHARACTER_THRESHOLDS.danger) {
      return 'bg-red-500';
    } else if (ratio >= CHARACTER_THRESHOLDS.warning) {
      return 'bg-amber-500';
    } else if (ratio >= CHARACTER_THRESHOLDS.safe) {
      return 'bg-yellow-500';
    } else {
      return 'bg-primary-500';
    }
  };

  // Get status text for screen readers
  const getStatusText = () => {
    if (ratio >= CHARACTER_THRESHOLDS.danger) {
      return `注意: 文字数制限に近づいています。残り${remaining}文字`;
    } else if (ratio >= CHARACTER_THRESHOLDS.warning) {
      return `警告: 残り${remaining}文字です`;
    } else {
      return `${current}文字入力済み、残り${remaining}文字`;
    }
  };

  // Get progress percentage for visual indicator
  const progressPercentage = Math.min((current / max) * 100, 100);

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {/* Character count display */}
      <div className="flex items-center justify-between">
        <span 
          className={`text-xs transition-colors duration-200 ${colorClass}`}
          id={`${fieldId}-counter`}
          aria-live="polite"
          aria-atomic="true"
        >
          {current}/{max}
        </span>
        
        {/* Status indicator for screen readers */}
        <span className="sr-only" aria-live="polite">
          {getStatusText()}
        </span>
        
        {/* Visual remaining count for high usage */}
        {ratio >= CHARACTER_THRESHOLDS.warning && (
          <span className={`text-xs font-medium ${colorClass}`}>
            残り{remaining}文字
          </span>
        )}
      </div>
      
      {/* Optional progress bar */}
      {showProgressBar && (
        <div className="w-full h-1 bg-zinc-200 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-300 ease-out ${getProgressColor()}`}
            style={{ width: `${progressPercentage}%` }}
            role="progressbar"
            aria-valuenow={current}
            aria-valuemin={0}
            aria-valuemax={max}
            aria-label={`文字数: ${current}/${max}`}
          />
        </div>
      )}
      
      {/* Warning messages */}
      {ratio >= CHARACTER_THRESHOLDS.danger && (
        <div className="flex items-center gap-1 text-red-600">
          <svg 
            className="w-3 h-3 flex-shrink-0" 
            fill="currentColor" 
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-xs font-medium">
            文字数制限に達しています
          </span>
        </div>
      )}
      
      {ratio >= CHARACTER_THRESHOLDS.warning && ratio < CHARACTER_THRESHOLDS.danger && (
        <div className="flex items-center gap-1 text-amber-600">
          <svg 
            className="w-3 h-3 flex-shrink-0" 
            fill="currentColor" 
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-xs">
            文字数制限に近づいています
          </span>
        </div>
      )}
    </div>
  );
}