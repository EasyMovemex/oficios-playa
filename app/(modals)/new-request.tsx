import {
  View, Text, TextInput, ScrollView, TouchableOpacity,
  Image, ActivityIndicator, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import Toast from 'react-native-toast-message';
import { useCategories } from '@/hooks/useCategories';
import { useCreateJobRequest } from '@/hooks/useJobRequests';
import { supabase } from '@/lib/supabase';
import { Colors } from '@/constants/Colors';

const F = {
  regular: 'Poppins_400Regular' as const,
  medium:  'Poppins_500Medium'  as const,
  semiBold:'Poppins_600SemiBold'as const,
  bold:    'Poppins_700Bold'    as const,
};

async function uploadPhoto(uri: string, userId: string): Promise<string> {
  const ext = uri.split('.').pop()?.toLowerCase() ?? 'jpg';
  const path = `${userId}/${Date.now()}.${ext}`;
  const response = await fetch(uri);
  const blob = await response.blob();
  const { error } = await supabase.storage
    .from('job-photos')
    .upload(path, blob, { contentType: `image/${ext}` });
  if (error) throw error;
  return supabase.storage.from('job-photos').getPublicUrl(path).data.publicUrl;
}

export default function NewRequest() {
  const router = useRouter();
  const { data: categories = [] } = useCategories();
  const createJobRequest = useCreateJobRequest();

  const [step, setStep] = useState<1 | 2>(1);
  const [categoryId, setCategoryId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [budgetMin, setBudgetMin] = useState('');
  const [budgetMax, setBudgetMax] = useState('');
  const [photoUris, setPhotoUris] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const selectedCat = categories.find((c) => c.id === categoryId);

  const pickPhotos = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso requerido', 'Necesitamos acceso a tus fotos para adjuntarlas.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
      selectionLimit: 5 - photoUris.length,
    });
    if (!result.canceled) {
      setPhotoUris((prev) => [...prev, ...result.assets.map((a) => a.uri)].slice(0, 5));
    }
  };

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim() || !location.trim() || !categoryId) {
      Toast.show({ type: 'error', text1: 'Campos requeridos', text2: 'Completá categoría, título, descripción y zona.' });
      return;
    }
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No autenticado');

      let uploadedUrls: string[] = [];
      if (photoUris.length > 0) {
        uploadedUrls = await Promise.all(photoUris.map((uri) => uploadPhoto(uri, user.id)));
      }

      await createJobRequest.mutateAsync({
        category_id: categoryId,
        title: title.trim(),
        description: description.trim(),
        location: location.trim(),
        budget_min: budgetMin ? parseFloat(budgetMin) : undefined,
        budget_max: budgetMax ? parseFloat(budgetMax) : undefined,
        photos: uploadedUrls.length > 0 ? uploadedUrls : undefined,
      });

      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.back();
    } catch (e) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'No se pudo publicar la solicitud. Intentá de nuevo.' });
    } finally {
      setUploading(false);
    }
  };

  // ── Step 1: Select category ──────────────────────────────────────────────
  if (step === 1) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }} edges={['top']}>
        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12 }}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="close" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={{ fontFamily: F.bold, fontSize: 18, color: Colors.textPrimary }}>
            Nueva solicitud
          </Text>
        </View>

        <Text style={{ fontFamily: F.semiBold, fontSize: 14, color: Colors.textPrimary, paddingHorizontal: 16, marginBottom: 12 }}>
          ¿Qué tipo de servicio necesitás?
        </Text>

        <ScrollView contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 32 }}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {categories.map((cat) => {
              const isSelected = cat.id === categoryId;
              return (
                <TouchableOpacity
                  key={cat.id}
                  onPress={() => setCategoryId(cat.id)}
                  style={{
                    width: '33.33%',
                    alignItems: 'center',
                    paddingVertical: 14,
                    paddingHorizontal: 6,
                  }}
                >
                  <View style={{
                    width: 60, height: 60,
                    borderRadius: 16,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: isSelected ? Colors.primary + '18' : Colors.surface,
                    borderWidth: 2,
                    borderColor: isSelected ? Colors.primary : '#E2E8F0',
                    marginBottom: 6,
                  }}>
                    <Text style={{ fontSize: 26 }}>{cat.icon}</Text>
                  </View>
                  <Text style={{
                    fontFamily: isSelected ? F.semiBold : F.medium,
                    fontSize: 11,
                    color: isSelected ? Colors.primary : Colors.textPrimary,
                    textAlign: 'center',
                  }} numberOfLines={2}>{cat.name}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>

        <View style={{ padding: 16 }}>
          <TouchableOpacity
            onPress={() => setStep(2)}
            disabled={!categoryId}
            style={{
              backgroundColor: categoryId ? Colors.primary : Colors.textSecondary,
              borderRadius: 12,
              paddingVertical: 16,
              alignItems: 'center',
            }}
          >
            <Text style={{ fontFamily: F.semiBold, fontSize: 15, color: 'white' }}>
              Siguiente →
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ── Step 2: Details ──────────────────────────────────────────────────────
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }} edges={['top']}>
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12 }}>
        <TouchableOpacity onPress={() => setStep(1)}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={{ fontFamily: F.bold, fontSize: 18, color: Colors.textPrimary }}>Detalle</Text>
          {selectedCat && (
            <Text style={{ fontFamily: F.regular, fontSize: 12, color: Colors.textSecondary }}>
              {selectedCat.icon} {selectedCat.name}
            </Text>
          )}
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}>
        {[
          { label: 'Título *', value: title, onChange: setTitle, placeholder: 'Ej: Arreglar fuga en cocina', multiline: false },
          { label: 'Descripción *', value: description, onChange: setDescription, placeholder: 'Describí el trabajo con detalle...', multiline: true },
          { label: 'Zona / Colonia *', value: location, onChange: setLocation, placeholder: 'Ej: Centro, Playacar, Ejidal...', multiline: false },
        ].map(({ label, value, onChange, placeholder, multiline }) => (
          <View key={label} style={{ marginBottom: 14 }}>
            <Text style={{ fontFamily: F.semiBold, fontSize: 13, color: Colors.textPrimary, marginBottom: 6 }}>{label}</Text>
            <TextInput
              value={value}
              onChangeText={onChange}
              placeholder={placeholder}
              placeholderTextColor={Colors.textSecondary}
              multiline={multiline}
              numberOfLines={multiline ? 4 : 1}
              style={{
                backgroundColor: Colors.surface,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: '#E2E8F0',
                padding: 12,
                fontFamily: F.regular,
                fontSize: 14,
                color: Colors.textPrimary,
                textAlignVertical: multiline ? 'top' : 'center',
                minHeight: multiline ? 90 : undefined,
              }}
            />
          </View>
        ))}

        {/* Budget */}
        <Text style={{ fontFamily: F.semiBold, fontSize: 13, color: Colors.textPrimary, marginBottom: 6 }}>
          Presupuesto estimado (opcional)
        </Text>
        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 14 }}>
          {[
            { label: 'Mínimo $', value: budgetMin, onChange: setBudgetMin },
            { label: 'Máximo $', value: budgetMax, onChange: setBudgetMax },
          ].map(({ label, value, onChange }) => (
            <TextInput
              key={label}
              value={value}
              onChangeText={onChange}
              placeholder={label}
              placeholderTextColor={Colors.textSecondary}
              keyboardType="decimal-pad"
              style={{
                flex: 1,
                backgroundColor: Colors.surface,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: '#E2E8F0',
                padding: 12,
                fontFamily: F.regular,
                fontSize: 14,
                color: Colors.textPrimary,
              }}
            />
          ))}
        </View>

        {/* Photos */}
        <Text style={{ fontFamily: F.semiBold, fontSize: 13, color: Colors.textPrimary, marginBottom: 8 }}>
          Fotos del trabajo (máx. 5)
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 14 }}>
          {photoUris.map((uri, i) => (
            <View key={i} style={{ position: 'relative' }}>
              <Image source={{ uri }} style={{ width: 80, height: 80, borderRadius: 10 }} />
              <TouchableOpacity
                onPress={() => setPhotoUris((prev) => prev.filter((_, j) => j !== i))}
                style={{
                  position: 'absolute', top: -6, right: -6,
                  backgroundColor: Colors.danger, borderRadius: 999, padding: 2,
                }}
              >
                <Ionicons name="close" size={12} color="white" />
              </TouchableOpacity>
            </View>
          ))}
          {photoUris.length < 5 && (
            <TouchableOpacity
              onPress={pickPhotos}
              style={{
                width: 80, height: 80, borderRadius: 10,
                borderWidth: 1.5, borderColor: '#E2E8F0',
                borderStyle: 'dashed',
                alignItems: 'center', justifyContent: 'center',
                backgroundColor: Colors.surface,
              }}
            >
              <Ionicons name="camera-outline" size={22} color={Colors.textSecondary} />
              <Text style={{ fontFamily: F.regular, fontSize: 10, color: Colors.textSecondary, marginTop: 3 }}>
                Agregar
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          onPress={handleSubmit}
          disabled={uploading || createJobRequest.isPending}
          style={{
            backgroundColor: uploading || createJobRequest.isPending ? Colors.textSecondary : Colors.secondary,
            borderRadius: 12,
            paddingVertical: 16,
            alignItems: 'center',
            marginTop: 8,
          }}
        >
          {uploading || createJobRequest.isPending
            ? <ActivityIndicator color="white" />
            : <Text style={{ fontFamily: F.semiBold, fontSize: 15, color: 'white' }}>Publicar solicitud</Text>
          }
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
