// app/register.tsx
import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Image,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "../constants/Colors";

export default function RegisterScreen() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [password, setPassword] = useState("");

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.back} onPress={() => router.back()}>
        <MaterialIcons name="arrow-back-ios" size={24} color={colors.text} />
      </TouchableOpacity>

      <Image
        source={require("../assets/images/logo-fasiclin.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.headerText}>
        Olá! Cadastre os seus dados{"\n"}para acessar o sistema!
      </Text>

      <View style={styles.form}>
        <Text style={styles.label}>Nome Completo</Text>
        <TextInput
          style={styles.input}
          placeholder="Insira seu nome completo"
          value={fullName}
          onChangeText={setFullName}
        />

        <Text style={[styles.label, { marginTop: 12 }]}>CPF</Text>
        <TextInput
          style={styles.input}
          placeholder="Insira seu CPF"
          keyboardType="numeric"
          value={cpf}
          onChangeText={setCpf}
        />

        <Text style={[styles.label, { marginTop: 12 }]}>E-mail</Text>
        <TextInput
          style={styles.input}
          placeholder="Insira seu e-mail"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={[styles.label, { marginTop: 12 }]}>
          Número com WhatsApp{" "}
          <Image
            source={require("../assets/images/whatsapp-icon.png")}
            style={styles.icon}
            resizeMode="contain"
          />
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Insira seu número"
          keyboardType="phone-pad"
          value={whatsapp}
          onChangeText={setWhatsapp}
        />

        <Text style={[styles.label, { marginTop: 12 }]}>Senha</Text>
        <TextInput
          style={[styles.input, { marginBottom: 8 }]}
          placeholder="Insira sua senha"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <Pressable
          style={[styles.button, styles.secondary]}
          onPress={() => router.navigate("/login")}
        >
          <Text style={[styles.buttonText, styles.secondaryText]}>
            Registre-se
          </Text>
        </Pressable>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Já possui uma conta?
          <Text style={styles.link} onPress={() => router.push("/login")}>
            {" "}
            Entre agora!
          </Text>
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  back: { height: 40, justifyContent: "center" },
  logo: { width: 200, height: 80, alignSelf: "center", marginTop: 8 },
  headerText: {
    fontSize: 20,
    textAlign: "center",
    marginVertical: 20,
    color: colors.text,
    fontWeight: "bold",
  },
  form: { flex: 1 },
  label: { fontSize: 14, color: colors.text },
  input: {
    height: 48,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    marginTop: 4,
  },
  icon: {
    height: 20,
    position: "absolute",
  },
  button: {
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
  },
  primary: { backgroundColor: colors.primary },
  secondary: { backgroundColor: colors.lightGreen },
  buttonText: { fontSize: 16, fontWeight: "600" },
  primaryText: { color: "#fff" },
  secondaryText: { color: colors.primary },
  footer: { paddingVertical: 16, alignItems: "center", paddingBottom: 50 },
  footerText: { fontSize: 16, color: colors.text },
  link: { color: colors.primary, fontWeight: "600" },
});
