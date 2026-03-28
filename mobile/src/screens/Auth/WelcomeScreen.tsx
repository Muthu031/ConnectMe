import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { colors, spacing, typography } from '../../theme';

const { width, height } = Dimensions.get('window');

const WelcomeScreen = ({ navigation }: any) => {
  return (
    <LinearGradient
      colors={[colors.primary, colors.primaryDark, colors.secondary]}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>ConnectMe</Text>
          <Text style={styles.tagline}>Connect with loved ones 💑</Text>
        </View>

        <View style={styles.bottomContainer}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.primaryButtonText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={styles.secondaryButtonText}>Create Account</Text>
          </TouchableOpacity>

          <Text style={styles.footer}>
            By continuing, you agree to our Terms & Privacy Policy
          </Text>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: height * 0.15,
    paddingBottom: spacing.huge,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    fontSize: 48,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: spacing.md,
  },
  tagline: {
    fontSize: typography.fontSize.lg,
    color: colors.white,
    opacity: 0.9,
  },
  bottomContainer: {
    paddingHorizontal: spacing.xl,
  },
  primaryButton: {
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  primaryButtonText: {
    color: colors.primary,
    fontSize: typography.fontSize.lg,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.white,
    borderRadius: 12,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  secondaryButtonText: {
    color: colors.white,
    fontSize: typography.fontSize.lg,
    fontWeight: '600',
  },
  footer: {
    color: colors.white,
    fontSize: typography.fontSize.sm,
    textAlign: 'center',
    opacity: 0.8,
  },
});

export default WelcomeScreen;
