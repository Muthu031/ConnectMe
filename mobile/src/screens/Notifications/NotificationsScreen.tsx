import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, typography } from '../../theme';

const NotificationsScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>Notifications</Text>
      <Text style={styles.subtext}>Your notifications will appear here</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: typography.fontSize.xxl,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  subtext: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
  },
});

export default NotificationsScreen;
