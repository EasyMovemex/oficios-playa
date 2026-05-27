import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { Avatar } from '@/components/ui';
import { useAuthStore } from '@/stores/authStore';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { uploadToStorage } from '@/lib/uploadImage';
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
  const { profile, setProfile, setActiveRole } = useAuthStore();
  const { signOut } = useAuth();
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const isProvider = profile?.role.includes('provider') ?? false;

  const handleAvatarPick = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso requerido', 'Necesitamos acceso a tu galería para cambiar la foto.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (result.canceled || !result.assets[0]) return;
    if (!profile?.id) return;

    setUploadingAvatar(true);
    try {
      const uri = result.assets[0].uri;
      const path = `avatars/${profile.id}.jpg`;
      const publicUrl = await uploadToStorage(uri, path);
      await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl, updated_at: new Date().toISOString() })
        .eq('id', profile.id);
      setProfile({ ...profile, avatar_url: publicUrl });
    } catch {
      Alert.alert('Error', 'No se pudo subir la foto. Intentá de nuevo.');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSwitchToProvider = () => {
    setActiveRole('provider');
    router.replace('/(provider)/home');
  };

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
          {/* Avatar tappable con ícono de cámara */}
          <TouchableOpacity onPress={handleAvatarPick} disabled={uploadingAvatar} activeOpacity={0.8}>
            <View>
              <Avatar
                uri={profile?.avatar_url}
                name={profile?.full_name ?? 'U'}
                size={72}
              />
              <View style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                backgroundColor: Colors.primary,
                borderRadius: 999,
                padding: 5,
                borderWidth: 2,
                borderColor: Colors.surface,
              }}>
                {uploadingAvatar
                  ? <ActivityIndicator size={12} color="white" />
                  : <Ionicons name="camera" size={12} color="white" />
                }
              </View>
            </View>
          </TouchableOpacity>

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
            icon="shield-checkmark-outline"
            label="Términos y condiciones"
            onPress={() => router.push('/(auth)/terms')}
          />
          <MenuRow
            icon="lock-closed-outline"
            label="Política de privacidad"
            onPress={() => router.push('/(auth)/privacy')}
          />
        </View>

        {isProvider ? (
          <TouchableOpacity
            onPress={handleSwitchToProvider}
            style={{
              marginHorizontal: 16,
              marginTop: 16,
              borderRadius: 16,
              backgroundColor: Colors.primary,
              padding: 20,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 14,
            }}
          >
            <View style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: 'rgba(255,255,255,0.2)',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Text style={{ fontSize: 22 }}>🔧</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 15, color: 'white' }}>
                Cambiar a modo prestador
              </Text>
              <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 2 }}>
                Ver solicitudes y gestionar tus trabajos
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.8)" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => router.push('/(modals)/become-provider')}
            style={{
              marginHorizontal: 16,
              marginTop: 16,
              borderRadius: 16,
              backgroundColor: Colors.secondary,
              padding: 20,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 14,
            }}
          >
            <View style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: 'rgba(255,255,255,0.2)',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Text style={{ fontSize: 22 }}>🔨</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 15, color: 'white' }}>
                Ofrecer mis servicios
              </Text>
              <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 2 }}>
                Registrate como prestador y conseguí clientes
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.8)" />
          </TouchableOpacity>
        )}

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
