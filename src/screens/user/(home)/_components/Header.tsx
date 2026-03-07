'use client';
 
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
 
import { apiPostService } from '../../../../helpers/services';
import { isApiSuccess } from '../../../../helpers/Validation';
import * as Constants from '../../../../helpers/Constants';
import * as Config from '../../../../helpers/Config';
 
type LoginData = {
  name?: string;
  designation?: string;
};
 
type HeaderProps = {
  navigation: {
    navigate: (screen: string, params?: { notificationCount: number }) => void;
  };
};
 
const Header: React.FC<HeaderProps> = ({ navigation }) => {
  const loginData = useSelector(
    (state: any) => state.login?.data?.loginData?.data,
  ) as LoginData | undefined;
 
  const [notificationCount, setNotificationCount] = React.useState(0);
 
  const getNotificationCount = React.useCallback(async () => {
    try {
      const bodyData = { limit: 20, start: 0, filter: {} };
      const apiData: any = await apiPostService(
        Constants?.get_unread_notification_count_api,
        bodyData,
      );
      if (isApiSuccess(apiData)) {
        setNotificationCount(apiData?.data?.result?.data || 0);
      }
    } catch (err) {
      console.log('Error fetching notifications:', err);
    }
  }, []);
 
  React.useEffect(() => {
    getNotificationCount();
  }, [getNotificationCount]);
 
  return (
    <LinearGradient
      colors={['#F8FAFC', '#E2E8F0']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.content}>
        <View style={styles.left}>
          <View style={styles.avatarContainer}>
            <Image
              source={{
                uri: 'https://dummyimage.com/100x100/4F46E5/fff&text=JD',
              }}
              style={styles.avatar}
            />
            <View style={styles.statusIndicator} />
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.name}>{loginData?.name || 'Guest User'}</Text>
            <Text style={styles.designation}>
              {loginData?.designation || 'Team Member'}
            </Text>
          </View>
        </View>
 
        <TouchableOpacity
          style={styles.notificationContainer}
          onPress={() =>
            navigation.navigate('notification', {
              notificationCount: notificationCount,
            })
          }
        >
          <LinearGradient
            colors={['#4F46E5', '#6366F1']}
            style={styles.notificationBox}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.notificationIcon}>🔔</Text>
            {notificationCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{notificationCount}</Text>
              </View>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};
 
const styles = StyleSheet.create({
  container: {
    padding: 15,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 3,
    borderColor: '#4F46E5',
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#F8FAFC',
  },
  userInfo: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    fontFamily: Config.fontFamilys.Poppins_Bold,
    marginBottom: 2,
  },
  designation: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: Config.fontFamilys.Poppins_Medium,
  },
  notificationContainer: {
    position: 'relative',
  },
  notificationBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  notificationIcon: {
    fontSize: 20,
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#F8FAFC',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    fontFamily: Config.fontFamilys.Poppins_Bold,
  },
});
 
export default React.memo(Header);