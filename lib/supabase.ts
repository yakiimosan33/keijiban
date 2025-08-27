import { createClient } from '@supabase/supabase-js';
import type { Database } from './types/supabase';

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL');
}

if (!supabaseAnonKey) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

// Create Supabase client with type safety and real-time configuration
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false, // Anonymous board - no authentication needed
    autoRefreshToken: false,
  },
  realtime: {
    params: {
      eventsPerSecond: 10, // Limit events to prevent spam
    },
  },
  global: {
    headers: {
      'x-application-name': 'keijiban',
    },
  },
  db: {
    schema: 'public',
  },
});

// Export types for convenience
export type { Database } from './types/supabase';
