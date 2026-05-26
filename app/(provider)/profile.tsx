import { View, Text, ScrollView, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Avatar, Rating, Badge, SkeletonCard, EmptyState } from '@/components/ui';
import { ServicesList } from '@/components/provider/ServicesList';
import { useMyProviderProfile } from '@/hooks/useProviderProfile';
import { useAuthStore } from '@/stores/authStore';
import { useAuth } from '@/hooks/useAuth';
import { Colors } from '@/constants/Colors';

export default function ProviderProfile() {
  const { profile } = useAuthStore();
  const { signOut } = useAuth();
  const { data: providerProfile, isLoading, refetch, isRefetching } = useMyProviderProfile();

  const handleSignOut = () => {
    Alert.alert('Cerrar sesión', '¿Estás seguro que querés salir?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Salir', style: 'destructive', onPress: signOut },
    ]);
  };

  const handleEdit = () => {
    Alert.alert('Editar perfil', 'La edición de perfil estará disponible próximamente.');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={Colors.primary} />
        }
      >
        {/* Header bar */}
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 16,
          paddingVertical: 14,
          backgroundColor: Colors.surface,
          borderBottomWidth: 1,
          borderBottomColor: '#E2E8F0',
        }}>
          <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 18, color: Colors.textPrimary }}>
            Mi perfil
          </Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <TouchableOpacity
              onPress={handleEdit}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 5,
                backgroundColor: Colors.background,
                borderRadius: 8,
                paddingHorizontal: 12,
                paddingVertical: 7,
                borderWidth: 1,
                borderColor: '#E2E8F0',
              }}
            >
              <Ionicons name="pencil-outline" size={15} color={Colors.primary} />
              <Text style={{ fontFamily: 'Poppins_500Medium', fontSize: 13, color: Colors.primary }}>
                Editar
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSignOut} style={{ padding: 7 }}>
              <Ionicons name="log-out-outline" size={22} color={Colors.danger} />
            </TouchableOpacity>
          </View>
        </View>

        {isLoading ? (
          <View style={{ paddingHorizontal: 16, paddingTop: 20, gap: 12 }}>
            <SkeletonCard height={160} />
            <SkeletonCard height={120} />
          </View>
        ) : !providerProfile ? (
          <EmptyState
            icon="person-circle-outline"
            title="Sin perfil de prestador"
            subtitle="Completá el onboarding como prestador para ver tu perfil aquí"
          />
        ) : (
          <>
            {/* Profile card */}
            <View style={{
              margin: 16,
              backgroundColor: Colors.surface,
              borderRadius: 20,
              padding: 24,
              alignItems: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.07,
              shadowRadius: 8,
              elevation: 3,
            }}>
              <Avatar
                uri={profile?.avatar_url}
                name={profile?.full_name ?? 'P'}
                size={80}
                verified={providerProfile.verified}
              />

              <Text style={{
                fontFamily: 'Poppins_700Bold',
                fontSize: 20,
                color: Colors.textPrimary,
                marginTop: 12,
                textAlign: 'center',
              }}>
                {profile?.full_name}
              </Text>

              {providerProfile.verified ? (
                <Text style={{ fontFamily: 'Poppins_500Medium', fontSize: 12, color: Colors.accent, marginTop: 2 }}>
                  ✓ Prestador verificado
                </Text>
              ) : (
                <Badge variant="warning" size="sm">Verificación pendiente</Badge>
              )}

              {providerProfile.total_reviews > 0 && (
                <View style={{ marginTop: 10 }}>
                  <Rating value={providerProfile.rating_avg} count={providerProfile.total_reviews} />
                </View>
              )}

              {/* Stats row */}
              <View style={{
                flexDirection: 'row',
                gap: 0,
                marginTop: 20,
                width: '100%',
                borderTopWidth: 1,
                borderTopColor: '#E2E8F0',
                paddingTop: 16,
              }}>
                {[
                  { label: 'Años exp.', value: String(providerProfile.years_experience) },
                  { label: 'Reseñas', value: String(providerProfile.total_reviews) },
                  { label: 'Cobertura', value: providerProfile.coverage_area },
                ].map((stat, i, arr) => (
                  <View
                    key={stat.label}
                    style={{
                      flex: 1,
                      alignItems: 'center',
                      borderRightWidth: i < arr.length - 1 ? 1 : 0,
                      borderRightColor: '#E2E8F0',
                    }}
                  >
                    <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 15, color: Colors.textPrimary }} numberOfLines={1}>
                      {stat.value}
                    </Text>
                    <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 11, color: Colors.textSecondary }}>
                      {stat.label}
                    </Text>
                  </View>
                ))}
              </View>

              {/* Bio */}
              {providerProfile.bio && (
                <Text style={{
                  fontFamily: 'Poppins_400Regular',
                  fontSize: 13,
                  color: Colors.textSecondary,
                  textAlign: 'center',
                  marginTop: 16,
                  lineHeight: 20,
                }}>
                  {providerProfile.bio}
                </Text>
              )}
            </View>

            {/* Services */}
            {providerProfile.provider_services.length > 0 && (
              <View style={{ marginHorizontal: 16, marginBottom: 32 }}>
                <Text style={{
                  fontFamily: 'Poppins_600SemiBold',
                  fontSize: 15,
                  color: Colors.textPrimary,
                  marginBottom: 10,
                }}>
                  Mis servicios
                </Text>
                <View style={{
                  backgroundColor: Colors.surface,
                  borderRadius: 16,
                  overflow: 'hidden',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.06,
                  shadowRadius: 3,
                  elevation: 2,
                }}>
                  <ServicesList services={providerProfile.provider_services} />
                </View>
              </View>
            )}

            {/* No services empty state */}
            {providerProfile.provider_services.length === 0 && (
              <View style={{ marginHorizontal: 16, marginBottom: 32 }}>
                <EmptyState
                  icon="construct-outline"
                  title="Sin servicios configurados"
                  subtitle="Editá tu perfil para agregar los servicios que ofrecés"
                  action={{ label: 'Editar perfil', onPress: handleEdit }}
                />
              </View>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
