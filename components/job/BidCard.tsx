import { View, Text, TouchableOpacity } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Avatar, Rating, Badge } from '@/components/ui';
import { Colors } from '@/constants/Colors';
import type { BidWithProvider } from '@/hooks/useBids';

type BidCardProps = {
  bid: BidWithProvider;
  isJobOpen: boolean;
  onAccept?: () => void;
};

const STATUS_CONFIG = {
  pending:  { label: 'Pendiente', variant: 'neutral' as const },
  accepted: { label: 'Aceptada',  variant: 'accent'  as const },
  rejected: { label: 'Rechazada', variant: 'danger'  as const },
};

export function BidCard({ bid, isJobOpen, onAccept }: BidCardProps) {
  const provider = bid.provider_profiles;
  const profile  = provider.profiles;
  const config   = STATUS_CONFIG[bid.status];

  return (
    <View
      style={{
        backgroundColor: bid.status === 'accepted' ? '#F0FDF4' : Colors.surface,
        borderRadius: 14,
        padding: 16,
        marginBottom: 10,
        borderWidth: bid.status === 'accepted' ? 1.5 : 1,
        borderColor: bid.status === 'accepted' ? Colors.accent : '#E2E8F0',
      }}
    >
      {/* Provider row */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 }}>
        <Avatar uri={profile.avatar_url} name={profile.full_name} size={40} verified={provider.verified} />
        <View style={{ flex: 1 }}>
          <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 14, color: Colors.textPrimary }}>
            {profile.full_name}
          </Text>
          {provider.total_reviews > 0 && (
            <Rating value={provider.rating_avg} count={provider.total_reviews} />
          )}
        </View>
        <Badge variant={config.variant} size="sm">{config.label}</Badge>
      </View>

      {/* Price */}
      <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 20, color: Colors.primary, marginBottom: 4 }}>
        ${bid.price.toLocaleString('es-MX')}
      </Text>

      {/* Message */}
      {bid.message && (
        <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 13, color: Colors.textSecondary, lineHeight: 20 }}>
          {bid.message}
        </Text>
      )}

      {/* Accept button */}
      {isJobOpen && bid.status === 'pending' && onAccept && (
        <TouchableOpacity
          onPress={async () => {
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            onAccept();
          }}
          style={{
            marginTop: 12,
            backgroundColor: Colors.accent,
            borderRadius: 10,
            paddingVertical: 10,
            alignItems: 'center',
          }}
        >
          <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 14, color: 'white' }}>
            Aceptar oferta
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
