import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { Link, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/hooks/useAuth';

const F = {
  regular: 'Poppins_400Regular' as const,
  medium: 'Poppins_500Medium' as const,
  semiBold: 'Poppins_600SemiBold' as const,
  bold: 'Poppins_700Bold' as const,
};

type Field = { label: string; placeholder: string; key: 'fullName' | 'email' | 'phone' | 'password'; keyboard?: 'email-address' | 'phone-pad'; secure?: boolean };

const FIELDS: Field[] = [
  { label: 'Nombre completo', placeholder: 'Juan García', key: 'fullName' },
  { label: 'Email', placeholder: 'tu@email.com', key: 'email', keyboard: 'email-address' },
  { label: 'Teléfono (WhatsApp)', placeholder: '+52 984 123 4567', key: 'phone', keyboard: 'phone-pad' },
  { label: 'Contraseña', placeholder: 'Mínimo 6 caracteres', key: 'password', secure: true },
];

export default function RegisterScreen() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const set = (key: keyof typeof form) => (val: string) => setForm(f => ({ ...f, [key]: val }));

  const handleSignUp = async () => {
    if (!form.fullName.trim() || !form.email.trim() || !form.password) {
      setError('Nombre, email y contraseña son obligatorios');
      return;
    }
    if (form.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    setLoading(true);
    setError(null);

    const { error } = await signUp(form.email, form.password, form.fullName.trim(), form.phone.trim() || undefined);

    if (error) {
      setError(
        error.message.includes('already registered')
          ? 'Este email ya tiene una cuenta. Iniciá sesión.'
          : error.message,
      );
      setLoading(false);
      return;
    }

    // If email confirmation is disabled, AuthGate handles redirect.
    // If enabled, show success message.
    setSuccess(true);
    setLoading(false);
  };

  if (success) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 }}>
          <Ionicons name="checkmark-circle" size={72} color={Colors.accent} />
          <Text style={{ fontFamily: F.bold, fontSize: 22, color: Colors.textPrimary, marginTop: 20, textAlign: 'center' }}>
            ¡Cuenta creada!
          </Text>
          <Text style={{ fontFamily: F.regular, fontSize: 14, color: Colors.textSecondary, marginTop: 8, textAlign: 'center' }}>
            Revisá tu email para confirmar tu cuenta.
          </Text>
          <TouchableOpacity
            onPress={() => router.replace('/(auth)/login')}
            style={{ marginTop: 32, backgroundColor: Colors.primary, borderRadius: 12, paddingHorizontal: 32, paddingVertical: 14 }}
          >
            <Text style={{ fontFamily: F.semiBold, fontSize: 15, color: 'white' }}>Ir a iniciar sesión</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={{ padding: 24 }} keyboardShouldPersistTaps="handled">
          {/* Back */}
          <TouchableOpacity onPress={() => router.back()} style={{ marginBottom: 24, alignSelf: 'flex-start' }}>
            <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>

          <Text style={{ fontFamily: F.bold, fontSize: 26, color: Colors.textPrimary }}>
            Crear cuenta
          </Text>
          <Text style={{ fontFamily: F.regular, fontSize: 14, color: Colors.textSecondary, marginTop: 4, marginBottom: 28 }}>
            Completá tus datos para empezar
          </Text>

          {FIELDS.map((field) => (
            <View key={field.key} style={{ marginBottom: 16 }}>
              <Text style={{ fontFamily: F.medium, fontSize: 14, color: Colors.textPrimary, marginBottom: 6 }}>
                {field.label}
              </Text>
              <View style={{
                flexDirection: 'row', alignItems: 'center',
                backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, borderRadius: 8,
              }}>
                <TextInput
                  value={form[field.key]}
                  onChangeText={set(field.key)}
                  placeholder={field.placeholder}
                  keyboardType={field.keyboard ?? 'default'}
                  autoCapitalize={field.key === 'email' ? 'none' : 'words'}
                  secureTextEntry={field.secure && !showPassword}
                  style={{
                    flex: 1, paddingHorizontal: 16, paddingVertical: 13,
                    fontFamily: F.regular, fontSize: 14, color: Colors.textPrimary,
                  }}
                  placeholderTextColor={Colors.textSecondary}
                />
                {field.secure && (
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={{ paddingHorizontal: 14 }}>
                    <Ionicons
                      name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                      size={20}
                      color={Colors.textSecondary}
                    />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}

          {error && (
            <Text style={{ fontFamily: F.regular, fontSize: 12, color: Colors.danger, marginBottom: 8 }}>
              {error}
            </Text>
          )}

          <TouchableOpacity
            onPress={handleSignUp}
            disabled={loading}
            style={{
              backgroundColor: loading ? Colors.textSecondary : Colors.primary,
              borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginTop: 8,
            }}
          >
            {loading
              ? <ActivityIndicator color="white" />
              : <Text style={{ fontFamily: F.semiBold, fontSize: 15, color: 'white' }}>Crear cuenta</Text>
            }
          </TouchableOpacity>

          <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 24 }}>
            <Text style={{ fontFamily: F.regular, fontSize: 14, color: Colors.textSecondary }}>
              ¿Ya tenés cuenta?{' '}
            </Text>
            <Link href="/(auth)/login" asChild>
              <TouchableOpacity>
                <Text style={{ fontFamily: F.semiBold, fontSize: 14, color: Colors.primary }}>Iniciar sesión</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
