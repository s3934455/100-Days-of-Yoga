import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import YoutubeIframe from "react-native-youtube-iframe";
import { getImageURL } from "../Services/ImageService";
import ImageWebView from "./HelperComponents/ImageWebView";
import LoadingIndicator from "./HelperComponents/LoadingIndicator";
import Icon from "react-native-vector-icons/Ionicons";
import { useAppConfig } from "../Config/AppConfig";
import { logPose } from "../Services/LogService";
import PopupMessage from "./HelperComponents/PopupMessage";

const width = Dimensions.get("screen");

// Main Component for the individual pose details
const PoseDetails = ({ route }) => {
  const { pose } = route.params;
  const { appConfig, updateLog } = useAppConfig();
  const poseImage = pose?.image ? pose?.image : "";
  const [isLoading, setIsLoading] = useState(true);
  const [videoId, setVideoId] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const { loggedYogaData } = useAppConfig();
  const isLogged = loggedYogaData.includes(pose._id);

  const setVideo = () => {
    if (pose && pose.video && pose.video.nodes) {
      pose.video.nodes.forEach((node) => {
        if (node.videoData) {
          const url = node.videoData.video.src.url;
          const embedId = url.split("=")[1];
          setVideoId(embedId);
        }
      });
    }
  };

  useEffect(() => {
    setVideo();

    setTimeout(() => {
      setIsLoading(false);
    }, 3000); // Simulated loading time (3 seconds)
  }, []);

  const handleLogPose = async () => {
    //first check if they are logged in.
    if (!appConfig.user.isLoggedIn) {
      return false; //needs better error handling
    }
    //check if pose is logged
    if (appConfig.user.isLoggedIn && loggedYogaData.includes(pose._id)) {
      return false;
    }
    //then create a const values to be sent to wix
    const values = {
      id: pose._id,
      pose: pose.title,
      email: appConfig.user.email,
    };
    //then call the wix api
    await logPose(values, appConfig);
    //tell all poses to update
    updateLog();
    return true;
  };

  return (
    <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
      {showPopup && (
        <PopupMessage
          message={
            appConfig.user.isLoggedIn
              ? "Your pose has been logged."
              : "Please sign in to log a pose"
          }
          setShowPopup={setShowPopup}
        />
      )}

      <View style={showPopup && { opacity: 0.2 }}>
        <ImageWebView url={getImageURL(poseImage)} />

        <View style={styles.contentBox}>
          <Text style={styles.title}>{pose.title}</Text>
          <Text style={styles.sanskritName}>{pose["sanskritName"]}</Text>

          <View style={styles.propertyContainer}>
            <View style={[styles.propertyBox, styles.innerBorderStyles]}>
              <Text style={styles.propertyBoxTextStyle}>Type: {pose.type}</Text>
            </View>
            <View style={styles.propertyBox}>
              <Text style={styles.propertyBoxTextStyle}>Mood: {pose.mood}</Text>
            </View>
          </View>

          <View style={styles.labelContainer}>
            <Text style={styles.labelText}>Difficulty: {pose.difficulty}</Text>
          </View>

          <Text style={styles.shortDescription}>
            {pose["shortDescription"]}
          </Text>

          {isLoading ? (
            <LoadingIndicator />
          ) : videoId === "" ? (
            <View style={styles.noVideoContainer}>
              <Text>Video Coming Soon...</Text>
            </View>
          ) : (
            <YoutubeIframe
              height={270}
              width={width}
              webViewStyle={[
                styles.videoContainer,
                showPopup && { opacity: 0.4 },
              ]}
              videoId={videoId}
            />
          )}

          <View style={styles.logPoseContainer}>
            <TouchableOpacity
              underlayColor="#E0E0E0"
              style={styles.logPoseButton}
              onPress={() =>
                handleLogPose().then((r) => (r ? setShowPopup(true) : null))
              }
            >
              <Icon
                name={isLogged ? "checkmark-outline" : "add-outline"}
                size={32}
                color="black"
              />
              <Text style={styles.logPoseText}>
                {isLogged ? "Completed" : "Log Pose"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    // paddingTop: 100,
    backgroundColor: "white",
  },
  contentBox: {
    paddingHorizontal: 30,
    marginBottom: 50,
  },
  title: {
    textAlign: "center",
    fontFamily: "BarlowCondensed-ExtraBold",
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 10,
  },
  sanskritName: {
    textAlign: "center",
    fontSize: 17,
    marginTop: 5,
  },

  propertyContainer: {
    height: 50,
    display: "flex",
    flexDirection: "row",
    marginHorizontal: 10,
    marginVertical: 16,
    borderRadius: 5,
    borderColor: "grey",
    borderWidth: 0.5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 5,
  },
  propertyBox: {
    height: "100%",
    width: "50%",
    justifyContent: "center",
    alignItems: "center",
  },
  innerBorderStyles: {
    borderRightWidth: 0.5,
    borderColor: "grey",
  },
  propertyBoxTextStyle: {
    fontSize: 21,
    fontFamily: "Avenir Next Condensed",
  },

  logPoseContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  logPoseButton: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  logPoseText: {
    fontSize: 18,
  },

  labelContainer: {
    alignSelf: "center",
    backgroundColor: "white",
    borderRadius: 4,
    padding: 6,
    marginVertical: 5,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    elevation: 5,
  },
  labelText: {
    fontSize: 20,
    fontFamily: "Avenir Next Condensed",
    letterSpacing: 1,
  },
  shortDescription: {
    fontSize: 18,
    marginTop: 10,
    textAlign: "justify",
  },

  videoContainer: {
    marginTop: 30,
  },
  buttonContainer: {
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
    height: 40,
    paddingHorizontal: 12,
    borderRadius: 10,
    elevation: 3,
    marginBottom: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
    fontFamily: "Palatino-Roman",
  },
  noVideoContainer: {
    backgroundColor: "lightgrey",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
    height: 230,
  },
});

export default PoseDetails;
