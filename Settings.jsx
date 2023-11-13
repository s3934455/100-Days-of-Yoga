import React from "react";
import {
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from "react-native";
import { Divider } from "react-native-elements";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

const Settings = () => {
  const navigation = useNavigation();

  const renderItem = ({ item }) => {
    let onPress;

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

    return (
      <TouchableOpacity onPress={onPress} style={styles.option}>
        <Text style={styles.optionText}>{item.name}</Text>
        <Icon name="chevron-forward" color={"#364c63"} size={20} />
      </TouchableOpacity>
    );
  };

  let options = [
    {
      id: "clear-data",
      name: "Clear My Data",
      type: "screen",
      screen: "Clear Data",
    },
    {
      id: "delete-account",
      name: "Delete My Account",
      type: "screen",
      screen: "DeleteAccount",
    },
  ];

  return (
    <FlatList
      data={options}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      ItemSeparatorComponent={<Divider style={styles.divider} />}
      style={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  option: {
    backgroundColor: "transparent",
    height: 70,
    marginHorizontal: 20,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  optionText: {
    color: "black",
    fontSize: 24,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    width: "100%",
  },
});

export default Settings;
