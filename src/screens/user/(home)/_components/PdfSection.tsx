import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ListRenderItemInfo,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import * as Config from '../../../../helpers/Config';
 
type PdfItem = {
  title: string;
};
 
type PdfData = {
  heading: string;
  items: PdfItem[];
};
 
type PdfSectionProps = {
  pdfData: PdfData;
};
 
const PdfSection: React.FC<PdfSectionProps> = ({ pdfData }) => {
  const renderPdfItem = ({ item }: ListRenderItemInfo<PdfItem>) => (
    <TouchableOpacity style={styles.pdfItem}>
      <LinearGradient
        colors={['#FFFFFF', '#F8FAFC']}
        style={styles.pdfCard}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.pdfIcon}>
          <LinearGradient
            colors={['#DC2626', '#EF4444']}
            style={styles.iconContainer}
          >
            <Text style={styles.pdfEmoji}>📄</Text>
          </LinearGradient>
        </View>
 
        <View style={styles.pdfContent}>
          <Text style={styles.pdfTitle}>{item.title}</Text>
          <Text style={styles.pdfSize}>PDF Document</Text>
        </View>
 
        <TouchableOpacity style={styles.downloadButton}>
          <LinearGradient
            colors={['#4F46E5', '#7C3AED']}
            style={styles.downloadIcon}
          >
            <Text style={styles.downloadEmoji}>⬇️</Text>
          </LinearGradient>
        </TouchableOpacity>
      </LinearGradient>
    </TouchableOpacity>
  );
 
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>{pdfData.heading}</Text>
        <Text style={styles.subheading}>Tap to download documents</Text>
      </View>
 
      <FlatList
        data={pdfData.items}
        renderItem={renderPdfItem}
        keyExtractor={(_, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};
 
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F8FAFC',
    paddingTop: 14,
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
  listContainer: {
    paddingBottom: 10,
  },
  pdfItem: {
    marginBottom: 6,
  },
  pdfCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(79, 70, 229, 0.1)',
  },
  pdfIcon: {
    marginRight: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pdfEmoji: {
    fontSize: 20,
  },
  pdfContent: {
    flex: 1,
  },
  pdfTitle: {
    fontSize: 16,
    color: '#1F2937',
    fontFamily: Config.fontFamilys.Poppins_Medium,
    marginBottom: 4,
  },
  pdfSize: {
    fontSize: 12,
    color: '#6B7280',
    fontFamily: Config.fontFamilys.Poppins_Regular,
  },
  downloadButton: {
    marginLeft: 12,
  },
  downloadIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  downloadEmoji: {
    fontSize: 16,
  },
});
 
export default PdfSection;