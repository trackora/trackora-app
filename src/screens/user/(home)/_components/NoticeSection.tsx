import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import * as Config from '../../../../helpers/Config';
 
type NoticeSectionProps = {
  text: string;
};
 
const NoticeSection: React.FC<NoticeSectionProps> = ({ text }) => {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#FEF3C7', '#FDE68A']}
        style={styles.noticeCard}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.iconContainer}>
          <LinearGradient colors={['#D97706', '#F59E0B']} style={styles.icon}>
            <Text style={styles.iconText}>⚠️</Text>
          </LinearGradient>
        </View>
 
        <View style={styles.content}>
          <Text style={styles.label}>Important Notice</Text>
          <Text style={styles.text}>{text}</Text>
        </View>
 
        <TouchableOpacity style={styles.closeButton}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
};
 
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingVertical: 12,
    backgroundColor: '#F8FAFC',
  },
  noticeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F59E0B',
    shadowColor: '#F59E0B',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 8,
  },
  iconContainer: {
    marginRight: 12,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 18,
  },
  content: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    color: '#92400E',
    fontFamily: Config.fontFamilys.Poppins_Bold,
    marginBottom: 2,
  },
  text: {
    fontSize: 14,
    color: '#1F2937',
    fontFamily: Config.fontFamilys.Poppins_Medium,
    lineHeight: 20,
  },
  closeButton: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  closeText: {
    fontSize: 16,
    color: '#92400E',
  },
});
 
export default NoticeSection;