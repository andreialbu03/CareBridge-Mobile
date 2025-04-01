import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import Markdown from "react-native-markdown-display";
import * as Speech from "expo-speech";

// ResultScreen component
const ResultScreen = ({ results, handleReset }) => {
  const textractResults = results;
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Function to handle text-to-speech
  const speakText = async () => {
    // If already speaking, stop it
    if (isSpeaking) {
      await Speech.stop();
      setIsSpeaking(false);
      return;
    }

    // Convert markdown to plain text (basic approach)
    const plainText =
      typeof textractResults === "string"
        ? textractResults.replace(/\*\*(.*?)\*\*/g, "$1").replace(/\#\s/g, "")
        : "No text to read";

    setIsSpeaking(true);

    try {
      await Speech.speak(plainText, {
        language: "en-US",
        pitch: 1.0,
        rate: 0.8,
        onDone: () => setIsSpeaking(false),
        onError: (error) => {
          setIsSpeaking(false);
          Alert.alert("Speech Error", "Failed to read text");
          console.error(error);
        },
      });
    } catch (error) {
      setIsSpeaking(false);
      Alert.alert("Speech Error", "Failed to read text");
      console.error(error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Document Analysis Results</Text>
      </View>

      <View style={styles.resultContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            Interpreted Medical Information:
          </Text>
          <TouchableOpacity style={styles.speakButton} onPress={speakText}>
            <Text style={styles.speakButtonText}>
              {isSpeaking ? "Stop" : "Speak"}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.textContent}>
          <Markdown style={styles.markdownStyles}>{textractResults}</Markdown>
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

      {/* Disclaimer */}
      <View style={styles.disclaimerContainer}>
        <Text style={styles.disclaimerText}>
          Disclaimer: This tool provides automated medical interpretations for
          informational purposes only. It is not a substitute for professional
          advice, diagnosis, or treatment. Always consult a qualified healthcare
          provider for accurate guidance.
        </Text>
      </View>

      {/* Add a button at the bottom */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.backButton} onPress={handleReset}>
          <Text style={styles.backButtonText}>Process Another Document</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

// Styles
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
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    flex: 1,
  },
  speakButton: {
    backgroundColor: "#4062FF",
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginLeft: 10,
  },
  speakButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  textContent: {
    backgroundColor: "#f9f9f9",
    padding: 12,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#eee",
  },
  markdownStyles: {
    body: {
      fontSize: 14,
      lineHeight: 22,
      color: "#333",
    },
    heading1: {
      fontSize: 20,
      fontWeight: "bold",
      marginVertical: 10,
    },
    heading2: {
      fontSize: 18,
      fontWeight: "bold",
      marginVertical: 8,
    },
    heading3: {
      fontSize: 16,
      fontWeight: "bold",
      marginVertical: 6,
    },
    list_item: {
      marginVertical: 4,
    },
    paragraph: {
      marginVertical: 8,
    },
    strong: {
      fontWeight: "bold",
    },
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
  buttonContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
    paddingBottom: 20,
  },
  backButton: {
    backgroundColor: "#4062FF",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
    width: 250,
  },
  backButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});

export default ResultScreen;
