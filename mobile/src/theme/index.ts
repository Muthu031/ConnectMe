// Color palette
export const colors = {
  // Primary colors
  primary: '#FF3366',
  primaryDark: '#E62958',
  primaryLight: '#FF6B8F',
  
  // Secondary colors
  secondary: '#6B4EFF',
  secondaryDark: '#5738E6',
  secondaryLight: '#8F75FF',
  
  // Couple theme
  couple: '#FF1493',
  coupleLight: '#FFB6D9',
  
  // Neutral colors
  black: '#000000',
  white: '#FFFFFF',
  gray1: '#1A1A1A',
  gray2: '#333333',
  gray3: '#4D4D4D',
  gray4: '#666666',
  gray5: '#999999',
  gray6: '#CCCCCC',
  gray7: '#E6E6E6',
  gray8: '#F2F2F2',
  gray9: '#F9F9F9',
  
  // Status colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  
  // Background
  background: '#FFFFFF',
  backgroundSecondary: '#FAFAFA',
  
  // Border
  border: '#E5E5E5',
  borderLight: '#F0F0F0',
  
  // Text
  textPrimary: '#1A1A1A',
  textSecondary: '#666666',
  textTertiary: '#999999',
  textPlaceholder: '#CCCCCC',
  
  // Social media
  instagram: '#E4405F',
  facebook: '#1877F2',
  twitter: '#1DA1F2',
  
  // Overlay
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.3)',
};

// Typography
export const typography = {
  fontFamily: {
    regular: 'System',
    medium: 'System',
    semiBold: 'System',
    bold: 'System',
  },
  fontSize: {
    xs: 10,
    sm: 12,
    base: 14,
    lg: 16,
    xl: 18,
    xxl: 20,
    xxxl: 24,
    huge: 32,
  },
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semiBold: '600' as const,
    bold: '700' as const,
  },
};

// Spacing
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 48,
};

// Border radius
export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 24,
  full: 9999,
};

// Shadows
export const shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
};

// Screen dimensions
export const layout = {
  window: {
    width: 375, // Default width (will be updated at runtime)
    height: 812, // Default height (will be updated at runtime)
  },
  isSmallDevice: false, // Will be updated at runtime
};

export default {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  layout,
};
