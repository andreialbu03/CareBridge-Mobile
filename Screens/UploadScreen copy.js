import { useState, useEffect } from "react";
import { View, StyleSheet, Image, Alert, Text } from "react-native";
import * as ImagePicker from "expo-image-picker";

import Button from "../components/Button.js";

function UploadScreen() {
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Sorry, we need camera roll permissions to make this work!"
        );
      }
    })();
  }, []);

  const pickImage = async () => {
    console.log("pickImage called");

    // Ensure permissions are granted before allowing the user to pick an image
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "Sorry, we need camera roll permissions to make this work!"
      );
      return;
    }

    // Launch the image picker
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // Fix this line
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log("ImagePicker result:", result);

    if (!result.canceled && result.assets.length > 0) {
      setSelectedImage(result.assets[0].uri); // Fix this line
      console.log(result.assets[0].uri);
    }
  };

  return (
    <View>
      <View>
        <Text>Welcome to CareBridge</Text>
      </View>
      <View style={styles.inputContainer}>
        {selectedImage && (
          <Image source={{ uri: selectedImage }} style={styles.image} />
        )}
        <Button title="Pick an image from camera roll" onPress={pickImage} />
        <View style={styles.buttonsContainer}>
          <View style={styles.buttonContainer}>
            <Button
              title="Confirm"
              onPress={() => {
                /* handle confirm action */
              }}
            />
          </View>
        </View>
      </View>
    </View>
  );
}

export default UploadScreen;

const styles = StyleSheet.create({
  inputContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 100,
    marginHorizontal: 24,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    shadowOpacity: 0.26,
  },
  image: {
    width: 200,
    height: 200,
    marginVertical: 8,
  },
  buttonsContainer: {
    flexDirection: "row",
  },
  buttonContainer: {
    flex: 0.5,
  },
});
