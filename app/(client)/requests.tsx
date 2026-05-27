import { View, Text, FlatList, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { JobRequestCard } from '@/components/job/JobRequestCard';
import { SkeletonCard, EmptyState } from '@/components/ui';
import { useMyJobRequests } from '@/hooks/useJobRequests';
import { Colors } from '@/constants/Colors';

export default function Requests() {
  const router = useRouter();
  const { data: jobs, isLoading, refetch, isRefetching } = useMyJobRequests();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }} edges={['top']}>
      {/* Header */}
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
          Mis solicitudes
        </Text>
        <TouchableOpacity
          onPress={() => router.push('/(modals)/new-request')}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 5,
            backgroundColor: Colors.primary,
            borderRadius: 8,
            paddingHorizontal: 12,
            paddingVertical: 7,
          }}
        >
          <Ionicons name="add" size={16} color="white" />
          <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 13, color: 'white' }}>
            Nueva
          </Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={{ paddingHorizontal: 16, paddingTop: 16, gap: 12 }}>
          <SkeletonCard height={96} />
          <SkeletonCard height={96} />
          <SkeletonCard height={96} />
        </View>
      ) : (
        <FlatList
          data={jobs ?? []}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 32 }}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={Colors.primary} />
          }
          ListEmptyComponent={
            <EmptyState
              icon="document-text-outline"
              title="Sin solicitudes"
              subtitle="Publicá tu primer pedido y recibí ofertas de prestadores verificados"
              action={{
                label: 'Publicar solicitud',
                onPress: () => router.push('/(modals)/new-request'),
              }}
            />
          }
          renderItem={({ item }) => (
            <JobRequestCard
                job={item}
                onPress={() => router.push(`/(modals)/job/${item.id}`)}
              />
          )}
        />
      )}
    </SafeAreaView>
  );
}
