import React from "react";
import { View, Text, StyleSheet, Platform } from "react-native";

export default function EditScreenInfo({ path }: { path: string }) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Open up <Text style={styles.highlight}>{path}</Text> to edit this screen
      </Text>
      {Platform.OS === "ios" && (
        <Text style={styles.helperText}>Press Cmd+R to reload</Text>
      )}
      {Platform.OS === "android" && (
        <Text style={styles.helperText}>
          Double tap R on your keyboard to reload
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center" },
  text: { fontSize: 14, color: "#888" },
  highlight: { fontWeight: "bold" },
  helperText: { marginTop: 8, fontSize: 12, color: "#888" },
});
