import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import * as Config from '../../../../helpers/Config';

const AttendanceSection = ({ attendData }) => {
  const { date, text, data } = attendData;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#FFFFFF', '#F8FAFC']}
        style={styles.card}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Header with glow effect */}
        <View style={styles.header}>
          <View>
            <Text style={styles.date}>{date}</Text>
            <Text style={styles.shift}>{text}</Text>
          </View>
          <View style={styles.statusContainer}>
            <LinearGradient
              colors={['#10B981', '#059669']}
              style={styles.statusBadge}
            >
              <Text style={styles.statusText}>ACTIVE</Text>
            </LinearGradient>
          </View>
        </View>

        {/* Time Grid */}
        <View style={styles.timeGrid}>
          <View style={styles.timeCard}>
            <LinearGradient
              colors={['#4F46E5', '#7C3AED']}
              style={styles.timeIcon}
            >
              <Text style={styles.timeEmoji}>🕐</Text>
            </LinearGradient>
            <Text style={styles.timeLabel}>Punch In</Text>
            <Text style={styles.timeValue}>{data.start_time || '--:--'}</Text>
          </View>

          <View style={styles.timeCard}>
            <LinearGradient
              colors={['#DC2626', '#EF4444']}
              style={styles.timeIcon}
            >
              <Text style={styles.timeEmoji}>🕕</Text>
            </LinearGradient>
            <Text style={styles.timeLabel}>Punch Out</Text>
            <Text style={styles.timeValue}>{data.stop_time || '--:--'}</Text>
          </View>
        </View>

        <View style={styles.timeGrid}>
          <View style={styles.timeCard}>
            <LinearGradient
              colors={['#D97706', '#F59E0B']}
              style={styles.timeIcon}
            >
              <Text style={styles.timeEmoji}>☕</Text>
            </LinearGradient>
            <Text style={styles.timeLabel}>Break</Text>
            <Text style={styles.timeValue}>{data.break_time || '--:--'}</Text>
          </View>

          <View style={styles.timeCard}>
            <LinearGradient
              colors={['#059669', '#10B981']}
              style={styles.timeIcon}
            >
              <Text style={styles.timeEmoji}>⏱️</Text>
            </LinearGradient>
            <Text style={styles.timeLabel}>Total</Text>
            <Text style={styles.timeValue}>{data.total_time || '--:--'}</Text>
          </View>
        </View>

        {/* Action Button */}
        <TouchableOpacity style={styles.buttonContainer}>
          <LinearGradient
            colors={['#4F46E5', '#7C3AED']}
            style={styles.button}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.btnText}>Punch In</Text>
            <View style={styles.buttonGlow} />
          </LinearGradient>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#F8FAFC',
  },
  card: {
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(79, 70, 229, 0.1)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  date: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1F2937',
    fontFamily: Config.fontFamilys.Poppins_Bold,
    marginBottom: 4,
  },
  shift: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    fontFamily: Config.fontFamilys.Poppins_Medium,
  },
  statusContainer: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    fontFamily: Config.fontFamilys.Poppins_Bold,
  },
  timeGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  timeCard: {
    flex: 1,
    backgroundColor: 'rgba(248, 250, 252, 0.8)',
    marginHorizontal: 6,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(79, 70, 229, 0.1)',
  },
  timeIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  timeEmoji: {
    fontSize: 16,
  },
  timeLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
    fontFamily: Config.fontFamilys.Poppins_Medium,
  },
  timeValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    fontFamily: Config.fontFamilys.Poppins_Bold,
  },
  buttonContainer: {
    marginTop: 8,
  },
  button: {
    paddingVertical: 16,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  btnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: Config.fontFamilys.Poppins_Bold,
  },
  buttonGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
});

export default AttendanceSection;
