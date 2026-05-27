import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { registerForPushNotificationsAsync, savePushToken } from '@/lib/notifications';

const F = {
  regular: 'Poppins_400Regular' as const,
  semiBold: 'Poppins_600SemiBold' as const,
  bold: 'Poppins_700Bold' as const,
};

export default function OnboardingScreen() {
  const router = useRouter();
  const { updateRole } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClient = async () => {
    setLoading(true);
    setError(null);
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;
    if (!userId) {
      setError('Sesión expirada. Iniciá sesión nuevamente.');
      setLoading(false);
      return;
    }
    const { error: roleErr } = await updateRole(userId, ['client']);
    if (roleErr) {
      setError('Error al guardar. Intentá de nuevo.');
      setLoading(false);
      return;
    }
    try {
      const token = await registerForPushNotificationsAsync();
      if (token) await savePushToken(token);
    } catch {}
    setLoading(false);
    router.replace('/(client)/home');
  };

  const handleProvider = () => {
    // Role is saved inside become-provider after profile creation
    router.push('/(modals)/become-provider');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
      <View style={{ flex: 1, padding: 24, paddingTop: 48, justifyContent: 'center' }}>
        <Text style={{ fontFamily: F.bold, fontSize: 28, color: Colors.textPrimary, textAlign: 'center' }}>
          ¡Bienvenido a{'\n'}OficiosPlaya!
        </Text>
        <Text style={{
          fontFamily: F.regular, fontSize: 15,
          color: Colors.textSecondary, textAlign: 'center',
          marginTop: 10, marginBottom: 44,
        }}>
          ¿Cómo vas a usar la app?
        </Text>

        {/* Client card */}
        <TouchableOpacity
          onPress={handleClient}
          disabled={loading}
          activeOpacity={0.85}
          style={{
            backgroundColor: Colors.surface,
            borderRadius: 20,
            padding: 28,
            marginBottom: 16,
            alignItems: 'center',
            borderWidth: 2,
            borderColor: '#E2E8F0',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.07,
            shadowRadius: 6,
            elevation: 3,
          }}
        >
          <Text style={{ fontSize: 52 }}>🔍</Text>
          <Text style={{ fontFamily: F.bold, fontSize: 18, color: Colors.textPrimary, marginTop: 14, textAlign: 'center' }}>
            Necesito un servicio
          </Text>
          <Text style={{ fontFamily: F.regular, fontSize: 13, color: Colors.textSecondary, textAlign: 'center', marginTop: 6, lineHeight: 20 }}>
            Buscá plomeros, electricistas, pintores y más cerca de tu zona
          </Text>
        </TouchableOpacity>

        {/* Provider card */}
        <TouchableOpacity
          onPress={handleProvider}
          disabled={loading}
          activeOpacity={0.85}
          style={{
            backgroundColor: Colors.secondary,
            borderRadius: 20,
            padding: 28,
            alignItems: 'center',
            shadowColor: Colors.secondary,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 5,
          }}
        >
          <Text style={{ fontSize: 52 }}>🔧</Text>
          <Text style={{ fontFamily: F.bold, fontSize: 18, color: 'white', marginTop: 14, textAlign: 'center' }}>
            Ofrezco mis servicios
          </Text>
          <Text style={{ fontFamily: F.regular, fontSize: 13, color: 'rgba(255,255,255,0.85)', textAlign: 'center', marginTop: 6, lineHeight: 20 }}>
            Registrate como prestador y conseguí clientes en Playa del Carmen
          </Text>
        </TouchableOpacity>

        {loading && (
          <ActivityIndicator color={Colors.primary} style={{ marginTop: 28 }} />
        )}

        {error && (
          <Text style={{ fontFamily: F.regular, fontSize: 12, color: Colors.danger, textAlign: 'center', marginTop: 16 }}>
            {error}
          </Text>
        )}

        <Text style={{ fontFamily: F.regular, fontSize: 12, color: Colors.textSecondary, textAlign: 'center', marginTop: 40 }}>
          Podés cambiar esto más adelante desde tu perfil
        </Text>
      </View>
    </SafeAreaView>
  );
}
