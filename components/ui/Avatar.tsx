import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Colors } from '@/constants/Colors';

type AvatarProps = {
  uri?: string | null;
  name: string;
  size?: number;
  verified?: boolean;
  onPress?: () => void;
};

function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0] ?? '')
    .join('')
    .toUpperCase();
}

export function Avatar({ uri, name, size = 48, verified = false, onPress }: AvatarProps) {
  const [imgError, setImgError] = useState(false);
  const showImage = !!uri && !imgError;
  const badgeSize = Math.round(size * 0.34);

  const circle = (
    <View style={{ position: 'relative', width: size, height: size }}>
      <View style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: Colors.primary,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {showImage ? (
          <Image
            source={{ uri }}
            style={{ width: size, height: size }}
            onError={() => setImgError(true)}
          />
        ) : (
          <Text style={{
            fontFamily: 'Poppins_700Bold',
            fontSize: Math.round(size * 0.36),
            color: 'white',
          }}>
            {initials(name)}
          </Text>
        )}
      </View>

      {verified && (
        <View style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: badgeSize,
          height: badgeSize,
          borderRadius: badgeSize / 2,
          backgroundColor: Colors.accent,
          borderWidth: 1.5,
          borderColor: 'white',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Ionicons name="checkmark" size={Math.round(badgeSize * 0.6)} color="white" />
        </View>
      )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        {circle}
      </TouchableOpacity>
    );
  }

  return circle;
}
