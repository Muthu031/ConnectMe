import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors, spacing, typography } from '../theme';

const StoryList = () => {
  const stories = [
    { id: '1', username: 'your_story', hasStory: false, isOwn: true },
    { id: '2', username: 'john_doe', hasStory: true },
    { id: '3', username: 'jane_smith', hasStory: true },
    { id: '4', username: 'alex_wilson', hasStory: true },
    { id: '5', username: 'sarah_jones', hasStory: true },
  ];

  const renderStory = (story: any) => {
    if (story.isOwn) {
      return (
        <TouchableOpacity key={story.id} style={styles.storyItem}>
          <View style={styles.ownStoryContainer}>
            <View style={styles.avatar}>
              <Icon name="person" size={24} color={colors.white} />
            </View>
            <View style={styles.addButton}>
              <Icon name="add" size={16} color={colors.white} />
            </View>
          </View>
          <Text style={styles.username} numberOfLines={1}>
            Your Story
          </Text>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity key={story.id} style={styles.storyItem}>
        <LinearGradient
          colors={[colors.primary, colors.secondary]}
          style={styles.gradientRing}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Icon name="person" size={24} color={colors.white} />
            </View>
          </View>
        </LinearGradient>
        <Text style={styles.username} numberOfLines={1}>
          {story.username}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {stories.map(renderStory)}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.white,
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
  },
  storyItem: {
    alignItems: 'center',
    marginHorizontal: spacing.sm,
    width: 70,
  },
  gradientRing: {
    width: 68,
    height: 68,
    borderRadius: 34,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  avatarContainer: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ownStoryContainer: {
    width: 68,
    height: 68,
    position: 'relative',
    marginBottom: spacing.xs,
  },
  addButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  username: {
    fontSize: typography.fontSize.xs,
    color: colors.textPrimary,
    textAlign: 'center',
  },
});

export default StoryList;
