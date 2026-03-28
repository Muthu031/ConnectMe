import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import { Post } from '../types';
import { likePost, unlikePost } from '../redux/slices/feedSlice';
import { RootState } from '../redux/store';
import { colors, spacing, typography } from '../theme';

const { width } = Dimensions.get('window');

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const [liked, setLiked] = useState(post.likes.includes(user?._id || ''));

  const handleLike = () => {
    if (liked) {
      dispatch(unlikePost(post._id) as any);
    } else {
      dispatch(likePost(post._id) as any);
    }
    setLiked(!liked);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            {post.user.profilePicture ? (
              <Image source={{ uri: post.user.profilePicture }} style={styles.avatarImage} />
            ) : (
              <Icon name="person" size={20} color={colors.white} />
            )}
          </View>
          <View>
            <View style={styles.usernameRow}>
              <Text style={styles.username}>{post.user.username}</Text>
              {post.user.isVerified && (
                <Icon name="checkmark-circle" size={14} color={colors.info} style={styles.verifiedIcon} />
              )}
            </View>
            {post.location && (
              <Text style={styles.location}>{post.location.name}</Text>
            )}
          </View>
        </View>
        <TouchableOpacity>
          <Icon name="ellipsis-vertical" size={20} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Media */}
      {post.media && post.media.length > 0 && (
        <View style={styles.mediaContainer}>
          <Image
            source={{ uri: post.media[0].url }}
            style={styles.media}
            resizeMode="cover"
          />
        </View>
      )}

      {/* Actions */}
      <View style={styles.actions}>
        <View style={styles.leftActions}>
          <TouchableOpacity onPress={handleLike} style={styles.actionButton}>
            <Icon
              name={liked ? 'heart' : 'heart-outline'}
              size={28}
              color={liked ? colors.error : colors.textPrimary}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="chatbubble-outline" size={26} color={colors.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="paper-plane-outline" size={26} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity>
          <Icon name="bookmark-outline" size={26} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Likes */}
      <View style={styles.info}>
        <Text style={styles.likes}>{post.likesCount} likes</Text>
      </View>

      {/* Caption */}
      {post.caption && (
        <View style={styles.caption}>
          <Text>
            <Text style={styles.username}>{post.user.username} </Text>
            <Text style={styles.captionText}>{post.caption}</Text>
          </Text>
        </View>
      )}

      {/* Comments */}
      {post.commentsCount > 0 && (
        <TouchableOpacity style={styles.commentsLink}>
          <Text style={styles.commentsLinkText}>
            View all {post.commentsCount} comments
          </Text>
        </TouchableOpacity>
      )}

      {/* Time */}
      <Text style={styles.time}>2 hours ago</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    marginBottom: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  avatarImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  usernameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  username: {
    fontSize: typography.fontSize.base,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  verifiedIcon: {
    marginLeft: 4,
  },
  location: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  mediaContainer: {
    width: width,
    height: width,
    backgroundColor: colors.gray8,
  },
  media: {
    width: '100%',
    height: '100%',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  leftActions: {
    flexDirection: 'row',
  },
  actionButton: {
    marginRight: spacing.lg,
  },
  info: {
    paddingHorizontal: spacing.lg,
  },
  likes: {
    fontSize: typography.fontSize.base,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  caption: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  captionText: {
    fontSize: typography.fontSize.base,
    color: colors.textPrimary,
  },
  commentsLink: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  commentsLinkText: {
    fontSize: typography.fontSize.base,
    color: colors.textSecondary,
  },
  time: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xs,
    paddingBottom: spacing.md,
    fontSize: typography.fontSize.sm,
    color: colors.textTertiary,
  },
});

export default PostCard;
