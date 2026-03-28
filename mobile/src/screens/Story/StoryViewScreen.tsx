import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme';

const StoryViewScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Story View</Text>
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
    color: colors.white,
    fontSize: 20,
  },
});

export default StoryViewScreen;
