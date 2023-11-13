import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from "react-native";
import { Divider } from "react-native-elements";
import Icon from "react-native-vector-icons/Ionicons";
import { useAppConfig } from "../Config/AppConfig";
import PopupMessage from "./HelperComponents/PopupMessage";

// Main Component for the More screen. Contains a big list of different screens and options
const More = () => {
  const navigation = useNavigation();
  const { updateConfig, NULL_USER, clearLog, appConfig } = useAppConfig();

  const [showSettingsPopup, setShowSettingsPopup] = useState(false);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);

  const handleSettingsPress = () => {
    if (!appConfig.user.isLoggedIn) {
      setShowSettingsPopup(true);
    } else {
      navigation.navigate("Settings");
    }
  };

  // Conditionally render the sub-screens
  const renderItem = ({ item }) => {
    let onPress;

    if (item.id === "sign-up" && appConfig.user.email !== null) {
      return null;
    }

    if (item.id === "log-in" && appConfig.user.isLoggedIn === true) {
      return null;
    }

    if (item.id === "log-out" && appConfig.user.isLoggedIn === false) {
      return null;
    }

    if (item.id === "profile" && appConfig.user.isLoggedIn === false) {
      return null;
    }

    if (item.id === "remove-data" && appConfig.user.isLoggedIn === false) {
      return null;
    }

    if (item.id === "settings") {
      onPress = handleSettingsPress;
    } else if (item.id === "log-out" && appConfig.user.isLoggedIn === false) {
      return null;
    } else {
      switch (item.type) {
        case "screen":
          onPress = () => navigation.navigate(item.screen);
          break;

        case "function":
          onPress = () => {
            if (item.function) {
              item.function();
            }
          };
          break;

        case "external":
          onPress = () => Linking.openURL(item.url);
          break;

        default:
          return null;
      }
    }

    return (
      <TouchableOpacity onPress={onPress} style={styles.itemContainer}>
        <Text style={styles.textStyle}>{item.name}</Text>
        <Icon name="chevron-forward" color={"#364c63"} size={20} />
      </TouchableOpacity>
    );
  };

  // List of screens and types
  let options = [
    {
      id: "profile",
      name: "Profile",
      type: "screen",
      screen: "Profile",
    },
    {
      id: "about-us",
      name: "About Us",
      type: "screen",
      screen: "About Us",
    },
    {
      id: "settings",
      name: "Account Settings",
      type: "screen",
      screen: "Settings",
    },
    {
      id: "sign-up",
      name: "Sign Up",
      type: "screen",
      screen: "Signup",
    },
    {
      id: "log-in",
      name: "Log In",
      type: "screen",
      screen: "Login",
    },
    {
      id: "privacy-statement",
      name: "Privacy Statement",
      type: "external",
      url: "https://www.108yogaroad.com/privacy-statement",
    },
    {
      id: "log-out",
      name: "Log Out",
      type: "function",
      function: async () => {
        setShowLogoutPopup(true);
        await new Promise((resolve) => setTimeout(resolve, 2000)); // timeout before navigating to home

        updateConfig(NULL_USER);
        clearLog();
        navigation.navigate("Home");
      },
    },
  ];

  return (
    <View style={styles.screen}>
      <FlatList
        data={options}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ItemSeparatorComponent={<Divider style={styles.divider} />}
        style={styles.flatList}
      />

      {showSettingsPopup && (
        <PopupMessage
          message="Please log in to access this feature"
          setShowPopup={setShowSettingsPopup}
        />
      )}

      {showLogoutPopup && (
        <PopupMessage message="Logging out" setShowPopup={setShowLogoutPopup} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "white",
  },
  flatList: {
    flex: 1,
    backgroundColor: "white",
  },
  textStyle: {
    color: "black",
    fontSize: 24,
  },
  itemContainer: {
    backgroundColor: "transparent",
    height: 70,
    marginHorizontal: 20,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    width: "100%",
  },
});

export default More;
