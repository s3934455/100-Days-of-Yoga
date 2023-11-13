import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  SafeAreaView,
  Text,
  TouchableOpacity,
} from "react-native";
import { useAppConfig } from "../Config/AppConfig";
import { useYogaDataContext } from "../Providers/YogaDataProvider";
import { getCurrentDay, getRandomPose } from "../Services/PoseService";
import Carousel from "./HelperComponents/Carousel";

// Component for the home screen. This leads to several more components including
// the Swiper, Pose details and search.
const Home = ({}) => {
  const { yogaData } = useYogaDataContext();
  const navigation = useNavigation();
  const { appConfig, updateLog } = useAppConfig();
  const [posedLoaded, setPosesLoaded] = useState(false);

  useEffect(() => {
    const loadLog = async () => {
      await updateLog();
    };
    loadLog();
  }, []);

  const images = yogaData
    .filter((obj) => obj.hasOwnProperty("image"))
    .map((obj) => obj.image);

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.contentContainer}>
        <Text style={styles.welcomeText}>
          Welcome{appConfig.user.name && <Text>, </Text>}
          {appConfig.user.name}
        </Text>

        {images.length > 0 && (
          <Carousel images={images} setPosesLoaded={setPosesLoaded} />
        )}
      </View>

      <View style={styles.buttonFlexContainer}>
        <TouchableOpacity
          style={[styles.buttonContainer, !posedLoaded && { opacity: 0.6 }]}
          onPress={() => navigation.navigate("Pose Details")}
          disabled={!posedLoaded}
        >
          <Text style={styles.buttonText}>Pose of the day</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "white",
  },
  contentContainer: {
    flex: 1,
    marginBottom: 80,
  },
  additionalText: {
    fontFamily: "BarlowCondensed-ExtraBold",
    fontSize: 24,
    marginLeft: 130,
    marginTop: -35,
    marginBottom: 10,
  },
  welcomeText: {
    fontFamily: "BarlowCondensed-ExtraBold",
    fontSize: 32,
    marginTop: 60,
    textAlign: "center",
  },
  buttonFlexContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    width: "100%",
    height: 120,
    bottom: "10%",
  },
  buttonContainer: {
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
    height: "80%",
    paddingHorizontal: 12,
    borderRadius: 10,
    elevation: 3,
  },
  buttonText: {
    color: "white",
    fontSize: 26,
    fontWeight: "bold",
    fontFamily: "Palatino-Roman",
  },
});
