import React from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import { useAppConfig } from "../Config/AppConfig";
import { brandColors } from "../Theme/BrandColors";

const Profile = () => {
  const { appConfig } = useAppConfig();

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.titleText}>User Profile</Text>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Username:</Text>
        <Text style={styles.value}>{appConfig.user.email}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Name:</Text>
        <Text style={styles.value}>{appConfig.user.name}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: brandColors.light,
  },
  titleText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "black",
  },
  infoContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
  },
  value: {
    fontSize: 16,
    color: "black",
  },
});

export default Profile;
