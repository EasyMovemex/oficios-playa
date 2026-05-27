import '../global.css';
import { Slot, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';
import { useEffect, useRef, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import * as Notifications from 'expo-notifications';
import Toast from 'react-native-toast-message';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/authStore';
import type { Profile } from '@/types';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 5 * 60 * 1000, retry: 1 },
  },
});

function AuthGate() {
  const router = useRouter();
  const segments = useSegments();
  const { profile, setProfile, setActiveRole } = useAuthStore();
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const notificationListener = useRef<ReturnType<typeof Notifications.addNotificationResponseReceivedListener> | null>(null);

  const loadProfile = async (userId: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (data) {
      const p = data as Profile;
      // FIX: ensure role is always an array before using it
      const role = Array.isArray(p.role) ? p.role : [];
      setProfile({ ...p, role });
      setActiveRole(role.includes('provider') ? 'provider' : 'client');
    }
  };

  useEffect(() => {
    // FIX: validate session against server before trusting the cached token.
    // If the user was deleted externally, getSession() still returns the stale
    // cached token — getUser() validates it and catches that case.
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const { error: userError } = await supabase.auth.getUser();
        if (userError) {
          // Stale / invalid session — clear it and send to login
          await supabase.auth.signOut();
          setSession(null);
          return;
        }
        await loadProfile(session.user.id);
      }
      setSession(session ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        // FIX: INITIAL_SESSION is already handled by getSession() above.
        // Processing it here as well causes a race condition where the
        // safety-net fires while the user is on app/index.tsx (not inAuthGroup)
        // and silently skips routing to the correct home screen.
        if (event === 'INITIAL_SESSION') return;

        if (event === 'SIGNED_OUT') {
          setProfile(null);
          setSession(null);
          return;
        }
        if (session?.user) {
          await loadProfile(session.user.id);
          setSession(session);
        }
      },
    );

    notificationListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data as { screen?: string; id?: string };
      if (data?.screen === 'job' && data?.id) {
        router.push(`/(modals)/job/${data.id}` as never);
      } else if (data?.screen === 'booking' && data?.id) {
        router.push(`/(modals)/booking/${data.id}` as never);
      }
    });

    return () => {
      subscription.unsubscribe();
      notificationListener.current?.remove();
    };
  }, []);

  useEffect(() => {
    if (session === undefined) return;

    const segs = segments as string[];
    const inAuthGroup = segs[0] === '(auth)';
    const inClientGroup = segs[0] === '(client)';
    const inProviderGroup = segs[0] === '(provider)';
    const inModalsGroup = segs[0] === '(modals)';
    const onOnboarding = inAuthGroup && segs[1] === 'onboarding';
    const onBecomeProvider = inModalsGroup && segs[1] === 'become-provider';

    if (!session) {
      if (!inAuthGroup) router.replace('/(auth)/login');
      return;
    }

    if (!profile) return;

    const role = Array.isArray(profile.role) ? profile.role : [];

    if (role.length === 0) {
      if (!onOnboarding && !onBecomeProvider) router.replace('/(auth)/onboarding');
      return;
    }

    // FIX: original only checked `inAuthGroup`. That misses the case where the
    // app opens with a persisted session on app/index.tsx (spinner) — the user
    // would be stuck forever. Now we route whenever the user is NOT already in
    // the correct destination (client, provider, or modals).
    if (!inClientGroup && !inProviderGroup && !inModalsGroup) {
      const dest = role.includes('provider') && !role.includes('client')
        ? '/(provider)/home'
        : '/(client)/home';
      router.replace(dest);
    }
  }, [session, profile, segments]);

  return <Slot />;
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar style="auto" />
      <AuthGate />
      <Toast />
    </QueryClientProvider>
  );
}
