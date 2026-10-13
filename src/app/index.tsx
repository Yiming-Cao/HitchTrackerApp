import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Location from "expo-location";
import { useEffect, useState } from "react";
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";

export default function HomeScreen() {
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [isTripActive, setIsTripActive] = useState(false);
  const [activeTab, setActiveTab] = useState(1);
  const [currentLocation, setCurrentLocation] =
    useState<Location.LocationObject | null>(null);

  // 模拟目的地坐标 (A 到 B)
  const destinationCoords = {
    latitude: 51.84345,
    longitude: 5.8524,
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Geen toegang",
          "GPS toestemming is nodig voor HitTracker.",
        );
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setCurrentLocation(location);
    })();
  }, []);

  // 上下地点互换
  const handleSwapLocations = () => {
    const temp = pickup;
    setPickup(destination);
    setDestination(temp);
  };

  const handleStartTrip = () => {
    if (!destination.trim() && !pickup.trim()) {
      Alert.alert("Let op", "Voer een ophaal- en eindlocatie in.");
      return;
    }
    setIsTripActive(true);
  };

  const handleStopTrip = () => {
    setIsTripActive(false);
    Alert.alert("Rit Voltooid", "Bedankt voor het gebruiken van HitTracker!");
  };

  const region = {
    latitude: currentLocation?.coords.latitude || 51.5074,
    longitude: currentLocation?.coords.longitude || -0.1278,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 1. 上半区：UI 内容 */}
      <View style={styles.topContainer}>
        {/* 顶部 Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.iconCircleButton}>
            <Ionicons name="menu-outline" size={20} color="#18181A" />
          </TouchableOpacity>

          <Text style={styles.brandTitle}>HitTracker</Text>

          <TouchableOpacity style={styles.iconCircleButton}>
            <Ionicons name="notifications-outline" size={20} color="#18181A" />
          </TouchableOpacity>
        </View>

        {/* 大标题 */}
        <Text style={styles.mainHeading}>Where do you{"\n"}want to go?</Text>

        {/* 输入框卡片 */}
        <View style={styles.cardContainer}>
          <View style={styles.inputWrapper}>
            <View style={styles.inputBox}>
              <Ionicons
                name="location-outline"
                size={18}
                color="#6E6E73"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.textInput}
                placeholder="Start locatie"
                placeholderTextColor="#8E8E93"
                value={pickup}
                onChangeText={setPickup}
                editable={!isTripActive}
              />
            </View>

            <View style={styles.inputBox}>
              <Ionicons
                name="location-outline"
                size={18}
                color="#6E6E73"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.textInput}
                placeholder="Eind locatie"
                placeholderTextColor="#8E8E93"
                value={destination}
                onChangeText={setDestination}
                editable={!isTripActive}
              />
            </View>

            {/* 切换按钮：与输入框分开，避免视觉重叠 */}
            <TouchableOpacity
              style={styles.swapButton}
              onPress={handleSwapLocations}
              disabled={isTripActive}
            >
              <Ionicons name="swap-vertical" size={16} color="#18181A" />
              <Text style={styles.swapButtonText}>Wissel locaties</Text>
            </TouchableOpacity>
          </View>

          {/* 搜索/打车按钮 */}
          {!isTripActive ? (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleStartTrip}
            >
              <Text style={styles.actionButtonText}>Zoek een taxi</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.actionButton, styles.stopActionButton]}
              onPress={handleStopTrip}
            >
              <Text style={styles.actionButtonText}>Stop Tracking</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* 2. 下半区：地图区域 */}
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={region}
          showsUserLocation={true}
          followsUserLocation={true}
        >
          {currentLocation && (
            <Marker
              coordinate={{
                latitude: currentLocation.coords.latitude,
                longitude: currentLocation.coords.longitude,
              }}
              title="A (Start)"
              pinColor="green"
            />
          )}
          <Marker
            coordinate={destinationCoords}
            title="B (Eind)"
            description={destination || "Eind locatie"}
            pinColor="red"
          />

          {currentLocation && (
            <Polyline
              coordinates={[
                {
                  latitude: currentLocation.coords.latitude,
                  longitude: currentLocation.coords.longitude,
                },
                {
                  latitude: destinationCoords.latitude,
                  longitude: destinationCoords.longitude,
                },
              ]}
              strokeColor="#4A90E2"
              strokeWidth={5}
            />
          )}
        </MapView>

        <LinearGradient
          colors={["rgba(255, 255, 255, 0)", "rgba(247, 246, 242, 0.98)"]}
          locations={[0, 1]}
          style={styles.mapBottomGradient}
          pointerEvents="none"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F6F2",
  },
  topContainer: {
    paddingBottom: 2,
    backgroundColor: "#F7F6F2",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  iconCircleButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  brandTitle: {
    fontSize: 26,
    fontWeight: "700",
    fontStyle: "italic",
    fontFamily: "System",
    color: "#18181A",
  },
  mainHeading: {
    fontSize: 32,
    fontWeight: "800",
    color: "#18181A",
    paddingHorizontal: 24,
    marginTop: 12,
    marginBottom: 12,
    lineHeight: 38,
  },
  cardContainer: {
    paddingHorizontal: 20,
  },
  inputWrapper: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 4,
    position: "relative",
  },
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F7F7F8",
    borderRadius: 16,
    paddingHorizontal: 14,
    height: 46,
    marginVertical: 3,
  },
  inputIcon: {
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: "#18181A",
    fontWeight: "500",
  },
  swapButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    width: "100%",
    height: 38,
    marginTop: 6,
    borderRadius: 19,
    backgroundColor: "#EFEFF4",
  },
  swapButtonText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#18181A",
  },
  actionButton: {
    backgroundColor: "#111625",
    borderRadius: 24,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  stopActionButton: {
    backgroundColor: "#C5221F",
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  mapContainer: {
    flex: 1,
    position: "relative",
    overflow: "hidden",
  },
  mapBottomGradient: {
    position: "absolute",
    right: 0,
    bottom: 0,
    left: 0,
    height: 180,
    zIndex: 1,
  },
  map: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    width: "100%",
    height: "100%",
  },
  tabContainer: {
    position: "absolute",
    bottom: 16,
    alignSelf: "center",
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.92)",
    borderRadius: 30,
    padding: 4,
    width: 180,
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  tabItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    borderRadius: 24,
  },
  activeTabItem: {
    backgroundColor: "#E2E2E8",
  },
  blueDiamondIcon: {
    width: 10,
    height: 10,
    backgroundColor: "#007AFF",
    transform: [{ rotate: "45deg" }],
    marginRight: 6,
    borderRadius: 2,
  },
  blackCircleIcon: {
    width: 10,
    height: 10,
    backgroundColor: "#18181A",
    borderRadius: 5,
    marginRight: 6,
  },
  tabText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#8E8E93",
  },
  activeTabText: {
    color: "#18181A",
  },
});
