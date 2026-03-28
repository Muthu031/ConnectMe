import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../../theme';

const SearchScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Search Screen</Text>
      <Text style={styles.subtext}>Search functionality coming soon...</Text>
    </View>
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

export default SearchScreen;
