// app/not-found.tsx
import React from "react";
import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";

export default function NotFound() {
  const router = useRouter();
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>404 - Página não encontrada</Text>
      <Pressable onPress={() => router.push("/initial")}>
        <Text>Voltar</Text>
      </Pressable>
    </View>
  );
}
