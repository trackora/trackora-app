import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import React, { useState } from 'react';
import { Header_2 } from '../../components/Header';
import * as Icons from '../../helpers/Icons';
import * as Config from '../../helpers/Config';
import { heightToDp, widthToDp } from '../../helpers/Responsive';
import { RequestLeaveForm } from '../../components/Forms';
import RequestLeaveHistory from './RequestLeaveHistory';
import { useTranslation } from 'react-i18next';

const RequestLeave = ({ navigation }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('request');

  const goBackScreen = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={{ alignItems: 'center' }}>
        <Header_2
          leftImage={Icons.arrow_back}
          commonWidth={widthToDp(12)}
          commonHeight={heightToDp(5)}
          leftText={t(Config.leaveRequestScreenText?.leave_request)}
          animated={true}
          onPressLeft={goBackScreen}
        />
      </View>

      {/* Toggle Buttons */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            activeTab === 'request' && styles.activeToggle,
          ]}
          onPress={() => setActiveTab('request')}
        >
          <Text
            style={[
              styles.toggleText,
              activeTab === 'request' && styles.activeToggleText,
            ]}
          >
            {t('Request')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            activeTab === 'history' && styles.activeToggle,
          ]}
          onPress={() => setActiveTab('history')}
        >
          <Text
            style={[
              styles.toggleText,
              activeTab === 'history' && styles.activeToggleText,
            ]}
          >
            {t('History')}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Conditional Rendering */}
      <View style={styles.contentContainer}>
        {activeTab === 'request' ? (
          <RequestLeaveForm />
        ) : (
          <RequestLeaveHistory />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: heightToDp(2),
  },
  toggleButton: {
    paddingVertical: heightToDp(1),
    paddingHorizontal: widthToDp(10),
    borderRadius: 20,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 5,
  },
  activeToggle: {
    backgroundColor: Config.Colors.themeColor,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
  },
  activeToggleText: {
    color: '#fff',
  },
  contentContainer: {
    flex: 1,
  },
});

export default React.memo(RequestLeave);
