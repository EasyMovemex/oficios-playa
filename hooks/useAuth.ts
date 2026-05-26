import { useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/authStore';
import type { Profile } from '@/types';

export function useAuth() {
  const { profile, activeRole, setProfile, setActiveRole } = useAuthStore();

  const fetchProfile = useCallback(async (userId: string): Promise<Profile | null> => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !data) return null;

    const p = data as Profile;
    setProfile(p);
    setActiveRole(p.role.includes('provider') ? 'provider' : 'client');
    return p;
  }, [setProfile, setActiveRole]);

  const signIn = useCallback(async (email: string, password: string) => {
    return supabase.auth.signInWithPassword({ email: email.trim(), password });
  }, []);

  const signUp = useCallback(async (
    email: string,
    password: string,
    fullName: string,
    phone?: string,
  ) => {
    return supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: { full_name: fullName, phone: phone ?? null },
      },
    });
  }, []);

  const signOut = useCallback(async () => {
    setProfile(null);
    await supabase.auth.signOut();
  }, [setProfile]);

  const updateRole = useCallback(async (
    userId: string,
    roles: string[],
  ) => {
    const { error } = await supabase
      .from('profiles')
      .update({ role: roles, updated_at: new Date().toISOString() })
      .eq('id', userId);

    if (!error && profile) {
      const updated = { ...profile, role: roles };
      setProfile(updated);
      setActiveRole(roles.includes('provider') ? 'provider' : 'client');
    }
    return { error };
  }, [profile, setProfile, setActiveRole]);

  return { profile, activeRole, fetchProfile, signIn, signUp, signOut, updateRole };
}
