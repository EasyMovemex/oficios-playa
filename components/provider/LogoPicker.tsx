import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Colors } from '@/constants/Colors';

type Props = {
  uri: string | null;
  onChange: (uri: string) => void;
};

export function LogoPicker({ uri, onChange }: Props) {
  const pick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) onChange(result.assets[0].uri);
  };

  return (
    <View style={{ alignItems: 'center', marginBottom: 24 }}>
      <Text style={{
        fontFamily: 'Poppins_600SemiBold', fontSize: 13,
        color: Colors.textPrimary, marginBottom: 10, alignSelf: 'flex-start',
      }}>
        Logo / foto de perfil <Text style={{ fontFamily: 'Poppins_400Regular', color: Colors.textSecondary }}>(opcional)</Text>
      </Text>
      <TouchableOpacity onPress={pick} style={{ position: 'relative' }}>
        {uri ? (
          <Image source={{ uri }} style={{ width: 88, height: 88, borderRadius: 44 }} />
        ) : (
          <View style={{
            width: 88, height: 88, borderRadius: 44,
            backgroundColor: Colors.background, borderWidth: 2,
            borderColor: '#E2E8F0',
            alignItems: 'center', justifyContent: 'center',
          }}>
            <Ionicons name="camera-outline" size={30} color={Colors.textSecondary} />
          </View>
        )}
        <View style={{
          position: 'absolute', bottom: 0, right: 0,
          backgroundColor: Colors.primary, borderRadius: 999,
          padding: 5, borderWidth: 2, borderColor: 'white',
        }}>
          <Ionicons name="pencil" size={12} color="white" />
        </View>
      </TouchableOpacity>
    </View>
  );
}
