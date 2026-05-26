import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import type { ReactNode, ComponentProps } from 'react';
import { Colors } from '@/constants/Colors';

type NativeInputProps = ComponentProps<typeof TextInput>;

type InputProps = {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string;
  hint?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  onRightIconPress?: () => void;
  secureTextEntry?: boolean;
  editable?: boolean;
  keyboardType?: NativeInputProps['keyboardType'];
  autoCapitalize?: NativeInputProps['autoCapitalize'];
  autoComplete?: NativeInputProps['autoComplete'];
  returnKeyType?: NativeInputProps['returnKeyType'];
  onSubmitEditing?: () => void;
  multiline?: boolean;
  numberOfLines?: number;
};

export function Input({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  hint,
  leftIcon,
  rightIcon,
  onRightIconPress,
  secureTextEntry,
  editable = true,
  keyboardType,
  autoCapitalize,
  autoComplete,
  returnKeyType,
  onSubmitEditing,
  multiline,
  numberOfLines,
}: InputProps) {
  const borderColor = error ? Colors.danger : Colors.border;

  return (
    <View>
      {label && (
        <Text style={{
          fontFamily: 'Poppins_500Medium',
          fontSize: 14,
          color: Colors.textPrimary,
          marginBottom: 6,
        }}>
          {label}
        </Text>
      )}

      <View style={{
        flexDirection: 'row',
        alignItems: multiline ? 'flex-start' : 'center',
        backgroundColor: editable ? Colors.surface : Colors.background,
        borderWidth: 1,
        borderColor,
        borderRadius: 8,
        minHeight: multiline ? 96 : undefined,
      }}>
        {leftIcon && (
          <View style={{ paddingLeft: 14, paddingRight: 4 }}>{leftIcon}</View>
        )}

        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={Colors.textSecondary}
          secureTextEntry={secureTextEntry}
          editable={editable}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoComplete={autoComplete}
          returnKeyType={returnKeyType}
          onSubmitEditing={onSubmitEditing}
          multiline={multiline}
          numberOfLines={numberOfLines}
          textAlignVertical={multiline ? 'top' : 'center'}
          style={{
            flex: 1,
            paddingHorizontal: leftIcon ? 8 : 16,
            paddingVertical: 13,
            fontFamily: 'Poppins_400Regular',
            fontSize: 14,
            color: Colors.textPrimary,
          }}
        />

        {rightIcon && (
          <TouchableOpacity
            onPress={onRightIconPress}
            disabled={!onRightIconPress}
            style={{ paddingHorizontal: 14 }}
          >
            {rightIcon}
          </TouchableOpacity>
        )}
      </View>

      {error && (
        <Text style={{
          fontFamily: 'Poppins_400Regular',
          fontSize: 12,
          color: Colors.danger,
          marginTop: 4,
        }}>
          {error}
        </Text>
      )}

      {hint && !error && (
        <Text style={{
          fontFamily: 'Poppins_400Regular',
          fontSize: 12,
          color: Colors.textSecondary,
          marginTop: 4,
        }}>
          {hint}
        </Text>
      )}
    </View>
  );
}
