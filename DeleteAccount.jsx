import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

// In Wix Velo it is not possible to delete an account as that
// requires Admin access to manage all accounts.
// As a compromises this page instructs the user to contact the company
// so that their account can be deleted.
const DeleteAccount = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>
        To delete your account, please contact this email address:
      </Text>
      <View style={styles.emailContainer}>
        <Icon name="envelope" size={24} color="black" style={styles.icon} />
        <Text style={styles.email}>hello@108yogaroad.com</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: 330,
  },
  heading: {
    fontSize: 24,
    marginBottom: 20,
  },
  emailContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 10,
  },
  email: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default DeleteAccount;
