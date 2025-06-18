import { useRouter } from "expo-router";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { SafeAreaView } from "react-native-safe-area-context";
import { Alert, Image, StyleSheet, Text } from "react-native";
import { View } from "./Themed";
import { MaterialIcons } from "@expo/vector-icons";
import { useAuth } from "@/src/context/AuthContext"; // ✅ Importa o contexto

export default function Sidebar() {
  const router = useRouter();
  const { pessoa } = useAuth(); // ✅ Acessa os dados do usuário

  const handleLogout = () => {
    Alert.alert("Sair", "Tem certeza que deseja sair?", [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: "Sair",
        style: "destructive",
        onPress: () => {
          router.replace("/initial");
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Image
            source={require("../assets/images/avatar-placeholder.png")}
            style={styles.avatar}
          />
        </View>
        <Text style={styles.name}>
          {pessoa?.NOMEPESSOA ?? "Usuário"}
        </Text>
        <Text style={styles.cpf}>
          CPF: {pessoa?.CPFPESSOA ?? "N/A"}
        </Text>
      </View>

      <View style={styles.divider} />
      <DrawerContentScrollView style={styles.items}>
        <DrawerItem
          label="Agendamentos"
          onPress={() => router.push("/Agenda")}
          labelStyle={styles.menuLabel}
          icon={({ size }) => (
            <Image
              source={require("../assets/images/calendar.png")}
              style={{ width: size, height: size, tintColor: "#fff" }}
            />
          )}
        />
        <DrawerItem
          label="Solicitações"
          onPress={() => router.push("/Solicitacoes")}
          labelStyle={styles.menuLabel}
          icon={({ size }) => (
            <Image
              source={require("../assets/images/solicitacoes.png")}
              style={{ width: size, height: size, tintColor: "#fff" }}
            />
          )}
        />
        <DrawerItem
          label="Sair"
          onPress={handleLogout}
          labelStyle={[styles.menuLabel, { color: "#FF8688" }]}
          icon={({ size }) => (
            <MaterialIcons name="logout" size={size} color="#FF8688" />
          )}
        />
      </DrawerContentScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#029046",
  },
  header: {
    alignItems: "center",
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  avatarContainer: {
    backgroundColor: "#E6DBFF",
    borderRadius: 40,
    padding: 8,
    marginBottom: 12,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  items: {
    marginTop: -16,
  },
  name: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  cpf: {
    color: "#fff",
    fontSize: 14,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.5)",
    marginHorizontal: 16,
  },
  menuLabel: {
    color: "#fff",
    fontSize: 18,
  },
});
