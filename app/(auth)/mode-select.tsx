import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useAuthStore } from '@/stores/authStore';

const F = {
  regular: 'Poppins_400Regular' as const,
  semiBold: 'Poppins_600SemiBold' as const,
  bold: 'Poppins_700Bold' as const,
};

export default function ModeSelectScreen() {
  const router = useRouter();
  const { setActiveRole } = useAuthStore();

  const goClient = () => {
    setActiveRole('client');
    router.replace('/(client)/home');
  };

  const goProvider = () => {
    setActiveRole('provider');
    router.replace('/(provider)/home');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
      <View style={{ flex: 1, padding: 24, paddingTop: 48, justifyContent: 'center' }}>
        <Text style={{ fontFamily: F.bold, fontSize: 26, color: Colors.textPrimary, textAlign: 'center' }}>
          ¿Con qué modo{'\n'}querés entrar?
        </Text>
        <Text style={{
          fontFamily: F.regular, fontSize: 14,
          color: Colors.textSecondary, textAlign: 'center',
          marginTop: 8, marginBottom: 44,
        }}>
          Podés cambiar de modo en cualquier momento desde tu perfil
        </Text>

        {/* Client mode */}
        <TouchableOpacity
          onPress={goClient}
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
          <Text style={{ fontSize: 48 }}>🔍</Text>
          <Text style={{ fontFamily: F.bold, fontSize: 18, color: Colors.textPrimary, marginTop: 14, textAlign: 'center' }}>
            Modo cliente
          </Text>
          <Text style={{ fontFamily: F.regular, fontSize: 13, color: Colors.textSecondary, textAlign: 'center', marginTop: 6, lineHeight: 20 }}>
            Buscá prestadores y gestioná tus solicitudes
          </Text>
        </TouchableOpacity>

        {/* Provider mode */}
        <TouchableOpacity
          onPress={goProvider}
          activeOpacity={0.85}
          style={{
            backgroundColor: Colors.primary,
            borderRadius: 20,
            padding: 28,
            alignItems: 'center',
            shadowColor: Colors.primary,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 5,
          }}
        >
          <Text style={{ fontSize: 48 }}>🔧</Text>
          <Text style={{ fontFamily: F.bold, fontSize: 18, color: 'white', marginTop: 14, textAlign: 'center' }}>
            Modo prestador
          </Text>
          <Text style={{ fontFamily: F.regular, fontSize: 13, color: 'rgba(255,255,255,0.85)', textAlign: 'center', marginTop: 6, lineHeight: 20 }}>
            Gestioná tus trabajos y respondé solicitudes de clientes
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
