import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";

const Poses = ({ navigation, route }) => {
  const { yogaPoses } = route.params;
  const handleCardPress = (pose) => {
    navigation.navigate("Pose Details", { pose });
  };

  const renderCard = ({ item }) => {
    const { Title, Type, Mood, Difficulty } = item;

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => handleCardPress(item)}
      >
        <View style={styles.cardTopHalf}>
          <Text style={styles.sectionText}>{Title}</Text>
        </View>
        <View style={styles.cardBottomHalf}>
          <Text>Type: {Type}</Text>
          <Text>Mood: {Mood}</Text>
          <Text>Difficulty: {Difficulty}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={yogaPoses}
        renderItem={renderCard}
        numColumns={2}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.flatListContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F3EF",
    padding: 10,
  },
  flatListContent: {
    alignItems: "center",
  },
  card: {
    flexDirection: "column", // Arrange sections vertically
    backgroundColor: "pink",
    margin: 5,
    padding: 0,
    borderRadius: 8,
    width: "47.5%",
    height: 200, // Fixed height for the card
    justifyContent: "flex-start",
    alignItems: "stretch",
    elevation: 3, // For Android shadow
    shadowColor: "#000", // For iOS shadow
    shadowOpacity: 0.3, // For iOS shadow
    shadowOffset: { width: 0, height: 1 }, // For iOS shadow
    shadowRadius: 2, // For iOS shadow
  },
  cardTopHalf: {
    flex: 0.5,
    backgroundColor: "#FFB6C1", // Dark pink background for top half
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    justifyContent: "flex-start",
  },
  cardBottomHalf: {
    flex: 1,
    backgroundColor: "#FFD8E6", // Light pink background for bottom half
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    justifyContent: "flex-start",
    alignItems: "centre",
  },
  sectionText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#181718", // Black text color
  },
});

export default Poses;
