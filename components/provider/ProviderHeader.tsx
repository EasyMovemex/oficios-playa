import { View, Text, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Avatar, Rating } from '@/components/ui';
import { Colors } from '@/constants/Colors';
import type { ProviderWithDetails } from '@/hooks/useProviders';

type Props = {
  provider: ProviderWithDetails;
};

type ScheduleEntry = { start: string; end: string } | { from: string; to: string };

function parseSchedule(raw: string): Array<{ day: string; start: string; end: string }> {
  try {
    const sched: Record<string, ScheduleEntry> = JSON.parse(raw);
    return Object.entries(sched).map(([day, val]) => ({
      day,
      start: 'start' in val ? val.start : val.from,
      end: 'end' in val ? val.end : val.to,
    }));
  } catch {
    return [];
  }
}

function InfoRow({ icon, text, onPress }: { icon: keyof typeof Ionicons.glyphMap; text: string; onPress?: () => void }) {
  const content = (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 }}>
      <Ionicons name={icon} size={14} color={Colors.textSecondary} />
      <Text style={{
        fontFamily: 'Poppins_400Regular', fontSize: 13,
        color: onPress ? Colors.primary : Colors.textSecondary,
        flexShrink: 1,
      }}>
        {text}
      </Text>
    </View>
  );
  if (onPress) return <TouchableOpacity onPress={onPress}>{content}</TouchableOpacity>;
  return content;
}

export function ProviderHeader({ provider }: Props) {
  const profile = provider.profiles;
  const displayName = provider.business_name ?? profile.full_name;
  const avatarUri = provider.logo_url ?? profile.avatar_url;

  const openWebsite = () => {
    if (!provider.website) return;
    const url = provider.website.startsWith('http')
      ? provider.website
      : `https://${provider.website}`;
    Linking.openURL(url);
  };

  return (
    <View style={{ alignItems: 'center', paddingVertical: 28, paddingHorizontal: 16 }}>
      <Avatar uri={avatarUri} name={displayName} size={88} verified={provider.verified} />

      <Text style={{
        fontFamily: 'Poppins_700Bold', fontSize: 20,
        color: Colors.textPrimary, marginTop: 12, textAlign: 'center',
      }}>
        {displayName}
      </Text>

      {provider.business_name && (
        <Text style={{
          fontFamily: 'Poppins_400Regular', fontSize: 13,
          color: Colors.textSecondary, marginTop: 2,
        }}>
          {profile.full_name}
        </Text>
      )}

      {provider.verified && (
        <Text style={{ fontFamily: 'Poppins_500Medium', fontSize: 12, color: Colors.accent, marginTop: 2 }}>
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
          <Text style={{ fontFamily: 'Poppins_500Medium', fontSize: 12, color: Colors.textPrimary, textAlign: 'center' }} numberOfLines={1}>
            {provider.coverage_area}
          </Text>
          <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 12, color: Colors.textSecondary }}>
            cobertura
          </Text>
        </View>
      </View>

      {provider.schedule && (() => {
        const entries = parseSchedule(provider.schedule);
        if (entries.length === 0) return null;
        return (
          <View style={{ marginTop: 12, alignSelf: 'stretch' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 }}>
              <Ionicons name="time-outline" size={14} color={Colors.textSecondary} />
              <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 13, color: Colors.textSecondary }}>
                Horario de atención
              </Text>
            </View>
            {entries.map(({ day, start, end }) => (
              <View key={day} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 3 }}>
                <Text style={{ fontFamily: 'Poppins_500Medium', fontSize: 13, color: Colors.textPrimary }}>
                  {day}
                </Text>
                <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 13, color: Colors.textSecondary }}>
                  {start} – {end}
                </Text>
              </View>
            ))}
          </View>
        );
      })()}

      {provider.website && (
        <InfoRow icon="globe-outline" text={provider.website} onPress={openWebsite} />
      )}

      {provider.bio && (
        <Text style={{
          fontFamily: 'Poppins_400Regular', fontSize: 14,
          color: Colors.textSecondary, textAlign: 'center',
          marginTop: 16, lineHeight: 22,
        }}>
          {provider.bio}
        </Text>
      )}
    </View>
  );
}
