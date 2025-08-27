'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

/**
 * Component to display real-time connection status
 * Useful for debugging and monitoring real-time connectivity
 */
export default function RealtimeStatus() {
  const [status, setStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('connecting');
  const [lastHeartbeat, setLastHeartbeat] = useState<Date | null>(null);

  useEffect(() => {
    // Create a test channel to monitor connection status
    const testChannel = supabase
      .channel('connection-test')
      .on('presence', { event: 'sync' }, () => {
        setStatus('connected');
        setLastHeartbeat(new Date());
      })
      .on('error', () => {
        setStatus('error');
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          setStatus('connected');
          setLastHeartbeat(new Date());
        } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          setStatus('error');
        } else if (status === 'CLOSED') {
          setStatus('disconnected');
        }
      });

    // Set up a heartbeat interval
    const heartbeatInterval = setInterval(() => {
      if (testChannel.state === 'joined') {
        setLastHeartbeat(new Date());
      }
    }, 30000); // Every 30 seconds

    return () => {
      clearInterval(heartbeatInterval);
      supabase.removeChannel(testChannel);
    };
  }, []);

  const getStatusColor = () => {
    switch (status) {
      case 'connected':
        return 'text-green-600';
      case 'connecting':
        return 'text-yellow-600';
      case 'disconnected':
        return 'text-gray-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'connected':
        return (
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <circle cx="10" cy="10" r="8"/>
          </svg>
        );
      case 'connecting':
        return (
          <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
          </svg>
        );
      case 'disconnected':
      case 'error':
        return (
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <circle cx="10" cy="10" r="8" opacity="0.3"/>
          </svg>
        );
      default:
        return null;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'connected':
        return 'リアルタイム接続中';
      case 'connecting':
        return '接続中...';
      case 'disconnected':
        return '切断されました';
      case 'error':
        return '接続エラー';
      default:
        return '不明';
    }
  };

  // Only show in development or if there's an error
  const shouldShow = process.env.NODE_ENV === 'development' || status === 'error' || status === 'disconnected';

  if (!shouldShow) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white border border-zinc-200 rounded-lg px-3 py-2 shadow-lg">
        <div className="flex items-center gap-2">
          <div className={`flex items-center ${getStatusColor()}`}>
            {getStatusIcon()}
          </div>
          <div className="flex flex-col">
            <span className={`text-xs font-medium ${getStatusColor()}`}>
              {getStatusText()}
            </span>
            {lastHeartbeat && status === 'connected' && (
              <span className="text-xs text-zinc-500">
                最終更新: {lastHeartbeat.toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}