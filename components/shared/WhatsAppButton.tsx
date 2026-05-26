import { TouchableOpacity, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { openWhatsApp } from '@/lib/whatsapp';

type WhatsAppButtonProps = {
  phone: string;
  name: string;
};

export function WhatsAppButton({ phone, name }: WhatsAppButtonProps) {
  return (
    <TouchableOpacity
      onPress={() => openWhatsApp(phone, name)}
      activeOpacity={0.85}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        backgroundColor: '#25D366',
        borderRadius: 12,
        paddingVertical: 14,
        paddingHorizontal: 20,
      }}
    >
      <Ionicons name="logo-whatsapp" size={22} color="white" />
      <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 15, color: 'white' }}>
        Contactar por WhatsApp
      </Text>
    </TouchableOpacity>
  );
}
