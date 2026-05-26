import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Avatar } from '@/components/ui';
import { useAuthStore } from '@/stores/authStore';
import { useAuth } from '@/hooks/useAuth';
import { Colors } from '@/constants/Colors';

type MenuRowProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  danger?: boolean;
};

function MenuRow({ icon, label, onPress, danger }: MenuRowProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        paddingVertical: 15,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
      }}
    >
      <Ionicons name={icon} size={20} color={danger ? Colors.danger : Colors.textSecondary} />
      <Text style={{
        fontFamily: 'Poppins_500Medium',
        fontSize: 14,
        color: danger ? Colors.danger : Colors.textPrimary,
        flex: 1,
      }}>
        {label}
      </Text>
      {!danger && <Ionicons name="chevron-forward" size={16} color={Colors.textSecondary} />}
    </TouchableOpacity>
  );
}

export default function ClientProfile() {
  const router = useRouter();
  const { profile } = useAuthStore();
  const { signOut } = useAuth();

  const handleSignOut = () => {
    Alert.alert('Cerrar sesión', '¿Estás seguro que querés salir?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Salir', style: 'destructive', onPress: signOut },
    ]);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={{
          backgroundColor: Colors.surface,
          paddingHorizontal: 16,
          paddingTop: 24,
          paddingBottom: 28,
          alignItems: 'center',
          borderBottomWidth: 1,
          borderBottomColor: '#E2E8F0',
        }}>
          <Avatar
            uri={profile?.avatar_url}
            name={profile?.full_name ?? 'U'}
            size={72}
          />
          <Text style={{
            fontFamily: 'Poppins_700Bold',
            fontSize: 20,
            color: Colors.textPrimary,
            marginTop: 12,
            textAlign: 'center',
          }}>
            {profile?.full_name ?? 'Usuario'}
          </Text>
          {profile?.phone && (
            <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 13, color: Colors.textSecondary, marginTop: 2 }}>
              {profile.phone}
            </Text>
          )}
        </View>

        {/* Menu */}
        <View style={{
          backgroundColor: Colors.surface,
          marginTop: 16,
          marginHorizontal: 16,
          borderRadius: 16,
          overflow: 'hidden',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.05,
          shadowRadius: 3,
          elevation: 1,
        }}>
          <MenuRow
            icon="calendar-outline"
            label="Mis reservas"
            onPress={() => router.push('/(client)/bookings')}
          />
          <MenuRow
            icon="document-text-outline"
            label="Mis solicitudes"
            onPress={() => router.push('/(client)/requests')}
          />
          <MenuRow
            icon="pencil-outline"
            label="Editar perfil"
            onPress={() => Alert.alert('Editar perfil', 'Disponible próximamente.')}
          />
          <MenuRow
            icon="notifications-outline"
            label="Notificaciones"
            onPress={() => Alert.alert('Notificaciones', 'Disponible próximamente.')}
          />
        </View>

        <View style={{
          backgroundColor: Colors.surface,
          marginTop: 16,
          marginHorizontal: 16,
          borderRadius: 16,
          overflow: 'hidden',
          marginBottom: 32,
        }}>
          <MenuRow
            icon="log-out-outline"
            label="Cerrar sesión"
            onPress={handleSignOut}
            danger
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
