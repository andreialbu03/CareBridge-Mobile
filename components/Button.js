import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

function Button({ title, onPress, color = "#000000" }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.button}>
      <Text style={[styles.text, { color }]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#3549ff",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  text: {
    fontSize: 16,
  },
});

export default Button;
