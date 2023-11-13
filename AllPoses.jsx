import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Text,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import FilterOptions from "./FilterOptions";
import { useYogaDataContext } from "../Providers/YogaDataProvider";
import YogaCard from "./HelperComponents/YogaCard";
import SearchModal from "./SearchModal";
import { useAppConfig } from "../Config/AppConfig";
import LoginRequiredMessage from "./HelperComponents/LoginRequired";

const AllPoses = ({ navigation, route }) => {
  // A react context is useed to handle the yogadata.
  const { yogaData } = useYogaDataContext();

  // App config contains user details and functions to update parts
  //of the app.
  const { appConfig, updateLog } = useAppConfig();

  // These states are used for the searching and filtering functions.
  const [filteredPoses, setFilteredPoses] = useState([]);
  const [isFilterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState([]);
  const [selectedPoseTypes, setSelectedPoseTypes] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [isSearchVisible, setSearchVisible] = useState(false);
  const [isSearchModalVisible, setSearchModalVisible] = useState(false);
  const [selectedPose, setSelectedPose] = useState(null);
  const [selectedTitle, setSelectedPoseTitle] = useState(null);
  const [filtersApplied, setFiltersApplied] = useState(false);
  const filtersAppliedInHome = route.params?.filtersAppliedInHome || false;
  const [isHomeSearchModalVisible, setHomeSearchModalVisible] = useState(false);
  const [headerText, setHeaderText] = useState("All Poses");

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#F4F3EF",
      padding: 10,
    },
    flatListContent: {
      alignItems: "center",
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "center",
    },
    searchButton: {
      marginRight: 15,
    },

    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "center",
      alignItems: "center",
    },

    searchInput: {
      backgroundColor: "white",
      padding: 10,
      borderRadius: 5,
      marginTop: 10,
      marginBottom: 10,
      marginLeft: 15,
      marginRight: 15,
    },
  });
  const openSearch = () => {
    setSearchModalVisible(true);
  };

  const toggleFilterModal = () => {
    setFilterModalVisible(!isFilterModalVisible);
  };
  const toggleSearchModal = () => {
    setSearchModalVisible(!isSearchModalVisible);
  };

  // Handler that is called when filters are changed.
  const handleApplyFilters = (
    selectedDifficulty,
    selectedPoseTypes,
    selectAllPoses
  ) => {
    let filteredPoses = yogaData;

    if (selectAllPoses) {
      setSelectedDifficulty([]);
      setSelectedPoseTypes([]);
    } else {
      if (selectedDifficulty.length > 0) {
        filteredPoses = filteredPoses.filter((pose) =>
          selectedDifficulty.includes(pose.difficulty.toLowerCase())
        );
      }

      if (selectedPoseTypes.length > 0) {
        filteredPoses = filteredPoses.filter((pose) =>
          selectedPoseTypes.includes(pose.type.toLowerCase())
        );
      }
    }

    let newHeaderText = "";

    if (selectedDifficulty.length === 0 && selectedPoseTypes.length === 0) {
      setFilteredPoses(yogaData);
      newHeaderText = "All Poses";
    } else {
      setFilteredPoses(filteredPoses);

      if (selectedDifficulty) {
        newHeaderText =
          selectedDifficulty.charAt(0).toUpperCase() +
          selectedDifficulty.slice(1);
      }

      if (selectedPoseTypes.length > 0) {
        const poseTypeString = selectedPoseTypes.join(", ");
        newHeaderText +=
          " - " +
          poseTypeString.charAt(0).toUpperCase() +
          poseTypeString.slice(1);
      }
    }
    setHeaderText(newHeaderText);
    navigation.setOptions({
      headerTitle: newHeaderText,
    });

    setFilteredPoses(filteredPoses);
    setFilterModalVisible(false);
    setFiltersApplied(true);
  };

  // Handler for search
  const handleSearch = (query, searchCriteria) => {
    if (typeof query === "string") {
      const filteredPoses = yogaData.filter((pose) => {
        const matchesTitle =
          pose.title && pose.title.toLowerCase().includes(query.toLowerCase());
        const matchesSanskritName =
          pose.sanskritName &&
          pose.sanskritName.toLowerCase().includes(query.toLowerCase());
        const matchesDifficulty =
          pose.difficulty &&
          pose.difficulty.toLowerCase().includes(query.toLowerCase());
        const matchesType =
          pose.type && pose.type.toLowerCase().includes(query.toLowerCase());
        const matchesMoodType =
          pose.mood && pose.mood.toLowerCase().includes(query.toLowerCase());

        return (
          matchesTitle ||
          matchesSanskritName ||
          matchesDifficulty ||
          matchesType ||
          matchesMoodType
        );
      });

      setFilteredPoses(filteredPoses);
      setSearchModalVisible(false);
      setFiltersApplied(false);
      setHeaderText("All Poses");

      navigation.setOptions({
        headerTitle: "All Poses",
      });

      if (filteredPoses.length === 1) {
        setSelectedPose(filteredPoses[0]);
      } else {
        setSelectedPose(null);
      }
    }
  };

  // Handler for the auto complete functionality
  const handleSuggestionPress = (selectedPose) => {
    setSelectedPose(selectedPose);
    const filteredPoses = yogaData.filter(
      (pose) => pose.title === selectedPose.title
    );
    setFilteredPoses(filteredPoses);

    toggleSearchModal();
  };

  useEffect(() => {
    if (route.params && route.params.filteredPoses) {
      setFilteredPoses(route.params.filteredPoses);
    } else {
      setFilteredPoses(yogaData);
    }

    if (route.params && route.params.selectedPoseTitle) {
      const selectedPoseTitle = route.params.selectedPoseTitle;
      setHeaderText(selectedPoseTitle);
      setSelectedPose(
        yogaData.find((pose) => pose.title === selectedPoseTitle)
      );
    } else {
      setSelectedPose(null);
    }
  }, [route.params, yogaData]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={styles.searchButton}
          onPress={() => {
            setSearchVisible(true);
            setSearchModalVisible(true);
            openSearch();
          }}
        >
          <Icon name="search-outline" size={30} color="black" />
        </TouchableOpacity>
      ),
      headerTitle: selectedPose
        ? selectedPose.title
        : selectedTitle
        ? selectedPose.title
        : filtersApplied
        ? headerText
        : "All Poses",
      headerLeft: () => {
        if (
          selectedPose ||
          filtersApplied ||
          filtersAppliedInHome ||
          isHomeSearchModalVisible
        ) {
          return (
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => {
                setSelectedPose(null);
                setFiltersApplied(false);
                setFilteredPoses(yogaData);
                if (filtersAppliedInHome) {
                  navigation.navigate("All Poses");
                }
              }}
            >
              <Icon name="arrow-back" size={30} color="black" />
            </TouchableOpacity>
          );
        } else {
          return (
            <TouchableOpacity
              style={styles.filterButton}
              onPress={() => {
                setFilterModalVisible(true);
              }}
            >
              <Icon name="options-outline" size={40} color="black" />
            </TouchableOpacity>
          );
        }
      },
    });
  }, [
    selectedPose,
    filtersApplied,
    isSearchVisible,
    filtersAppliedInHome,
    isHomeSearchModalVisible,
  ]);

  useEffect(() => {
    updateLog();
  }, [appConfig.user.isLoggedIn]);

  const handleInputChange = (text) => {
    setSearchText(text);

    const filteredPoses = yogaData.filter((pose) =>
      pose.title.toLowerCase().includes(text.toLowerCase())
    );

    setFilteredPoses(filteredPoses);
  };

  const handleSearchAndFilter = (searchedDifficulty) => {
    setSearchModalVisible(false);
    setSelectedDifficulty(searchedDifficulty);

    const filtered = yogaData.filter(
      (pose) =>
        pose.difficulty.toLowerCase() === searchedDifficulty.toLowerCase()
    );

    setFilteredPoses(filtered);

    navigation.setOptions({
      headerTitle: searchedDifficulty,
    });
  };

  //Exits the search mode
  const handleCancelSearch = () => {
    setSearchText("");
    setFilteredPoses(yogaData);
    setSearchModalVisible(false);
  };

  return (
    <>
      {/* This page is only shown to users that are logged in */}
      {appConfig.user.isLoggedIn ? (
        <View style={styles.container}>
          <Modal
            visible={isFilterModalVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setFilterModalVisible(false)}
          >
            <FilterOptions
              visible={isFilterModalVisible}
              onClose={() => setFilterModalVisible(false)}
              onApplyFilters={(difficulty, poseTypes, selectAllPoses) =>
                handleApplyFilters(difficulty, poseTypes, selectAllPoses)
              }
            />
          </Modal>

          <FlatList
            data={filteredPoses.length > 0 ? filteredPoses : yogaData}
            renderItem={({ item }) => (
              <YogaCard navigation={navigation} item={item} />
            )}
            numColumns={2}
            keyExtractor={(item, index) => item._id}
            contentContainerStyle={styles.flatListContent}
            showsVerticalScrollIndicator={false}
          />
          {isSearchModalVisible && (
            <Modal
              isVisible={true}
              animationIn="slideInRight"
              animationOut="slideOutRight"
              transparent={true}
              onRequestClose={() => toggleSearchModal(false)}
              style={styles.modal}
            >
              <SearchModal
                visible={isSearchModalVisible}
                onClose={() => toggleSearchModal(false)}
                onSearch={handleSearch}
                onSuggestionPress={handleSuggestionPress}
                onCancel={handleCancelSearch}
                navigation={navigation}
              />
            </Modal>
          )}
        </View>
      ) : (
        <LoginRequiredMessage message="Please log in to access pose directory." />
      )}
    </>
  );
};

export default AllPoses;
