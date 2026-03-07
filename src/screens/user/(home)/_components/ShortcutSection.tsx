import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Dimensions,
  ListRenderItemInfo,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import * as Config from '../../../../helpers/Config';
 
const { width } = Dimensions.get('window');
 
type ShortcutItem = {
  icon: string;
  title: string;
};
 
type ShortcutSectionProps = {
  shortcuts: ShortcutItem[];
};
 
const ShortcutSection: React.FC<ShortcutSectionProps> = ({ shortcuts }) => {
  const renderShortcut = ({ item, index }: ListRenderItemInfo<ShortcutItem>) => {
    const gradients: [string, string][] = [
      ['#4F46E5', '#7C3AED'],
      ['#059669', '#10B981'],
      ['#DC2626', '#EF4444'],
      ['#D97706', '#F59E0B'],
      ['#7C2D12', '#EA580C'],
      ['#1E40AF', '#3B82F6'],
    ];
 
    const gradient = gradients[index % gradients.length];
 
    return (
      <TouchableOpacity style={styles.cardContainer}>
        <LinearGradient
          colors={gradient}
          style={styles.card}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>{item.icon}</Text>
          </View>
          <Text style={styles.title}>{item.title}</Text>
          <View style={styles.shimmer} />
        </LinearGradient>
      </TouchableOpacity>
    );
  };
 
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>Quick Actions</Text>
        <Text style={styles.subheading}>Tap to access features</Text>
      </View>
      <FlatList
        data={shortcuts}
        numColumns={3}
        renderItem={renderShortcut}
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={styles.grid}
        scrollEnabled={false}
      />
    </View>
  );
};
 
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  header: {
    marginBottom: 10,
  },
  heading: {
    fontSize: 24,
    color: '#1F2937',
    fontFamily: Config.fontFamilys.Poppins_Bold,
    marginBottom: 2,
  },
  subheading: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: Config.fontFamilys.Poppins_Medium,
  },
  grid: {
    alignItems: 'center',
  },
  cardContainer: {
    width: (width - 60) / 3,
    marginHorizontal: 5,
    marginVertical: 8,
  },
  card: {
    height: 100,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  iconContainer: {
    marginBottom: 8,
  },
  icon: {
    fontSize: 12,
    textAlign: 'center',
  },
  title: {
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'center',
    fontFamily: Config.fontFamilys.Poppins_Medium,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  shimmer: {
    position: 'absolute',
    top: -50,
    left: -50,
    width: 100,
    height: 100,
    backgroundColor: 'rgba(255,255,255,0.1)',
    transform: [{ rotate: '45deg' }],
  },
});
 
export default ShortcutSection;