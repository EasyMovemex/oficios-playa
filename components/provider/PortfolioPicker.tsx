import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Colors } from '@/constants/Colors';

type Props = {
  images: string[];
  onChange: (images: string[]) => void;
};

export function PortfolioPicker({ images, onChange }: Props) {
  const pick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      quality: 0.7,
      selectionLimit: Math.max(1, 8 - images.length),
    });
    if (!result.canceled) {
      onChange([...images, ...result.assets.map((a) => a.uri)]);
    }
  };

  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={{
        fontFamily: 'Poppins_600SemiBold', fontSize: 13,
        color: Colors.textPrimary, marginBottom: 8,
      }}>
        Fotos de trabajos realizados <Text style={{ fontFamily: 'Poppins_400Regular', color: Colors.textSecondary }}>(opcional)</Text>
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 8, paddingRight: 4 }}
      >
        {images.map((uri, i) => (
          <View key={i} style={{ position: 'relative' }}>
            <Image source={{ uri }} style={{ width: 90, height: 90, borderRadius: 10 }} />
            <TouchableOpacity
              onPress={() => onChange(images.filter((_, idx) => idx !== i))}
              style={{
                position: 'absolute', top: 4, right: 4,
                backgroundColor: 'rgba(0,0,0,0.55)', borderRadius: 999, padding: 2,
              }}
            >
              <Ionicons name="close" size={14} color="white" />
            </TouchableOpacity>
          </View>
        ))}
        {images.length < 8 && (
          <TouchableOpacity
            onPress={pick}
            style={{
              width: 90, height: 90, borderRadius: 10,
              backgroundColor: Colors.background, borderWidth: 1.5,
              borderColor: '#E2E8F0',
              alignItems: 'center', justifyContent: 'center', gap: 4,
            }}
          >
            <Ionicons name="add" size={26} color={Colors.textSecondary} />
            <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 11, color: Colors.textSecondary }}>
              Agregar
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}
