import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';

const CHUNK_SIZE = 1800;

// SecureStore has a ~2048 byte limit per key. Supabase session JSON easily
// exceeds that, so we split large values into numbered chunks.
const storage = {
  async getItem(key: string): Promise<string | null> {
    try {
      const countRaw = await SecureStore.getItemAsync(`${key}__count`);
      if (!countRaw) return SecureStore.getItemAsync(key);
      const count = parseInt(countRaw, 10);
      const chunks: string[] = [];
      for (let i = 0; i < count; i++) {
        const chunk = await SecureStore.getItemAsync(`${key}__${i}`);
        if (chunk === null) return null;
        chunks.push(chunk);
      }
      return chunks.join('');
    } catch {
      return null;
    }
  },
  async setItem(key: string, value: string): Promise<void> {
    try {
      // Always clean up first to avoid stale chunk metadata from a previous save
      await storage.removeItem(key);
      if (value.length <= CHUNK_SIZE) {
        await SecureStore.setItemAsync(key, value);
        return;
      }
      const count = Math.ceil(value.length / CHUNK_SIZE);
      await SecureStore.setItemAsync(`${key}__count`, String(count));
      for (let i = 0; i < count; i++) {
        await SecureStore.setItemAsync(
          `${key}__${i}`,
          value.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE),
        );
      }
    } catch {}
  },
  async removeItem(key: string): Promise<void> {
    try {
      const countRaw = await SecureStore.getItemAsync(`${key}__count`);
      if (countRaw) {
        const count = parseInt(countRaw, 10);
        await SecureStore.deleteItemAsync(`${key}__count`);
        for (let i = 0; i < count; i++) {
          await SecureStore.deleteItemAsync(`${key}__${i}`);
        }
      } else {
        await SecureStore.deleteItemAsync(key);
      }
    } catch {}
  },
};

export const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      storage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  },
);
