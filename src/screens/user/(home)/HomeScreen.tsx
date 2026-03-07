import React from "react";
import { StyleSheet, ScrollView } from "react-native";
import Header from "./_components/Header";
import BannerCarousel from "./_components/BannerCarousel";
import AttendanceSection from "./_components/AttendanceSection";
import CounterSection from "./_components/CounterSection";
import ShortcutSection from "./_components/ShortcutSection";
import PdfSection from "./_components/PdfSection";
import NoticeSection from "./_components/NoticeSection";
import { getAppDetails } from "../../../helpers/services";
import { isApiSuccess } from "../../../helpers/Validation";

type BannerItem = {
  filename?: string;
  title?: string;
};

type AttendanceTimes = {
  start_time?: string;
  stop_time?: string;
  break_time?: string;
  total_time?: string;
};

type AttendanceData = {
  date?: string;
  text?: string;
  data: AttendanceTimes;
};

type CounterItem = {
  count: number | string;
  title: string;
};

type CounterData = {
  heading: string;
  items: CounterItem[];
};

type ShortcutItem = {
  icon: string;
  title: string;
};

type PdfItem = {
  title: string;
};

type PdfData = {
  heading: string;
  items: PdfItem[];
};

type NoticeItem = {
  title?: string;
};

type HomeData = {
  banner?: BannerItem[];
  attendData?: AttendanceData;
  count?: CounterData;
  iconData?: { items?: ShortcutItem[] }[];
  pdf?: PdfData;
  noticeData?: NoticeItem[];
};

type HomeScreenProps = {
  navigation: {
    navigate: (screen: string, params?: any) => void;
  };
};

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [homeData, setHomeData] = React.useState<HomeData | null>(null);

  const fetchHomeData = React.useCallback(async () => {
    const apiData: any = await getAppDetails();
    if (isApiSuccess(apiData)) {
      setHomeData(apiData?.data?.data);
    }
  }, []);

  React.useEffect(() => {
    fetchHomeData();
  }, [fetchHomeData]);

  // Destructure safely
  const { banner, attendData, count, iconData, pdf, noticeData } =
    homeData || {};

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <Header navigation={navigation} />

      {/* Banner Carousel */}
      {banner && banner.length > 0 && <BannerCarousel banners={banner} />}

      {/* Attendance Section */}
      {attendData && Object.keys(attendData)?.length > 0 && (
        <AttendanceSection attendData={attendData} />
      )}

      {/* Counter Section */}
      {count && Object.keys(count)?.length > 0 && (
        <CounterSection counterData={count} />
      )}

      {/* Shortcuts */}
      {(iconData?.[0]?.items?.length ?? 0) > 0 && (
        <ShortcutSection shortcuts={iconData?.[0]?.items ?? []} />
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
    backgroundColor: "#fff",
  },
});

export default React.memo(HomeScreen);
