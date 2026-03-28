import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../../theme';

const ReelsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Reels Screen</Text>
      <Text style={styles.subtext}>Vertical video feed coming soon...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: typography.fontSize.xxl,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: spacing.sm,
  },
  subtext: {
    fontSize: typography.fontSize.base,
    color: colors.gray6,
  },
});

export default ReelsScreen;
