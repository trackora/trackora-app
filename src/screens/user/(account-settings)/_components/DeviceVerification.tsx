import React, { memo, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ListRenderItemInfo,
} from 'react-native';
import { Header_2 } from '../../../../components/Header';
import * as Icons from '../../../../helpers/Icons';
import * as Config from '../../../../helpers/Config';
import { heightToDp, widthToDp } from '../../../../helpers/Responsive';
import { apiPostService } from '../../../../helpers/services';
import * as Constants from '../../../../helpers/Constants';
import { isApiSuccess } from '../../../../helpers/Validation';
 
type DeviceItem = {
  id?: number | string;
  user_name?: string;
  device_name?: string;
  device_os?: string;
  device_id?: string;
};
 
type DeviceList = {
  count?: number;
  data?: DeviceItem[];
};
 
type DeviceData = {
  pending?: DeviceList;
  verified?: DeviceList;
};
 
type DeviceVerificationProps = {
  navigation: {
    goBack: () => void;
  };
};
 
const DeviceVerification: React.FC<DeviceVerificationProps> = ({
  navigation,
}) => {
  const [activeTab, setActiveTab] = useState<'pending' | 'verified'>('pending');
  const [deviceData, setDeviceData] = useState<DeviceData>({});
 
  const goBackScreen = () => navigation.goBack();
 
  const handleApprove = async (deviceId?: number | string) => {
    try {
      if (!deviceId) return;
      const bodyData = { status: 1, id: deviceId };
      const apiData: any = await apiPostService(
        Constants?.approveDeviceApi,
        bodyData,
      );
      if (isApiSuccess(apiData)) handleDeviceList();
    } catch (err) {
      console.log('Error approving device:', err);
    }
  };
 
  const handleDeviceList = async () => {
    try {
      const apiData: any = await apiPostService(Constants?.getAllDeviceApi, {
        filter: {},
      });
      if (isApiSuccess(apiData)) setDeviceData(apiData?.data?.result);
    } catch (err) {
      console.log('Error occured while getting device list', err);
    }
  };
 
  useEffect(() => {
    handleDeviceList();
  }, []);
 
  const renderDeviceItem = ({ item }: ListRenderItemInfo<DeviceItem>) => (
    <View style={styles.deviceCard}>
      {item?.user_name && (
        <Text style={styles.userName}>{item?.user_name}</Text>
      )}
      <Text style={styles.deviceName}>{item?.device_name}</Text>
      <Text style={styles.deviceInfo}>OS: {item?.device_os}</Text>
      <Text style={styles.deviceInfo}>ID: {item?.device_id}</Text>
      {activeTab === 'pending' && (
        <TouchableOpacity
          style={styles.approveButton}
          onPress={() => handleApprove(item?.id)}
        >
          <Text style={styles.approveButtonText}>Approve this</Text>
        </TouchableOpacity>
      )}
    </View>
  );
 
  const currentData =
    activeTab === 'pending'
      ? deviceData?.pending?.data
      : deviceData?.verified?.data;
 
  return (
    <View style={styles.container}>
      {/* Header */}
      <Header_2
        leftImage={Icons.arrow_back}
        commonWidth={widthToDp(12)}
        commonHeight={heightToDp(5)}
        leftText="Device Request"
        animated={true}
        onPressLeft={goBackScreen}
      />
 
      {/* Tabs */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            activeTab === 'pending' && styles.activeToggle,
          ]}
          onPress={() => setActiveTab('pending')}
        >
          <Text
            style={[
              styles.toggleText,
              activeTab === 'pending' && styles.activeToggleText,
            ]}
          >
            Pending ({deviceData?.pending?.count})
          </Text>
        </TouchableOpacity>
 
        <TouchableOpacity
          style={[
            styles.toggleButton,
            activeTab === 'verified' && styles.activeToggle,
          ]}
          onPress={() => setActiveTab('verified')}
        >
          <Text
            style={[
              styles.toggleText,
              activeTab === 'verified' && styles.activeToggleText,
            ]}
          >
            Approved ({deviceData?.verified?.count})
          </Text>
        </TouchableOpacity>
      </View>
 
      {/* Device list */}
      <FlatList
        data={currentData ?? []}
        keyExtractor={item => String(item?.id ?? '')}
        renderItem={renderDeviceItem}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No devices found</Text>
        }
      />
    </View>
  );
};
 
export default memo(DeviceVerification);
 
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: heightToDp(2),
  },
  toggleButton: {
    paddingVertical: heightToDp(1),
    paddingHorizontal: widthToDp(8),
    borderRadius: 20,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 5,
  },
  activeToggle: { backgroundColor: Config.Colors.themeColor },
  toggleText: { fontSize: 14, fontWeight: '600', color: '#555' },
  activeToggleText: { color: '#fff' },
  deviceCard: {
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    backgroundColor: '#fefefe',
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    color: Config.Colors.themeColor,
    marginBottom: 6,
  },
  deviceName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  deviceInfo: {
    fontSize: 13,
    color: '#555',
    marginBottom: 2,
  },
  approveButton: {
    marginTop: 12,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: Config.Colors.themeColor,
    alignItems: 'center',
  },
  approveButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  emptyText: { textAlign: 'center', color: '#999', marginTop: 20 },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    width: '85%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  modalTitle: { fontSize: 18, fontWeight: '700', marginBottom: 15 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 10,
    marginBottom: 6,
  },
  errorText: { color: 'red', fontSize: 12, marginBottom: 6 },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  modalBtn: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 6,
    marginLeft: 10,
  },
});