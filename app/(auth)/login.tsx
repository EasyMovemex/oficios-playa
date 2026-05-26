import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '@/lib/supabase';
import { Colors } from '@/constants/Colors';

const F = {
  regular: 'Poppins_400Regular' as const,
  medium: 'Poppins_500Medium' as const,
  semiBold: 'Poppins_600SemiBold' as const,
  bold: 'Poppins_700Bold' as const,
};

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async () => {
    if (!email.trim() || !password) {
      setError('Completá todos los campos');
      return;
    }
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      setError(
        error.message === 'Invalid login credentials'
          ? 'Email o contraseña incorrectos'
          : 'Error al iniciar sesión. Intentá de nuevo.',
      );
    }
    // AuthGate handles redirect on success
    setLoading(false);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.primary }} edges={['top']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={{ alignItems: 'center', paddingHorizontal: 24, paddingTop: 48, paddingBottom: 40 }}>
          <View style={{
            width: 64, height: 64, borderRadius: 32,
            backgroundColor: 'rgba(255,255,255,0.2)',
            alignItems: 'center', justifyContent: 'center', marginBottom: 16,
          }}>
            <Ionicons name="construct-outline" size={32} color="white" />
          </View>
          <Text style={{ fontFamily: F.bold, fontSize: 28, color: 'white' }}>
            OficiosPlaya
          </Text>
          <Text style={{
            fontFamily: F.regular, fontSize: 14,
            color: 'rgba(255,255,255,0.8)', textAlign: 'center', marginTop: 4,
          }}>
            Servicios del hogar en Playa del Carmen
          </Text>
        </View>

        {/* Form card */}
        <ScrollView
          style={{ flex: 1, backgroundColor: Colors.background, borderTopLeftRadius: 28, borderTopRightRadius: 28 }}
          contentContainerStyle={{ padding: 24, paddingTop: 32 }}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={{ fontFamily: F.semiBold, fontSize: 20, color: Colors.textPrimary, marginBottom: 24 }}>
            Iniciar sesión
          </Text>

          {/* Email */}
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontFamily: F.medium, fontSize: 14, color: Colors.textPrimary, marginBottom: 6 }}>
              Email
            </Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="tu@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              style={{
                backgroundColor: Colors.surface,
                borderWidth: 1, borderColor: Colors.border, borderRadius: 8,
                paddingHorizontal: 16, paddingVertical: 13,
                fontFamily: F.regular, fontSize: 14, color: Colors.textPrimary,
              }}
              placeholderTextColor={Colors.textSecondary}
            />
          </View>

          {/* Password */}
          <View style={{ marginBottom: 8 }}>
            <Text style={{ fontFamily: F.medium, fontSize: 14, color: Colors.textPrimary, marginBottom: 6 }}>
              Contraseña
            </Text>
            <View style={{
              flexDirection: 'row', alignItems: 'center',
              backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, borderRadius: 8,
            }}>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Tu contraseña"
                secureTextEntry={!showPassword}
                style={{
                  flex: 1, paddingHorizontal: 16, paddingVertical: 13,
                  fontFamily: F.regular, fontSize: 14, color: Colors.textPrimary,
                }}
                placeholderTextColor={Colors.textSecondary}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={{ paddingHorizontal: 14 }}
              >
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={Colors.textSecondary}
                />
              </TouchableOpacity>
            </View>
          </View>

          {error && (
            <Text style={{ fontFamily: F.regular, fontSize: 12, color: Colors.danger, marginBottom: 8 }}>
              {error}
            </Text>
          )}

          {/* Sign in */}
          <TouchableOpacity
            onPress={handleSignIn}
            disabled={loading}
            style={{
              backgroundColor: loading ? Colors.textSecondary : Colors.primary,
              borderRadius: 12, paddingVertical: 16,
              alignItems: 'center', marginTop: 16,
            }}
          >
            {loading
              ? <ActivityIndicator color="white" />
              : <Text style={{ fontFamily: F.semiBold, fontSize: 15, color: 'white' }}>Iniciar sesión</Text>
            }
          </TouchableOpacity>

          {/* Divider */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 20 }}>
            <View style={{ flex: 1, height: 1, backgroundColor: Colors.border }} />
            <Text style={{ fontFamily: F.regular, fontSize: 12, color: Colors.textSecondary, marginHorizontal: 12 }}>o</Text>
            <View style={{ flex: 1, height: 1, backgroundColor: Colors.border }} />
          </View>

          {/* Google (placeholder) */}
          <TouchableOpacity
            onPress={() => Alert.alert('Próximamente', 'El acceso con Google estará disponible pronto.')}
            style={{
              backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border,
              borderRadius: 12, paddingVertical: 14,
              flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}
          >
            <Text style={{ fontFamily: F.bold, fontSize: 16, color: Colors.textPrimary }}>G</Text>
            <Text style={{ fontFamily: F.semiBold, fontSize: 15, color: Colors.textPrimary }}>
              Continuar con Google
            </Text>
          </TouchableOpacity>

          {/* Register link */}
          <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 28, marginBottom: 8 }}>
            <Text style={{ fontFamily: F.regular, fontSize: 14, color: Colors.textSecondary }}>
              ¿No tenés cuenta?{' '}
            </Text>
            <Link href="/(auth)/register" asChild>
              <TouchableOpacity>
                <Text style={{ fontFamily: F.semiBold, fontSize: 14, color: Colors.primary }}>
                  Registrate
                </Text>
              </TouchableOpacity>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
