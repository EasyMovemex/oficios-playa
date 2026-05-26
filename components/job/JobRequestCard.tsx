import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { JobStatusBadge } from './JobStatusBadge';
import { Colors } from '@/constants/Colors';
import type { JobRequestWithDetails } from '@/hooks/useJobRequests';

type JobRequestCardProps = {
  job: JobRequestWithDetails;
  onPress?: () => void;
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' });
}

export function JobRequestCard({ job, onPress }: JobRequestCardProps) {
  const bidCount = job.job_bids?.length ?? 0;
  const cat = job.service_categories;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={{
        backgroundColor: Colors.surface,
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 3,
        elevation: 2,
      }}
    >
      {/* Top row: status badge + bid count */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <JobStatusBadge status={job.status} />
          {cat && (
            <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 12, color: Colors.textSecondary }}>
              {cat.icon} {cat.name}
            </Text>
          )}
        </View>

        {bidCount > 0 && (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Ionicons name="chatbubble-outline" size={13} color={Colors.primary} />
            <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 12, color: Colors.primary }}>
              {bidCount} {bidCount === 1 ? 'oferta' : 'ofertas'}
            </Text>
          </View>
        )}
      </View>

      {/* Title */}
      <Text
        style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 15, color: Colors.textPrimary, marginBottom: 4 }}
        numberOfLines={2}
      >
        {job.title}
      </Text>

      {/* Bottom row: location + date */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, flex: 1 }}>
          <Ionicons name="location-outline" size={13} color={Colors.textSecondary} />
          <Text
            style={{ fontFamily: 'Poppins_400Regular', fontSize: 12, color: Colors.textSecondary }}
            numberOfLines={1}
          >
            {job.location}
          </Text>
        </View>

        <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 11, color: Colors.textSecondary }}>
          {formatDate(job.created_at)}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
