import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/hooks/useAuth';
import { useCategories } from '@/hooks/useCategories';
import { supabase } from '@/lib/supabase';
import { registerForPushNotificationsAsync, savePushToken } from '@/lib/notifications';

const F = {
  regular: 'Poppins_400Regular' as const,
  medium: 'Poppins_500Medium' as const,
  semiBold: 'Poppins_600SemiBold' as const,
  bold: 'Poppins_700Bold' as const,
};

type RoleOption = 'client' | 'provider' | 'both';

const ROLE_OPTIONS: { id: RoleOption; icon: string; title: string; description: string }[] = [
  { id: 'client', icon: '🔍', title: 'Busco servicios', description: 'Necesito ayuda con trabajos del hogar o reparaciones' },
  { id: 'provider', icon: '🔨', title: 'Ofrezco servicios', description: 'Tengo un oficio o habilidad técnica y quiero conseguir clientes' },
  { id: 'both', icon: '✨', title: 'Ambos', description: 'A veces busco servicios y a veces los ofrezco' },
];

export default function OnboardingScreen() {
  const { updateRole } = useAuth();
  const { data: categories = [] } = useCategories();

  const [step, setStep] = useState<1 | 2>(1);
  const [selectedRole, setSelectedRole] = useState<RoleOption | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Step 2 — provider profile fields
  const [bio, setBio] = useState('');
  const [yearsExp, setYearsExp] = useState('');
  const [coverageArea, setCoverageArea] = useState('Playa del Carmen');
  const [selectedCatIds, setSelectedCatIds] = useState<string[]>([]);
  const [catPrices, setCatPrices] = useState<Record<string, string>>({});

  const toggleCategory = (id: string) => {
    setSelectedCatIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const finalize = async (roles: string[]) => {
    setLoading(true);
    setError(null);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setError('Sesión expirada. Iniciá sesión nuevamente.');
      setLoading(false);
      return;
    }

    if (roles.includes('provider')) {
      const { data: pp, error: ppErr } = await supabase
        .from('provider_profiles')
        .upsert(
          {
            user_id: user.id,
            bio: bio.trim() || null,
            years_experience: parseInt(yearsExp, 10) || 0,
            coverage_area: coverageArea.trim() || 'Playa del Carmen',
          },
          { onConflict: 'user_id' }
        )
        .select('id')
        .single();

      if (ppErr) {
        setError('Error al guardar el perfil de prestador.');
        setLoading(false);
        return;
      }

      if (pp && selectedCatIds.length > 0) {
        await supabase.from('provider_services').upsert(
          selectedCatIds.map((catId) => ({
            provider_id: pp.id,
            category_id: catId,
            price_from: catPrices[catId] ? parseFloat(catPrices[catId]) : null,
            price_unit: 'a convenir',
          })),
          { onConflict: 'provider_id,category_id' }
        );
      }
    }

    const { error: roleErr } = await updateRole(user.id, roles);
    if (roleErr) {
      setError('Error al guardar el rol. Intentá de nuevo.');
    } else {
      try {
        const token = await registerForPushNotificationsAsync();
        if (token) await savePushToken(token);
      } catch { /* non-critical */ }
    }
    setLoading(false);
  };

  const handleStep1Continue = () => {
    if (!selectedRole) return;
    if (selectedRole === 'client') finalize(['client']);
    else setStep(2);
  };

  const handleStep2Finalize = () => {
    if (!selectedRole) return;
    const roles = selectedRole === 'both' ? ['client', 'provider'] : ['provider'];
    finalize(roles);
  };

  // ── Step 2: Provider profile ───────────────────────────────────────────────
  if (step === 2) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
        <ScrollView contentContainerStyle={{ padding: 24, paddingTop: 32 }}>
          <TouchableOpacity onPress={() => setStep(1)} style={{ marginBottom: 16 }}>
            <Text style={{ fontFamily: F.medium, fontSize: 14, color: Colors.primary }}>
              ← Volver
            </Text>
          </TouchableOpacity>

          <Text style={{ fontFamily: F.bold, fontSize: 22, color: Colors.textPrimary }}>
            Tu perfil de prestador
          </Text>
          <Text style={{ fontFamily: F.regular, fontSize: 14, color: Colors.textSecondary, marginTop: 4, marginBottom: 24 }}>
            Esta información será visible para los clientes
          </Text>

          {/* Bio */}
          <Text style={{ fontFamily: F.semiBold, fontSize: 13, color: Colors.textPrimary, marginBottom: 6 }}>
            Descripción profesional
          </Text>
          <TextInput
            value={bio}
            onChangeText={setBio}
            placeholder="Contá tu experiencia, especialidades, forma de trabajo..."
            placeholderTextColor={Colors.textSecondary}
            multiline
            numberOfLines={4}
            style={{
              backgroundColor: Colors.surface,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: '#E2E8F0',
              padding: 12,
              fontFamily: F.regular,
              fontSize: 14,
              color: Colors.textPrimary,
              textAlignVertical: 'top',
              minHeight: 96,
              marginBottom: 16,
            }}
          />

          {/* Years + Coverage row */}
          <View style={{ flexDirection: 'row', gap: 12, marginBottom: 16 }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: F.semiBold, fontSize: 13, color: Colors.textPrimary, marginBottom: 6 }}>
                Años de experiencia
              </Text>
              <TextInput
                value={yearsExp}
                onChangeText={setYearsExp}
                placeholder="0"
                placeholderTextColor={Colors.textSecondary}
                keyboardType="number-pad"
                style={{
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
            </View>
            <View style={{ flex: 2 }}>
              <Text style={{ fontFamily: F.semiBold, fontSize: 13, color: Colors.textPrimary, marginBottom: 6 }}>
                Zona de cobertura
              </Text>
              <TextInput
                value={coverageArea}
                onChangeText={setCoverageArea}
                placeholder="Playa del Carmen"
                placeholderTextColor={Colors.textSecondary}
                style={{
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
            </View>
          </View>

          {/* Category selection */}
          <Text style={{ fontFamily: F.semiBold, fontSize: 13, color: Colors.textPrimary, marginBottom: 10 }}>
            ¿Qué servicios ofrecés?
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
            {categories.map((cat) => {
              const isSelected = selectedCatIds.includes(cat.id);
              return (
                <TouchableOpacity
                  key={cat.id}
                  onPress={() => toggleCategory(cat.id)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 5,
                    paddingHorizontal: 12,
                    paddingVertical: 7,
                    borderRadius: 999,
                    backgroundColor: isSelected ? Colors.primary : Colors.surface,
                    borderWidth: 1,
                    borderColor: isSelected ? Colors.primary : '#E2E8F0',
                  }}
                >
                  <Text style={{ fontSize: 13 }}>{cat.icon}</Text>
                  <Text style={{
                    fontFamily: F.medium,
                    fontSize: 12,
                    color: isSelected ? 'white' : Colors.textSecondary,
                  }}>
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Price inputs for selected categories */}
          {selectedCatIds.length > 0 && (
            <>
              <Text style={{ fontFamily: F.semiBold, fontSize: 13, color: Colors.textPrimary, marginBottom: 10 }}>
                Precio referencial (opcional)
              </Text>
              {selectedCatIds.map((catId) => {
                const cat = categories.find((c) => c.id === catId);
                if (!cat) return null;
                return (
                  <View key={catId} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                    <Text style={{ fontSize: 18, width: 28 }}>{cat.icon}</Text>
                    <Text style={{ fontFamily: F.medium, fontSize: 13, color: Colors.textPrimary, flex: 1 }}>
                      {cat.name}
                    </Text>
                    <TextInput
                      value={catPrices[catId] ?? ''}
                      onChangeText={(v) => setCatPrices((prev) => ({ ...prev, [catId]: v }))}
                      placeholder="Desde $"
                      placeholderTextColor={Colors.textSecondary}
                      keyboardType="decimal-pad"
                      style={{
                        backgroundColor: Colors.surface,
                        borderRadius: 8,
                        borderWidth: 1,
                        borderColor: '#E2E8F0',
                        paddingHorizontal: 10,
                        paddingVertical: 7,
                        fontFamily: F.regular,
                        fontSize: 13,
                        color: Colors.textPrimary,
                        width: 100,
                        textAlign: 'right',
                      }}
                    />
                  </View>
                );
              })}
            </>
          )}

          {error && (
            <Text style={{ fontFamily: F.regular, fontSize: 12, color: Colors.danger, marginTop: 4 }}>
              {error}
            </Text>
          )}

          <TouchableOpacity
            onPress={handleStep2Finalize}
            disabled={loading}
            style={{
              backgroundColor: loading ? Colors.textSecondary : Colors.primary,
              borderRadius: 12,
              paddingVertical: 16,
              alignItems: 'center',
              marginTop: 24,
              marginBottom: 32,
            }}
          >
            {loading
              ? <ActivityIndicator color="white" />
              : <Text style={{ fontFamily: F.semiBold, fontSize: 15, color: 'white' }}>Finalizar</Text>
            }
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ── Step 1: Role selection ─────────────────────────────────────────────────
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
      <ScrollView contentContainerStyle={{ padding: 24, paddingTop: 40 }}>
        <Text style={{ fontFamily: F.bold, fontSize: 26, color: Colors.textPrimary }}>
          ¡Bienvenido!
        </Text>
        <Text style={{ fontFamily: F.regular, fontSize: 15, color: Colors.textSecondary, marginTop: 6, marginBottom: 32 }}>
          ¿Cómo vas a usar OficiosPlaya?
        </Text>

        {ROLE_OPTIONS.map((option) => {
          const isSelected = selectedRole === option.id;
          return (
            <TouchableOpacity
              key={option.id}
              onPress={() => setSelectedRole(option.id)}
              style={{
                backgroundColor: Colors.surface,
                borderRadius: 16,
                padding: 20,
                marginBottom: 12,
                flexDirection: 'row',
                alignItems: 'center',
                borderWidth: 2,
                borderColor: isSelected ? Colors.primary : '#E2E8F0',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 2,
                elevation: 2,
              }}
            >
              <Text style={{ fontSize: 36, marginRight: 16 }}>{option.icon}</Text>
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: F.semiBold, fontSize: 16, color: isSelected ? Colors.primary : Colors.textPrimary }}>
                  {option.title}
                </Text>
                <Text style={{ fontFamily: F.regular, fontSize: 13, color: Colors.textSecondary, marginTop: 2 }}>
                  {option.description}
                </Text>
              </View>
              <View style={{
                width: 22, height: 22, borderRadius: 11,
                borderWidth: 2,
                borderColor: isSelected ? Colors.primary : '#E2E8F0',
                backgroundColor: isSelected ? Colors.primary : 'transparent',
                alignItems: 'center', justifyContent: 'center',
              }}>
                {isSelected && <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: 'white' }} />}
              </View>
            </TouchableOpacity>
          );
        })}

        {error && (
          <Text style={{ fontFamily: F.regular, fontSize: 12, color: Colors.danger, marginTop: 8 }}>
            {error}
          </Text>
        )}

        <TouchableOpacity
          onPress={handleStep1Continue}
          disabled={!selectedRole || loading}
          style={{
            backgroundColor: !selectedRole || loading ? Colors.textSecondary : Colors.primary,
            borderRadius: 12,
            paddingVertical: 16,
            alignItems: 'center',
            marginTop: 24,
          }}
        >
          {loading
            ? <ActivityIndicator color="white" />
            : <Text style={{ fontFamily: F.semiBold, fontSize: 15, color: 'white' }}>
                {selectedRole === 'client' ? 'Continuar' : 'Siguiente →'}
              </Text>
          }
        </TouchableOpacity>

        <Text style={{ fontFamily: F.regular, fontSize: 12, color: Colors.textSecondary, textAlign: 'center', marginTop: 16 }}>
          Podés cambiar esto más adelante en tu perfil
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
