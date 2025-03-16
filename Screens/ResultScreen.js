// Screens/ResultsScreen.js
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";

const ResultScreen = ({ results, handleReset }) => {
  // Modify the component to use the results prop directly rather than route.params
  const textractResults = results;

  const extractText = (results) => {
    if (!results || !results.Blocks) {
      return "No text detected in the document.";
    }

    // Filter for LINE type blocks and sort by position (top to bottom, then left to right)
    const lines = results.Blocks.filter(
      (block) => block.BlockType === "LINE"
    ).sort((a, b) => {
      const aTop = a.Geometry?.BoundingBox?.Top || 0;
      const bTop = b.Geometry?.BoundingBox?.Top || 0;

      // If they're roughly on the same line (within 2% of page height)
      if (Math.abs(aTop - bTop) < 0.02) {
        // Sort by Left position (left to right)
        return (
          (a.Geometry?.BoundingBox?.Left || 0) -
          (b.Geometry?.BoundingBox?.Left || 0)
        );
      }

      // Otherwise sort by Top position (top to bottom)
      return aTop - bTop;
    });

    // Extract and join the text
    return lines.map((line) => line.Text).join("\n");
  };

  return (
    // <ScrollView>
    //   <View></View>
    //   <Text>Document Analysis Results</Text>
    // </ScrollView>
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Document Analysis Results</Text>
      </View>

      <View style={styles.resultContainer}>
        <Text style={styles.sectionTitle}>Extracted Text:</Text>
        <View style={styles.textContent}>
          <Text style={styles.contentText}>{extractText(textractResults)}</Text>
        </View>
      </View>

      {/* Show form data if available */}
      {textractResults?.Blocks?.some(
        (block) => block.BlockType === "KEY_VALUE_SET"
      ) && (
        <View style={styles.resultContainer}>
          <Text style={styles.sectionTitle}>Form Fields:</Text>
          <View style={styles.formContent}>
            {/* Complex form field extraction logic would go here */}
            <Text style={styles.infoText}>
              Form fields detected. Implementation of form field extraction
              requires additional processing.
            </Text>
          </View>
        </View>
      )}

      {/* Show table data if available */}
      {textractResults?.Blocks?.some(
        (block) => block.BlockType === "TABLE"
      ) && (
        <View style={styles.resultContainer}>
          <Text style={styles.sectionTitle}>Tables:</Text>
          <View style={styles.tableContent}>
            {/* Complex table extraction logic would go here */}
            <Text style={styles.infoText}>
              Tables detected. Implementation of table extraction requires
              additional processing.
            </Text>
          </View>
        </View>
      )}

      <View style={styles.disclaimerContainer}>
        <Text style={styles.disclaimerText}>
          This analysis is provided for informational purposes only. Please
          consult with a healthcare professional for any medical advice or
          decisions.
        </Text>
      </View>
      {/* Add a button at the bottom */}
      <TouchableOpacity style={styles.backButton} onPress={handleReset}>
        <Text style={styles.backButtonText}>Process Another Document</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    padding: 16,
    backgroundColor: "#4062FF",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  resultContainer: {
    margin: 16,
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    color: "#333",
  },
  textContent: {
    backgroundColor: "#f9f9f9",
    padding: 12,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#eee",
  },
  contentText: {
    fontSize: 14,
    lineHeight: 22,
    color: "#333",
  },
  formContent: {
    padding: 12,
  },
  tableContent: {
    padding: 12,
  },
  infoText: {
    fontSize: 14,
    color: "#666",
    fontStyle: "italic",
  },
  disclaimerContainer: {
    margin: 16,
    padding: 12,
    backgroundColor: "#fff8e1",
    borderRadius: 4,
    borderLeftWidth: 4,
    borderLeftColor: "#ffc107",
  },
  disclaimerText: {
    fontSize: 12,
    color: "#666",
    fontStyle: "italic",
  },
});

export default ResultScreen;
