import {
  View, Text, ScrollView, TextInput,
  TouchableOpacity, ActivityIndicator, StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/hooks/useAuth';
import { useCategories } from '@/hooks/useCategories';
import { useMyProviderProfile } from '@/hooks/useProviderProfile';
import { supabase } from '@/lib/supabase';
import { uploadToStorage } from '@/lib/uploadImage';
import { LogoPicker } from '@/components/provider/LogoPicker';
import { PortfolioPicker } from '@/components/provider/PortfolioPicker';
import { SchedulePicker } from '@/components/provider/SchedulePicker';
import type { WeekSchedule } from '@/components/provider/SchedulePicker';

const isRemote = (uri: string) => uri.startsWith('http://') || uri.startsWith('https://');

export default function BecomeProviderModal() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { updateRole, profile } = useAuth();
  const { data: categories = [] } = useCategories();
  const { data: existing, isLoading: profileLoading } = useMyProviderProfile();

  const isEditing = !!existing;

  const [businessName, setBusinessName] = useState('');
  const [logoUri, setLogoUri] = useState<string | null>(null);
  const [bio, setBio] = useState('');
  const [yearsExp, setYearsExp] = useState('');
  const [coverageArea, setCoverageArea] = useState('Playa del Carmen');
  const [weekSchedule, setWeekSchedule] = useState<WeekSchedule>({});
  const [website, setWebsite] = useState('');
  const [selectedCatIds, setSelectedCatIds] = useState<string[]>([]);
  const [catPrices, setCatPrices] = useState<Record<string, string>>({});
  const [portfolioUris, setPortfolioUris] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!existing) return;
    setBusinessName(existing.business_name ?? '');
    setLogoUri(existing.logo_url ?? null);
    setBio(existing.bio ?? '');
    setYearsExp(existing.years_experience > 0 ? String(existing.years_experience) : '');
    setCoverageArea(existing.coverage_area ?? 'Playa del Carmen');
    if (existing.schedule) {
      try { setWeekSchedule(JSON.parse(existing.schedule)); } catch {}
    }
    setWebsite(existing.website ?? '');
    setSelectedCatIds(existing.provider_services.map((s) => s.service_categories.id));
    setCatPrices(
      Object.fromEntries(
        existing.provider_services
          .filter((s) => s.price_from !== null)
          .map((s) => [s.service_categories.id, String(s.price_from)])
      )
    );
    setPortfolioUris(existing.portfolio_urls ?? []);
  }, [existing?.id]);

  const toggleCategory = (id: string) =>
    setSelectedCatIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const handleSubmit = async () => {
    if (selectedCatIds.length === 0) {
      setError('Seleccioná al menos un servicio que ofrecés.');
      return;
    }
    setLoading(true);
    setError(null);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setError('Sesión expirada. Iniciá sesión nuevamente.');
      setLoading(false);
      return;
    }

    let logo_url: string | null = logoUri && isRemote(logoUri) ? logoUri : null;
    if (logoUri && !isRemote(logoUri)) {
      try {
        logo_url = await uploadToStorage(logoUri, `${user.id}/logo.jpg`);
      } catch {
        setError('Error al subir el logo. Intentá de nuevo.');
        setLoading(false);
        return;
      }
    }

    const existingUrls = portfolioUris.filter(isRemote);
    const localUris = portfolioUris.filter((u) => !isRemote(u));
    let portfolio_urls: string[] = existingUrls;
    if (localUris.length > 0) {
      try {
        const newUrls = await Promise.all(
          localUris.map((uri, i) =>
            uploadToStorage(uri, `${user.id}/portfolio/${Date.now()}-${i}.jpg`)
          )
        );
        portfolio_urls = [...existingUrls, ...newUrls];
      } catch {
        setError('Error al subir las fotos. Intentá de nuevo.');
        setLoading(false);
        return;
      }
    }

    const { data: pp, error: ppErr } = await supabase
      .from('provider_profiles')
      .upsert(
        {
          user_id: user.id,
          business_name: businessName.trim() || null,
          logo_url,
          bio: bio.trim() || null,
          years_experience: parseInt(yearsExp, 10) || 0,
          coverage_area: coverageArea.trim() || 'Playa del Carmen',
          schedule: Object.keys(weekSchedule).length > 0 ? JSON.stringify(weekSchedule) : null,
          website: website.trim() || null,
          portfolio_urls: portfolio_urls.length > 0 ? portfolio_urls : null,
        },
        { onConflict: 'user_id' }
      )
      .select('id')
      .single();

    if (ppErr || !pp) {
      setError('Error al guardar el perfil. Intentá de nuevo.');
      setLoading(false);
      return;
    }

    await supabase.from('provider_services').upsert(
      selectedCatIds.map((catId) => ({
        provider_id: pp.id,
        category_id: catId,
        price_from: catPrices[catId] ? parseFloat(catPrices[catId]) : null,
        price_unit: 'a convenir',
      })),
      { onConflict: 'provider_id,category_id' }
    );

    if (!isEditing) {
      const newRoles = profile && profile.role.length > 0
        ? ['client', 'provider']
        : ['provider'];
      const { error: roleErr } = await updateRole(user.id, newRoles);
      if (roleErr) {
        setError('Error al actualizar el rol. Intentá de nuevo.');
        setLoading(false);
        return;
      }
    }

    queryClient.invalidateQueries({ queryKey: ['my-provider-profile'] });
    router.back();
  };

  if (profileLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={Colors.primary} size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>
          {isEditing ? 'Editar perfil de prestador' : 'Registrarme como prestador'}
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        <Text style={s.intro}>Esta información será visible para los clientes que busquen servicios.</Text>

        <LogoPicker uri={logoUri} onChange={setLogoUri} />

        <Text style={s.label}>Nombre de empresa <Text style={s.optional}>(opcional)</Text></Text>
        <TextInput value={businessName} onChangeText={setBusinessName}
          placeholder="Ej: Servicios El Caribe" placeholderTextColor={Colors.textSecondary}
          style={[s.input, { marginBottom: 16 }]} />

        <Text style={s.label}>Descripción profesional</Text>
        <TextInput value={bio} onChangeText={setBio}
          placeholder="Contá tu experiencia, especialidades, forma de trabajo..."
          placeholderTextColor={Colors.textSecondary} multiline numberOfLines={4}
          style={[s.input, { textAlignVertical: 'top', minHeight: 96, marginBottom: 16 }]} />

        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 16 }}>
          <View style={{ flex: 1 }}>
            <Text style={s.label}>Años de experiencia</Text>
            <TextInput value={yearsExp} onChangeText={setYearsExp} placeholder="0"
              placeholderTextColor={Colors.textSecondary} keyboardType="number-pad" style={s.input} />
          </View>
          <View style={{ flex: 2 }}>
            <Text style={s.label}>Zona de cobertura</Text>
            <TextInput value={coverageArea} onChangeText={setCoverageArea}
              placeholder="Playa del Carmen" placeholderTextColor={Colors.textSecondary} style={s.input} />
          </View>
        </View>

        <SchedulePicker value={weekSchedule} onChange={setWeekSchedule} />

        <Text style={s.label}>Sitio web o Instagram <Text style={s.optional}>(opcional)</Text></Text>
        <TextInput value={website} onChangeText={setWebsite}
          placeholder="Ej: instagram.com/tu_usuario" placeholderTextColor={Colors.textSecondary}
          keyboardType="url" autoCapitalize="none" style={[s.input, { marginBottom: 16 }]} />

        <Text style={[s.label, { marginBottom: 10 }]}>
          ¿Qué servicios ofrecés? <Text style={{ color: Colors.danger }}>*</Text>
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
          {categories.map((cat) => {
            const isSelected = selectedCatIds.includes(cat.id);
            return (
              <TouchableOpacity key={cat.id} onPress={() => toggleCategory(cat.id)}
                style={[s.pill, isSelected && s.pillActive]}>
                <Text style={{ fontSize: 13 }}>{cat.icon}</Text>
                <Text style={[s.pillText, isSelected && s.pillTextActive]}>{cat.name}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {selectedCatIds.length > 0 && (
          <>
            <Text style={[s.label, { marginBottom: 10 }]}>
              Precio referencial <Text style={s.optional}>(opcional)</Text>
            </Text>
            {selectedCatIds.map((catId) => {
              const cat = categories.find((c) => c.id === catId);
              if (!cat) return null;
              return (
                <View key={catId} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <Text style={{ fontSize: 18, width: 28 }}>{cat.icon}</Text>
                  <Text style={{ fontFamily: 'Poppins_500Medium', fontSize: 13, color: Colors.textPrimary, flex: 1 }}>
                    {cat.name}
                  </Text>
                  <TextInput
                    value={catPrices[catId] ?? ''}
                    onChangeText={(v) => setCatPrices((prev) => ({ ...prev, [catId]: v }))}
                    placeholder="Desde $" placeholderTextColor={Colors.textSecondary}
                    keyboardType="decimal-pad" style={s.priceInput} />
                </View>
              );
            })}
          </>
        )}

        <PortfolioPicker images={portfolioUris} onChange={setPortfolioUris} />

        {error && <Text style={s.errorText}>{error}</Text>}

        <TouchableOpacity onPress={handleSubmit} disabled={loading}
          style={[s.submitBtn, loading && s.submitBtnDisabled]}>
          {loading
            ? <ActivityIndicator color="white" />
            : <Text style={s.submitText}>
                {isEditing ? 'Guardar cambios' : 'Registrarme como prestador'}
              </Text>
          }
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 16, paddingVertical: 14,
    backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E2E8F0',
  },
  headerTitle: { fontFamily: 'Poppins_700Bold', fontSize: 17, color: Colors.textPrimary, flex: 1 },
  intro: { fontFamily: 'Poppins_400Regular', fontSize: 13, color: Colors.textSecondary, marginBottom: 20 },
  label: { fontFamily: 'Poppins_600SemiBold', fontSize: 13, color: Colors.textPrimary, marginBottom: 6 },
  optional: { fontFamily: 'Poppins_400Regular', color: Colors.textSecondary },
  input: {
    backgroundColor: '#FFFFFF', borderRadius: 10, borderWidth: 1, borderColor: '#E2E8F0',
    padding: 12, fontFamily: 'Poppins_400Regular', fontSize: 14, color: Colors.textPrimary,
  },
  pill: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 12, paddingVertical: 7, borderRadius: 999,
    backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0',
  },
  pillActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  pillText: { fontFamily: 'Poppins_500Medium', fontSize: 12, color: Colors.textSecondary },
  pillTextActive: { color: 'white' },
  priceInput: {
    backgroundColor: '#FFFFFF', borderRadius: 8, borderWidth: 1, borderColor: '#E2E8F0',
    paddingHorizontal: 10, paddingVertical: 7, fontFamily: 'Poppins_400Regular', fontSize: 13,
    color: Colors.textPrimary, width: 100, textAlign: 'right',
  },
  errorText: { fontFamily: 'Poppins_400Regular', fontSize: 12, color: Colors.danger, marginBottom: 8 },
  submitBtn: { backgroundColor: Colors.secondary, borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginTop: 8 },
  submitBtnDisabled: { backgroundColor: Colors.textSecondary },
  submitText: { fontFamily: 'Poppins_600SemiBold', fontSize: 15, color: 'white' },
});
