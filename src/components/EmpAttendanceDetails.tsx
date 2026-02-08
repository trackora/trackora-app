import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, { memo, useCallback } from 'react';
import * as Config from '../helpers/Config';
import * as Icons from '../helpers/Icons';
import * as Constants from '../helpers/Constants';
import { widthToDp, heightToDp } from '../helpers/Responsive';
import { CustomLinearButton } from './CustomElements';
import { useTranslation } from 'react-i18next';
import { toLocaleDateString } from '../helpers/utils';
import RNFS from 'react-native-fs';
import { useSelector } from 'react-redux';
import { apiPostService } from '../helpers/services';
import { SvgXml } from 'react-native-svg';
import { NotFound_result } from '../helpers/Svg';

/* ---------------- TYPES ---------------- */

type AttendanceItem = {
  attend_date: string;
  start_time?: string;
  stop_time?: string;
  attendance_type?: string;
};

type SummaryItem = {
  name: string;
  value: string;
  borderColor: string;
  backgroundColor: string;
};

type Props = {
  attendanceData: {
    data: AttendanceItem[];
    details: SummaryItem[];
    attendDataShowInMap?: any;
    getUserLiveTrack?: any;
  } | null;
  handleUserLocation: (data: any) => void;
  selectedMonth: Date;
  userData: { id: string | number };
};

/* ---------------- COMPONENT ---------------- */

const EmpAttendanceDetails: React.FC<Props> = ({
  attendanceData,
  handleUserLocation,
  selectedMonth,
  userData,
}) => {
  const { t } = useTranslation();

  const appfolderName = useSelector(
    (state: any) => state?.login?.folderName,
  );

  const keyExtractor = useCallback(
    (_: unknown, index: number) => String(index),
    [],
  );

  /* ---------- HEADER ---------- */

  const listHeaderComponent = () => (
    <View style={styles.headerRow}>
      {['date', 'punch_in', 'punch_out', 'type'].map((key, index) => (
        <View
          key={key}
          style={[
            styles.tableCell,
            { width: index === 0 ? widthToDp(15) : widthToDp(25) },
          ]}
        >
          <Text style={styles.headerText}>
            {t((Config as any)?.salaryScreenText?.[key] ||
              (Config as any)?.manage_attendance?.[key])}
          </Text>
        </View>
      ))}
    </View>
  );

  /* ---------- TABLE ROW ---------- */

  const viewAttRenderItem = ({
    item,
  }: {
    item: AttendanceItem;
  }) => (
    <View style={styles.row}>
      <View style={[styles.tableCell, { width: widthToDp(15) }]}>
        <Text style={styles.cellText}>
          {toLocaleDateString(item.attend_date).day}
        </Text>
        <Text style={styles.subText}>
          {toLocaleDateString(item.attend_date).day_name}
        </Text>
      </View>

      <View style={[styles.tableCell, { width: widthToDp(25) }]}>
        {item.start_time && (
          <Text style={styles.cellText}>{item.start_time}</Text>
        )}
      </View>

      <View style={[styles.tableCell, { width: widthToDp(25) }]}>
        {item.stop_time && (
          <Text style={styles.cellText}>{item.stop_time}</Text>
        )}
      </View>

      <View style={[styles.tableCell, { width: widthToDp(25) }]}>
        <Text
          style={[
            styles.cellText,
            {
              color:
                item.attendance_type === 'Present'
                  ? Config.Colors.green
                  : Config.Colors.textColor.textColor_2,
            },
          ]}
        >
          {item.attendance_type}
        </Text>
      </View>
    </View>
  );

  /* ---------- SUMMARY BOX ---------- */

  const renderSummaryItem = ({
    item,
  }: {
    item: SummaryItem;
  }) => (
    <View style={{ marginRight: 6 }}>
      <View
        style={{
          borderLeftWidth: 5,
          borderColor: item.borderColor,
          backgroundColor: item.backgroundColor,
          borderRadius: 10,
          padding: widthToDp(2),
          width: widthToDp(22),
        }}
      >
        <Text style={styles.summaryValue}>
          {item.value || '00'}
        </Text>
        <Text style={styles.summaryLabel}>{item.name}</Text>
      </View>
    </View>
  );

  /* ---------- EXPORT ---------- */

  const handleReportExcel = async () => {
    const bodyData = {
      attend_month: `${toLocaleDateString(selectedMonth).year}-${String(
        toLocaleDateString(selectedMonth).month_number + 1,
      ).padStart(2, '0')}`,
      user_id: userData.id,
    };

    const apiData = await apiPostService(
      Constants.attendance_list_excel_api,
      bodyData,
    );

    const rows = apiData?.data?.result?.data;

    if (!rows?.length) {
      Alert.alert('No Data Found');
      return;
    }

    const headers = Object.keys(rows[0]);
    const csv =
      headers.join(',') +
      '\n' +
      rows
        .map((r: any) =>
          headers.map(h => r[h]).join(','),
        )
        .join('\n');

    const path = `${appfolderName}/attendance_${Date.now()}.csv`;
    await RNFS.writeFile(path, csv, 'utf8');

    Alert.alert('Downloaded', path);
  };

  /* ---------- UI ---------- */

  return (
    <>
      <FlatList<SummaryItem>
        data={attendanceData?.details ?? []}
        renderItem={renderSummaryItem}
        horizontal
        keyExtractor={keyExtractor}
        showsHorizontalScrollIndicator={false}
      />

      {attendanceData?.data?.length ? (
        <>
          <FlatList<AttendanceItem>
            data={attendanceData.data}
            renderItem={viewAttRenderItem}
            keyExtractor={keyExtractor}
            ListHeaderComponent={listHeaderComponent}
          />

          <View style={styles.actionRow}>
            <CustomLinearButton
              commonWidth={widthToDp(28)}
              text={t(Config.salaryScreenText?.show_in_map)}
              Icons={Icons.show_map}
              onPress={() =>
                handleUserLocation(
                  attendanceData.attendDataShowInMap,
                )
              }
            />

            <CustomLinearButton
              commonWidth={widthToDp(30)}
              text={t(Config.salaryScreenText?.live_tracker)}
              Icons={Icons.live_track_icon}
              onPress={() =>
                handleUserLocation(
                  attendanceData.getUserLiveTrack,
                )
              }
            />

            <CustomLinearButton
              commonWidth={widthToDp(30)}
              text={t(Config.salaryScreenText?.download_report)}
              Icons={Icons.download_icon}
              onPress={handleReportExcel}
            />
          </View>
        </>
      ) : (
        <View style={styles.empty}>
          <SvgXml xml={NotFound_result} />
        </View>
      )}
    </>
  );
};

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderColor: Config.Colors.borderColor,
  },
  headerText: {
    fontFamily: Config.fontFamilys.Poppins_SemiBold,
    fontSize: widthToDp(3.5),
    color: Config.Colors.black,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderColor: Config.Colors.borderColor,
  },
  tableCell: {
    borderWidth: 1,
    borderColor: Config.Colors.borderColor,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  cellText: {
    fontFamily: Config.fontFamilys.Poppins_Medium,
    fontSize: widthToDp(3.5),
  },
  subText: {
    fontSize: widthToDp(3),
    color: Config.Colors.textColor.textColor_1,
  },
  summaryValue: {
    fontFamily: Config.fontFamilys.Poppins_Bold,
    fontSize: widthToDp(3),
  },
  summaryLabel: {
    fontFamily: Config.fontFamilys.Poppins_Bold,
    fontSize: widthToDp(3),
  },
  actionRow: {
    flexDirection: 'row',
    gap: 5,
    marginTop: widthToDp(2),
  },
  empty: {
    height: heightToDp(60),
    justifyContent: 'center',
    alignSelf: 'center',
  },
});

export default memo(EmpAttendanceDetails);
