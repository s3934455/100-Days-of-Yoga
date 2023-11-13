import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import SearchModal from "./SearchModal";
import { useYogaDataContext } from "../Providers/YogaDataProvider";
import YogaCard from "./HelperComponents/YogaCard";
import { useNavigation } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

const HomeScreen = () => {
  const { yogaData } = useYogaDataContext();
  const [isHomeSearchModalVisible, setHomeSearchModalVisible] = useState(false);
  const [filteredPoses, setFilteredPoses] = useState([]);
  const [isFilterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState([]);
  const [selectedPoseTypes, setSelectedPoseTypes] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [isSearchVisible, setSearchVisible] = useState(false);
  const [isSearchModalVisible, setSearchModalVisible] = useState(false);
  const [selectedPose, setSelectedPose] = useState(null);
  const [filtersApplied, setFiltersApplied] = useState(false);
  const [filtersAppliedInHome, setFiltersAppliedInHome] = useState(false);
  const [searchedFromHome, setSearchedFromHome] = useState(false);
  const navigation = useNavigation();
  const Stack = createStackNavigator();

  const toggleHomeSearchModal = () => {
    setHomeSearchModalVisible(!isHomeSearchModalVisible);
  };
  const handleHomeCancelSearch = () => {
    setSearchText("");
    setFilteredPoses(yogaData);
    setHomeSearchModalVisible(false);
    setFiltersAppliedInHome(true);
    setFiltersApplied(false);
  };
  const handleHomeSearch = (query, searchCriteria) => {
    if (typeof query === "string") {
      const filteredPoses = yogaData.filter((pose) => {
        const matchesTitle =
          pose.title && pose.title.toLowerCase().includes(query.toLowerCase());
        return matchesTitle;
      });

      if (filteredPoses.length === 1) {
        const selectedPose = filteredPoses[0];

        navigation.navigate("All Poses", {
          filteredPoses,
          filtersAppliedInHome,
          selectedPoseTitle: selectedPose.title,
        });
      } else {
      }
    }
  };

  const handleHomeSuggestionPress = (selectedPose) => {
    setSelectedPose(selectedPose);
    const filteredPoses = yogaData.filter(
      (pose) => pose.title === selectedPose.title
    );
    setFilteredPoses(filteredPoses);
    setSearchModalVisible(false);
    setFiltersApplied(false);
    setSearchedFromHome(true);
    const filtersAppliedInHome = filteredPoses.length > 0;
    setFiltersAppliedInHome(filtersAppliedInHome);
    navigation.navigate("All Poses", {
      filteredPoses,
      filtersAppliedInHome,
      selectedPoseTitle: selectedPose.title,
    });
    toggleHomeSearchModal();
  };
  useEffect(() => {
    if (searchText) {
      handleHomeSearch(searchText);
    } else {
      setFilteredPoses(yogaData);
    }
  }, [searchText, yogaData]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}></View>
        <TouchableOpacity onPress={toggleHomeSearchModal}>
          <Icon name="search-outline" color="black" size={26} />
        </TouchableOpacity>
      </View>

      {isHomeSearchModalVisible && (
        <Modal
          isVisible={true}
          animationIn="slideInRight"
          animationOut="slideOutRight"
          transparent={true}
          onRequestClose={() => toggleHomeSearchModal()}
          style={styles.modal}
        >
          <SearchModal
            visible={isHomeSearchModalVisible}
            onClose={() => toggleHomeSearchModal()}
            onSearch={(query) => handleHomeSearch(query)}
            onSuggestionPress={(selectedPose) =>
              handleHomeSuggestionPress(selectedPose)
            }
            onCancel={handleHomeCancelSearch}
            navigation={navigation}
            filtersApplied={filtersApplied}
          />
        </Modal>
      )}

      {filtersApplied && (
        <FlatList
          data={filteredPoses}
          renderItem={({ item }) => {
            return <YogaCard navigation={navigation} item={item} />;
          }}
          keyExtractor={(item, index) => index.toString()}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 15,
  },
  searchButton: {
    marginLeft: 16,
  },
});

export default HomeScreen;
