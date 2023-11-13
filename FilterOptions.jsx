import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
const Checkbox = ({ label, checked, onChange }) => {
  return (
    <TouchableOpacity style={styles.checkboxContainer} onPress={onChange}>
      <Text style={styles.checkboxLabel}>
        {label.charAt(0).toUpperCase() + label.slice(1)}
      </Text>
      <View style={[styles.checkbox, checked && styles.checkedCheckbox]} />
    </TouchableOpacity>
  );
};
const windowHeight = Dimensions.get("window").height;

const modalContentHeight = windowHeight * 0.9; // 75% of the screen height

const FilterOptions = ({ visible, onClose, onApplyFilters }) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState([]);
  const [selectedPoseTypes, setSelectedPoseTypes] = useState([]);
  const [selectAllPoses, setSelectAllPoses] = useState(false);
  const isApplyButtonEnabled =
    selectedDifficulty.length > 0 || selectedPoseTypes.length > 0;
  const Difficulty = ["beginner", "intermediate", "advanced"];
  const Type = {
    beginner: [
      "seated",
      "balancing",
      "prone",
      "standing",
      "inversion",
      "supine",
      "kneeling",
    ],
    intermediate: [
      "seated",
      "balancing",
      "prone",
      "arm balancing",
      "standing",
      "inversion",
      "kneeling",
    ],
    advanced: ["balancing"],
  };

  const handleApplyFilters = () => {
    if (selectAllPoses) {
      setSelectedDifficulty([]);
      setSelectedPoseTypes([]); // Clear other selected pose types
    }
    onApplyFilters(selectedDifficulty, selectedPoseTypes, selectAllPoses);
    handleCloseModal();
  };

  const handleCloseModal = () => {
    setSelectedDifficulty([]);
    setSelectedPoseTypes([]);

    onClose();
  };

  return (
    <View style={styles.modalContainer}>
      <View style={[styles.modalContent, { height: modalContentHeight }]}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Icon name="close" size={25} color="#333" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.clearButton}
          onPress={() => {
            setSelectedDifficulty([]);
            setSelectedPoseTypes([]);
          }}
        >
          <Text style={styles.clearButtonText}>Clear</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Filter Options</Text>
        <ScrollView
          contentContainerStyle={styles.scrollViewContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Difficulty */}
          <Text style={styles.sectionTitle}>Difficulty</Text>
          {Difficulty.map((difficulty) => (
            <Checkbox
              key={difficulty}
              label={difficulty}
              checked={
                (selectAllPoses && selectedDifficulty.length === 0) ||
                selectedDifficulty === difficulty
              }
              onChange={() => {
                if (selectAllPoses) {
                  setSelectAllPoses(false);
                }
                setSelectedDifficulty(difficulty);
              }}
            />
          ))}

          {/* Pose Types based on selected Difficulty */}
          {selectedDifficulty.length > 0 && (
            <View>
              <Text style={styles.sectionTitle}>Pose Types </Text>
              {Type[selectedDifficulty]?.map((poseType) => (
                <Checkbox
                  key={poseType}
                  label={poseType}
                  checked={selectedPoseTypes.includes(poseType)}
                  onChange={() =>
                    setSelectedPoseTypes((prev) =>
                      prev.includes(poseType)
                        ? prev.filter((item) => item !== poseType)
                        : [...prev, poseType]
                    )
                  }
                />
              ))}
            </View>
          )}
        </ScrollView>

        {/* Apply and Close buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.applyButton,
              !isApplyButtonEnabled && styles.disabledButton,
            ]}
            onPress={handleApplyFilters}
            disabled={!isApplyButtonEnabled}
          >
            <Text style={styles.applyButtonText}>Apply Filters</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  scrollViewContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 30,
    marginBottom: 20,
    textAlign: "center",
    color: "#364c63",
  },
  sectionTitle: {
    fontSize: 25,
    fontWeight: "bold",
    marginTop: 50,
    marginBottom: 30,
    color: "#364c63",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    justifyContent: "space-between", // aligns to filter options to the right
  },
  checkbox: {
    width: 25,
    height: 25,
    borderWidth: 2,
    borderColor: "#364c63",
    borderRadius: 4,
    marginRight: 20,
  },
  checkedCheckbox: {
    backgroundColor: "#364c63",
  },
  checkboxLabel: {
    fontSize: 25,
    color: "#364c63",
  },
  buttonContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 40,
  },
  applyButton: {
    backgroundColor: "#364c63",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  applyButtonText: {
    color: "#fff",
    fontSize: 20,
  },
  disabledButton: {
    opacity: 0.4,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 40,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  closeButton: {
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 1,
  },
  clearButton: {
    position: "absolute",
    top: 20,
    left: 20,
    zIndex: 1,
    backgroundColor: "lightgray",
    borderRadius: 50,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  clearButtonText: {
    fontSize: 16,
    color: "black",
  },
});

export default FilterOptions;
