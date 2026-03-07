import React, { memo, useRef, useState } from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ListRenderItemInfo,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import * as Config from '../../../../helpers/Config';
 
const { width } = Dimensions.get('window');
 
type BannerItem = {
  filename?: string;
  title?: string;
};
 
type BannerCarouselProps = {
  banners?: BannerItem[];
};
 
const BannerCarousel: React.FC<BannerCarouselProps> = ({ banners = [] }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList<BannerItem> | null>(null);
 
  const onScroll = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
  ): void => {
    const slideIndex = Math.round(
      event.nativeEvent.contentOffset.x / (width - 40),
    );
    setActiveIndex(slideIndex);
  };
 
  const renderItem = ({ item }: ListRenderItemInfo<BannerItem>) => (
    <View style={styles.slideWrapper}>
      <View style={styles.slide}>
        <Image
          source={{ uri: item?.filename }}
          style={styles.image}
          resizeMode="cover"
        />
        <LinearGradient
          colors={['transparent', 'rgba(31,41,55,0.9)']}
          style={styles.overlay}
        >
          <View style={styles.content}>
            <Text style={styles.title}>{item?.title}</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>NEW</Text>
            </View>
          </View>
        </LinearGradient>
        <View style={styles.glowEffect} />
      </View>
    </View>
  );
 
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.heading}>Featured</Text>
        <View style={styles.indicator}>
          <Text style={styles.indicatorText}>
            {activeIndex + 1} / {banners.length}
          </Text>
        </View>
      </View>
 
      {/* FlatList Carousel */}
      <FlatList
        ref={flatListRef}
        data={banners}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        keyExtractor={(_, index) => index.toString()}
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        decelerationRate="fast"
        snapToInterval={width - 40}
        snapToAlignment="center"
        contentContainerStyle={{ paddingHorizontal: 10 }}
      />
    </View>
  );
};
 
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F8FAFC',
    paddingVertical: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  heading: {
    fontSize: 24,
    color: '#1F2937',
    fontFamily: Config.fontFamilys.Poppins_SemiBold,
  },
  indicator: {
    backgroundColor: 'rgba(79, 70, 229, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#4F46E5',
  },
  indicatorText: {
    color: '#4F46E5',
    fontSize: 12,
    fontWeight: '600',
    fontFamily: Config.fontFamilys.Poppins_Medium,
  },
  slideWrapper: {
    width: width - 40,
    paddingHorizontal: 5,
  },
  slide: {
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    position: 'relative',
    shadowColor: '#1F2937',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 12,
  },
  image: {
    width: '100%',
    height: 240,
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
    justifyContent: 'flex-end',
    padding: 20,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 0.5,
    fontFamily: Config.fontFamilys.Poppins_Bold,
    flex: 1,
    marginRight: 12,
  },
  badge: {
    backgroundColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
    fontFamily: Config.fontFamilys.Poppins_Bold,
  },
  glowEffect: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#4F46E5',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
  },
});
 
export default memo(BannerCarousel);