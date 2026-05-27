import { View, Text, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

export type DaySchedule = { start: string; end: string };
export type WeekSchedule = Partial<Record<string, DaySchedule>>;

const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

type Props = {
  value: WeekSchedule;
  onChange: (v: WeekSchedule) => void;
};

export function SchedulePicker({ value, onChange }: Props) {
  const toggle = (day: string) => {
    const next = { ...value };
    if (next[day]) {
      delete next[day];
    } else {
      next[day] = { start: '08:00', end: '18:00' };
    }
    onChange(next);
  };

  const setTime = (day: string, field: 'start' | 'end', v: string) => {
    if (!value[day]) return;
    onChange({ ...value, [day]: { ...value[day]!, [field]: v } });
  };

  return (
    <View style={s.container}>
      <Text style={s.label}>
        Horario de atención{' '}
        <Text style={s.optional}>(opcional)</Text>
      </Text>
      {DAYS.map((day) => {
        const active = !!value[day];
        return (
          <View key={day} style={s.row}>
            <TouchableOpacity onPress={() => toggle(day)} style={s.dayLeft}>
              <View style={[s.checkbox, active && s.checkboxActive]}>
                {active && <Ionicons name="checkmark" size={12} color="white" />}
              </View>
              <Text style={[s.dayName, active && s.dayNameActive]}>{day}</Text>
            </TouchableOpacity>
            {active ? (
              <View style={s.timeRow}>
                <TextInput
                  value={value[day]!.start}
                  onChangeText={(v) => setTime(day, 'start', v)}
                  style={s.timeInput}
                  keyboardType="numbers-and-punctuation"
                  maxLength={5}
                  placeholder="08:00"
                  placeholderTextColor={Colors.textSecondary}
                />
                <Text style={s.dash}>–</Text>
                <TextInput
                  value={value[day]!.end}
                  onChangeText={(v) => setTime(day, 'end', v)}
                  style={s.timeInput}
                  keyboardType="numbers-and-punctuation"
                  maxLength={5}
                  placeholder="18:00"
                  placeholderTextColor={Colors.textSecondary}
                />
              </View>
            ) : (
              <Text style={s.closed}>Cerrado</Text>
            )}
          </View>
        );
      })}
    </View>
  );
}

const s = StyleSheet.create({
  container: { marginBottom: 16 },
  label: { fontFamily: 'Poppins_600SemiBold', fontSize: 13, color: Colors.textPrimary, marginBottom: 10 },
  optional: { fontFamily: 'Poppins_400Regular', color: Colors.textSecondary },
  row: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 9, borderBottomWidth: 1, borderBottomColor: '#F1F5F9',
  },
  dayLeft: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  checkbox: {
    width: 20, height: 20, borderRadius: 4, borderWidth: 1.5,
    borderColor: '#CBD5E1', alignItems: 'center', justifyContent: 'center',
  },
  checkboxActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  dayName: { fontFamily: 'Poppins_400Regular', fontSize: 13, color: Colors.textSecondary },
  dayNameActive: { fontFamily: 'Poppins_500Medium', color: Colors.textPrimary },
  timeRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  timeInput: {
    backgroundColor: Colors.surface, borderRadius: 8, borderWidth: 1, borderColor: '#E2E8F0',
    paddingHorizontal: 8, paddingVertical: 5, fontFamily: 'Poppins_400Regular', fontSize: 13,
    color: Colors.textPrimary, width: 58, textAlign: 'center',
  },
  dash: { fontFamily: 'Poppins_400Regular', fontSize: 13, color: Colors.textSecondary },
  closed: { fontFamily: 'Poppins_400Regular', fontSize: 12, color: Colors.textSecondary },
});
