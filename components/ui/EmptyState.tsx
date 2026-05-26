import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { Colors } from '@/constants/Colors';

type IoniconsName = ComponentProps<typeof Ionicons>['name'];

type EmptyStateProps = {
  icon?: IoniconsName;
  title: string;
  subtitle?: string;
  action?: {
    label: string;
    onPress: () => void;
  };
};

export function EmptyState({
  icon = 'search-outline',
  title,
  subtitle,
  action,
}: EmptyStateProps) {
  return (
    <View style={{
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 32,
    }}>
      <View style={{
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#E0F2FE',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
      }}>
        <Ionicons name={icon} size={36} color={Colors.primary} />
      </View>

      <Text style={{
        fontFamily: 'Poppins_700Bold',
        fontSize: 18,
        color: Colors.textPrimary,
        textAlign: 'center',
        marginBottom: 8,
      }}>
        {title}
      </Text>

      {subtitle && (
        <Text style={{
          fontFamily: 'Poppins_400Regular',
          fontSize: 14,
          color: Colors.textSecondary,
          textAlign: 'center',
          lineHeight: 21,
          marginBottom: action ? 24 : 0,
        }}>
          {subtitle}
        </Text>
      )}

      {action && (
        <TouchableOpacity
          onPress={action.onPress}
          style={{
            backgroundColor: Colors.primary,
            borderRadius: 12,
            paddingHorizontal: 28,
            paddingVertical: 13,
          }}
        >
          <Text style={{
            fontFamily: 'Poppins_600SemiBold',
            fontSize: 14,
            color: 'white',
          }}>
            {action.label}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
