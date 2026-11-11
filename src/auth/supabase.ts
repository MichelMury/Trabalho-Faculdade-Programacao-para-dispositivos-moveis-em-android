import 'react-native-url-polyfill/auto';
import { createClient, processLock, type SupabaseClient } from '@supabase/supabase-js';
import { sessionStorage } from './sessionStorage';
import { AuthFailure } from './types';
import { publicConfig } from './publicConfig';

let instance: SupabaseClient | null = null;

export function isSupabaseConfigured(): boolean {
  const url = process.env.EXPO_PUBLIC_SUPABASE_URL || publicConfig.url;
  const key = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY || publicConfig.publishableKey;
  return !!url && /^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/i.test(url) && !!key?.startsWith('sb_publishable_') && !key.includes('SUA_CHAVE');
}

export function getSupabase(): SupabaseClient {
  if (instance) return instance;
  const url = process.env.EXPO_PUBLIC_SUPABASE_URL || publicConfig.url;
  const key = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY || publicConfig.publishableKey;
  if (!isSupabaseConfigured()) {
    throw new AuthFailure('O acesso à conta ainda não está disponível. Tente novamente mais tarde.');
  }
  instance = createClient(url!, key!, {
    auth: { storage: sessionStorage, autoRefreshToken: true, persistSession: true, detectSessionInUrl: false, lock: processLock },
  });
  return instance;
}
