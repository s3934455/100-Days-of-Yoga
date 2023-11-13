import { Button, Text } from "react-native-elements";
import { useAppConfig } from "../Config/AppConfig";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { useYogaDataContext } from "../Providers/YogaDataProvider";
import { YogaImage } from "../Services/ImageService";
import ProgressBar from "./HelperComponents/ProgressBar";
import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import LoginRequiredMessage from "./HelperComponents/LoginRequired";
import ConfettiCannon from "react-native-confetti-cannon";
import { brandColors } from "../Theme/BrandColors";

// This component takes a pose and displays it list format as opposed to the
// card format seen on the All Poses page.
const PoseListView = ({ pose }) => {
  const navigation = useNavigation();
  const { title, image } = pose;
  const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      marginBottom: 16,
    },
    image: {
      width: 50,
      height: 50,
      aspectRatio: 1,
      marginRight: 16,
      borderRadius: 8,
    },
  });

  const handlePress = () => {
    navigation.navigate("Individual Pose", { pose });
  };
  return (
    <ScrollView>
      <TouchableOpacity onPress={() => handlePress()}>
        <View style={styles.container}>
          <YogaImage image={image} supressError={true} style={styles.image} />
          <Text>{title}</Text>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
};

// Completed poses shows a list of logged poses,
// the list of completed poses are stored in run time memory and
// managed by the appConfig.
const CompletedPoses = () => {
  const { loggedYogaData } = useAppConfig();
  const { yogaData } = useYogaDataContext();
  const { appConfig } = useAppConfig();
  const [praiseText, setPraiseText] = useState();

  const [showConfetti, setShowConfetti] = useState(false);

  //We're using a confetti npm package which
  // requires us to have a state dicate the time it
  // is displayed for.
  const handleShowConfetti = () => {
    setShowConfetti(false);
    setTimeout(() => {
      setShowConfetti(true);
    }, 500);
  };

  useEffect(() => {
    const l = loggedYogaData.length;
    switch (l) {
      case 0: // no poses completed
        setPraiseText(
          `Hi ${appConfig.user.name}, your logged poses will appear here`
        );
        break;
      case 1: // one pose complete
        setPraiseText(
          `Congratulations ${appConfig.user.name}, you've completed your first yoga pose!`
        );
        break;
      default: // x number of poses completed
        setPraiseText(
          `Congratulations ${appConfig.user.name} you've completed ${l} poses!`
        );
    }
  });

  const styles = StyleSheet.create({
    titleText: {
      fontFamily: "BarlowCondensed-ExtraBold",
      fontSize: 20,
      alignSelf: "center",
      marginTop: 30,
    },
    bodyText: {
      alignSelf: "center",
    },
    praiseText: {
      fontStyle: "italic",
      paddingTop: 10,
      paddingBottom: 10,
      paddingLeft: 8,
      fontSize: 16,
    },
  });
  return (
    <View>
      <ScrollView>
        {/* User needs to be logged in to view page */}
        {appConfig.user.isLoggedIn ? (
          <>
            {/* Progress Bar is where the redeem button is,
            when clicked it activates the confetti, hence
            the showConfetti fuction is passed as a prop */}
            <ProgressBar handleShowConfetti={handleShowConfetti} />
            <Text style={styles.praiseText}>{praiseText}</Text>
            {yogaData.map((pose) => (
              <>
                {loggedYogaData.includes(pose._id) && (
                  <PoseListView pose={pose} key={pose._id} />
                )}
              </>
            ))}
          </>
        ) : (
          <LoginRequiredMessage message="Please log in to track your progress." />
        )}
      </ScrollView>
      {/* Conditionally renders confetti on the screen when prize is redeemed */}
      {showConfetti ? (
        <ConfettiCannon
          count={200}
          origin={{ x: 0, y: 0 }}
          fallSpeed={3000}
          explosionSpeed={0}
          fadeOut
          colors={Object.values(brandColors)}
        />
      ) : null}
    </View>
  );
};

export default CompletedPoses;
