import { View, Text, FlatList, StyleSheet, Dimensions } from "react-native"
import LinearGradient from "react-native-linear-gradient"
import * as Config from "../../../../helpers/Config"

const { width } = Dimensions.get("window")

const CounterSection = ({ counterData }) => {
  const renderCounter = ({ item, index }) => {
    const gradients = [
      ["#4F46E5", "#7C3AED"],
      ["#059669", "#10B981"],
      ["#DC2626", "#EF4444"],
      ["#D97706", "#F59E0B"],
    ]

    const gradient = gradients[index % gradients.length]

    return (
      <View style={styles.cardContainer}>
        <LinearGradient colors={["#FFFFFF", "#F8FAFC"]} style={styles.card} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
          <LinearGradient colors={gradient} style={styles.iconContainer} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
            <Text style={styles.countIcon}>📊</Text>
          </LinearGradient>

          <Text style={styles.count}>{item.count}</Text>
          <Text style={styles.title}>{item.title}</Text>

          <View style={styles.progressBar}>
            <LinearGradient
              colors={gradient}
              style={[styles.progress, { width: "75%" }]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            />
          </View>
        </LinearGradient>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>{counterData.heading}</Text>
        <Text style={styles.subheading}>Real-time analytics</Text>
      </View>

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={counterData.items}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.listContainer}
        renderItem={renderCounter}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F8FAFC",
    paddingVertical: 12,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  heading: {
    fontSize: 24,
    color: "#1F2937",
    fontFamily: Config.fontFamilys.Poppins_Bold,
  },
  subheading: {
    fontSize: 14,
    color: "#6B7280",
    fontFamily: Config.fontFamilys.Poppins_Medium,
  },
  listContainer: {
    paddingHorizontal: 10,
  },
  cardContainer: {
    marginRight: 16,
  },
  card: {
    width: width * 0.7,
    padding: 24,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(79, 70, 229, 0.1)"
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  countIcon: {
    fontSize: 20,
  },
  count: {
    fontSize: 36,
    color: "#1F2937",
    fontFamily: Config.fontFamilys.Poppins_Bold,
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    color: "#6B7280",
    fontFamily: Config.fontFamilys.Poppins_Medium,
    marginBottom: 16,
  },
  progressBar: {
    height: 4,
    backgroundColor: "rgba(107, 114, 128, 0.2)",
    borderRadius: 2,
    overflow: "hidden",
  },
  progress: {
    height: "100%",
    borderRadius: 2,
  },
})

export default CounterSection
