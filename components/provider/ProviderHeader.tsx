import { View, Text } from 'react-native';
import { Avatar, Rating } from '@/components/ui';
import { Colors } from '@/constants/Colors';
import type { ProviderWithDetails } from '@/hooks/useProviders';

type ProviderHeaderProps = {
  provider: ProviderWithDetails;
};

export function ProviderHeader({ provider }: ProviderHeaderProps) {
  const profile = provider.profiles;

  return (
    <View style={{ alignItems: 'center', paddingVertical: 28, paddingHorizontal: 16 }}>
      <Avatar
        uri={profile.avatar_url}
        name={profile.full_name}
        size={88}
        verified={provider.verified}
      />

      <Text
        style={{
          fontFamily: 'Poppins_700Bold',
          fontSize: 20,
          color: Colors.textPrimary,
          marginTop: 12,
          textAlign: 'center',
        }}
      >
        {profile.full_name}
      </Text>

      {provider.verified && (
        <Text
          style={{
            fontFamily: 'Poppins_500Medium',
            fontSize: 12,
            color: Colors.accent,
            marginTop: 2,
          }}
        >
          ✓ Prestador verificado
        </Text>
      )}

      {provider.total_reviews > 0 && (
        <View style={{ marginTop: 8 }}>
          <Rating value={provider.rating_avg} count={provider.total_reviews} />
        </View>
      )}

      <View style={{ flexDirection: 'row', gap: 24, marginTop: 14 }}>
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 16, color: Colors.textPrimary }}>
            {provider.years_experience}
          </Text>
          <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 12, color: Colors.textSecondary }}>
            años exp.
          </Text>
        </View>
        <View style={{ width: 1, backgroundColor: '#E2E8F0' }} />
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontFamily: 'Poppins_700Bold', fontSize: 16, color: Colors.textPrimary }}>
            {provider.total_reviews}
          </Text>
          <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 12, color: Colors.textSecondary }}>
            reseñas
          </Text>
        </View>
        <View style={{ width: 1, backgroundColor: '#E2E8F0' }} />
        <View style={{ alignItems: 'center' }}>
          <Text
            style={{ fontFamily: 'Poppins_500Medium', fontSize: 12, color: Colors.textPrimary, textAlign: 'center' }}
            numberOfLines={1}
          >
            {provider.coverage_area}
          </Text>
          <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 12, color: Colors.textSecondary }}>
            cobertura
          </Text>
        </View>
      </View>

      {provider.bio && (
        <Text
          style={{
            fontFamily: 'Poppins_400Regular',
            fontSize: 14,
            color: Colors.textSecondary,
            textAlign: 'center',
            marginTop: 16,
            lineHeight: 22,
          }}
        >
          {provider.bio}
        </Text>
      )}
    </View>
  );
}
