import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import Header from '../(home)/_components/Header';
import BannerCarousel from '../(home)/_components/BannerCarousel';
import AttendanceSection from '../(home)/_components/AttendanceSection';
import CounterSection from '../(home)/_components/CounterSection';
import ShortcutSection from '../(home)/_components/ShortcutSection';
import PdfSection from '../(home)/_components/PdfSection';
import NoticeSection from '../(home)/_components/NoticeSection';
import { getAppDetails, apiPostService } from '../../../helpers/services';
import { isApiSuccess } from '../../../helpers/Validation';

const HomeScreen = ({ navigation }) => {
  const [homeData, setHomeData] = React.useState(null);

  const fetchHomeData = React.useCallback(async () => {
    const apiData = await getAppDetails();
    if (isApiSuccess(apiData)) {
      setHomeData(apiData?.data?.data);
    }
  },[]);

  React.useEffect(() => {
    fetchHomeData();
  }, []);

  // Destructure safely
  const { banner, attendData, count, iconData, pdf, noticeData } =
    homeData || {};

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <Header navigation={navigation} />

      {/* Banner Carousel */}
      {banner && Object.keys(banner)?.length > 0 && <BannerCarousel banners={banner} />}

      {/* Attendance Section */}
      {attendData && Object.keys(attendData)?.length > 0 && (
        <AttendanceSection attendData={attendData} />
      )}

      {/* Counter Section */}
      {count && Object.keys(count)?.length > 0 && (
        <CounterSection counterData={count} />
      )}

      {/* Shortcuts */}
      {iconData?.[0]?.items?.length > 0 && (
        <ShortcutSection shortcuts={iconData[0].items} />
      )}

      {/* PDF Section */}
      {pdf && Object.keys(pdf)?.length > 0 && <PdfSection pdfData={pdf} />}

      {/* Notice Marquee */}
      {noticeData?.[0]?.title && <NoticeSection text={noticeData[0].title} />}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default React.memo(HomeScreen);
