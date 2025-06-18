import React from "react";
import {
  SafeAreaView,
  View,
  Image,
  Text,
  StyleSheet,
  Pressable,
} from "react-native";
import { useRouter } from "expo-router";
import { colors } from "../constants/Colors";

export default function InitialScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require("../assets/images/logo-fasiclin.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Agenda FASIPE</Text>
      </View>

      <View style={styles.buttons}>
        <Pressable
          style={[styles.button, styles.buttonPrimary]}
          onPress={() => router.push("/login")}
        >
          <Text style={[styles.buttonText, styles.primaryText]}>Entrar</Text>
        </Pressable>
        {/* <Pressable
          style={[styles.button, styles.buttonSecondary]}
          onPress={() => router.push("/register")}
        >
          <Text style={[styles.buttonText, styles.secondaryText]}>
            Registre-se
          </Text>
        </Pressable> */}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "space-between",
  },
  logoContainer: { alignItems: "center", marginTop: 80 },
  logo: { width: 200, height: 80 },
  title: { fontSize: 40, marginTop: 76, color: "#000" },
  buttons: { marginBottom: 40, paddingHorizontal: 20 },
  button: {
    height: 70,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 6,
  },
  buttonPrimary: { backgroundColor: colors.primary, marginBottom: 100 },
  buttonSecondary: { backgroundColor: colors.lightGreen, marginBottom: 50 },
  buttonText: { fontSize: 20, fontWeight: "600" },
  primaryText: { color: "#fff" },
  secondaryText: { color: colors.primary },
});
