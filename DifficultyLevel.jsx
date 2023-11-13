import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { getPosesByCriteria } from "../Services/PoseService";

// Example component that demonstrates how the difficulty
// filters are arranged.
// This is used to test changes to the difficulty level.
const DifficultyLevel = () => {
  const navigation = useNavigation();
  const Tab = createBottomTabNavigator();
  const Beginner = getPosesByCriteria({
    Difficulty: "beginner",
  });
  const Intermediate = getPosesByCriteria({
    Difficulty: "intermediate",
  });
  const Advanced = getPosesByCriteria({
    Difficulty: "advanced",
  });

  const Poses = () => {
    return (
      <Tab.Navigator>
        <Tab.Screen name="Poses" component={Poses} />
        <Tab.Screen name="Poses" component={Poses} />
        <Tab.Screen name="Poses" component={Poses} />
      </Tab.Navigator>
    );
  };

  const handleCardPress = (selectedDifficulty) => {
    if (selectedDifficulty === "Beginner") {
      navigation.navigate("Poses", { yogaPoses: Beginner });
    } else if (selectedDifficulty === "Intermediate") {
      navigation.navigate("Poses", { yogaPoses: Intermediate });
    } else {
      navigation.navigate("Poses", { yogaPoses: Advanced });
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.card}
        onPress={() => handleCardPress("Beginner")}
      >
        <Text style={styles.cardText}>Beginner</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.card}
        onPress={() => handleCardPress("Intermediate")}
      >
        <Text style={styles.cardText}>Intermediate</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.card}
        onPress={() => handleCardPress("Advanced")}
      >
        <Text style={styles.cardText}>Advanced</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "#FFB6C1",
    width: 300,
    height: 200,
    borderRadius: 20,
    marginBottom: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  cardText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
});

export default DifficultyLevel;
