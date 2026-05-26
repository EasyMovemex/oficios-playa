import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import type { ReactNode } from 'react';
import { Colors } from '@/constants/Colors';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

type ButtonProps = {
  onPress: () => void;
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  disabled?: boolean;
  leftIcon?: ReactNode;
  fullWidth?: boolean;
};

const BG: Record<Variant, string> = {
  primary: Colors.primary,
  secondary: Colors.secondary,
  ghost: 'transparent',
  danger: Colors.danger,
};

const TEXT_COLOR: Record<Variant, string> = {
  primary: '#FFFFFF',
  secondary: '#FFFFFF',
  ghost: Colors.primary,
  danger: '#FFFFFF',
};

const PY: Record<Size, number> = { sm: 8, md: 15, lg: 18 };
const PX: Record<Size, number> = { sm: 16, md: 20, lg: 24 };
const FS: Record<Size, number> = { sm: 13, md: 15, lg: 16 };

export function Button({
  onPress,
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  leftIcon,
  fullWidth = false,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: PY[size],
        paddingHorizontal: PX[size],
        borderRadius: 12,
        borderWidth: variant === 'ghost' ? 1.5 : 0,
        borderColor: variant === 'ghost' ? Colors.primary : undefined,
        backgroundColor: loading ? Colors.border : BG[variant],
        alignSelf: fullWidth ? 'stretch' : 'flex-start',
        opacity: disabled && !loading ? 0.5 : 1,
      }}
    >
      {loading ? (
        <ActivityIndicator color={TEXT_COLOR[variant]} size="small" />
      ) : (
        <>
          {leftIcon}
          <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: FS[size], color: TEXT_COLOR[variant] }}>
            {children}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}
