import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
  FlatList,
} from "react-native";
import Modal from "react-native-modal";
import Icon from "react-native-vector-icons/Ionicons";
import { useYogaDataContext } from "../Providers/YogaDataProvider";

const SearchModal = ({
  visible,
  onClose,
  onSearch,
  onSuggestionPress,
  onCancel,
  navigation,
}) => {
  const { yogaData } = useYogaDataContext();
  const [searchText, setSearchText] = useState("");
  const [recentSearches, setRecentSearches] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [hasSearchResults, setHasSearchResults] = useState(true);
  const fields = ["title", "difficulty", "mood", "type", "sanskritName"];

  const handleSearch = () => {
    const searchTextString = String(searchText);
    if (searchTextString.trim() !== "") {
      setRecentSearches([searchTextString, ...recentSearches.slice(0, 4)]);
      onSearch(searchTextString);
      onClose();
    }
  };

  const handleRecentSearch = (query) => {
    setSearchText(query);
    onSearch(query);
    onClose();
  };

  const handleSuggestionPress = (item) => {
    setSearchText("");
    setSuggestions([]);
    onSuggestionPress(item);
  };
  const fetchAndFilterSuggestions = async (text) => {
    try {
      if (!text || typeof text !== "string") {
        setSuggestions([]);
        setHasSearchResults(true);
        return;
      }
      const data = yogaData;
      const filteredSuggestions = data.filter((item) =>
        fields.some(
          (field) =>
            item[field] &&
            item[field].toLowerCase().includes(text.toLowerCase())
        )
      );

      setSuggestions(filteredSuggestions);
      setHasSearchResults(filteredSuggestions.length > 0);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  const handleCancel = () => {
    onCancel();
  };

  useEffect(() => {
    if (searchText) {
      fetchAndFilterSuggestions(searchText);
    } else {
      setSuggestions([]);
    }
  }, [searchText]);

  return (
    // <Modal
    //   isVisible={visible}
    //   animationIn="fadeIn"
    //   animationOut="fadeOut"
    //   onRequestClose={onClose}
    //   useNativeDriver={true}
    //   hideModalContentWhileAnimating={true}
    //   style={styles.modal}
    // >
    <View style={styles.overlay}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Icon name="search-outline" size={24} color="black" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for poses"
            value={searchText.toString()}
            onChangeText={(text) => setSearchText(text)}
            returnKeyType="search"
            onSubmitEditing={handleSearch}
          />
          <TouchableOpacity onPress={handleCancel} style={styles.searchIcon}>
            <Text style={styles.searchButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
        {!hasSearchResults && (
          <Text style={styles.noResultsText}>No Search Results Found</Text>
        )}
        {suggestions && suggestions.length > 0 && (
          <FlatList
            data={suggestions}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.suggestionItem}
                onPress={() => handleSuggestionPress(item)}
              >
                <Text style={styles.suggestionText}>
                  {fields
                    .filter((field) => item[field])
                    .map((field) => item[field])
                    .join(", ")}
                </Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item._id}
          />
        )}
      </View>
    </View>
    // </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    justifyContent: "flex-start",
  },
  overlay: {
    flex: 100,
    backgroundColor: "#F4F3EF",
  },
  container: {
    backgroundColor: "white",
    paddingTop: 64,
    paddingHorizontal: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    backgroundColor: "#F4F3EF",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginLeft: 10,
    height: 40,
  },
  searchIcon: {
    paddingHorizontal: 10,
  },
  searchButtonText: {
    color: "#007AFF",
    fontWeight: "bold",
    fontSize: 15,
  },
  recentSearches: {
    marginTop: 20,
  },
  recentSearchesTitle: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  recentSearchItem: {
    paddingVertical: 5,
  },
  suggestionItem: {
    paddingVertical: 14,
    paddingHorizontal: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  suggestionText: {
    color: "#333",
    fontSize: 18,
    lineHeight: 26,
  },
  noResultsText: {
    color: "#333",
    textAlign: "center",
    fontSize: 16,
    marginTop: 20,
  },
});

export default SearchModal;
