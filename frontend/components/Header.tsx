// src/components/Header.tsx
import React from "react";
import { View, Image, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation, DrawerActions } from "@react-navigation/native";
import type { DrawerNavigationProp } from "@react-navigation/drawer";

type DrawerParamList = {
  Agenda: undefined;
  Solicitacoes: undefined;
};

export default function Header() {
  // aqui a tipagem DrawerNavigationProp garante que openDrawer() exista
  const navigation = useNavigation<DrawerNavigationProp<DrawerParamList>>();

  return (
    <View style={styles.container}>
      <MaterialIcons
        name="menu"
        size={36}
        style={styles.menuIcon}
        onPress={() => navigation.openDrawer()} // <— aqui agora funciona
      />

      <Image
        source={require("../assets/images/logo-fasiclin.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      <MaterialIcons
        name="calendar-today"
        size={24}
        style={styles.calendarIcon}
        onPress={() => {
          /* sua outra ação */
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 16,
    paddingBottom: 2,
    backgroundColor: "#fff",
  },
  menuIcon: {
    position: "absolute",
    left: 20,
    marginTop: 8,
    backgroundColor: "#029046",
    color: "#fff",
    borderRadius: 6,
  },
  logo: { width: 150, height: 60 },
  calendarIcon: { position: "absolute", right: 20, marginTop: 8 },
});
