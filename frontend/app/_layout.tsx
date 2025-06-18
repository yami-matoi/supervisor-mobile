// app/_layout.tsx
import React from "react";
import { Drawer } from "expo-router/drawer";
import Sidebar from "../components/Sidebar";
import { AuthProvider } from "@/src/context/AuthContext"; // ajuste o caminho conforme necessário

export default function RootLayout() {
  return (
     <AuthProvider>
    <Drawer
      drawerContent={() => <Sidebar />}
      screenOptions={{ headerShown: false }}
    >
      <Drawer.Screen name="initial" options={{ title: "Inicial" }} />
      <Drawer.Screen name="login" options={{ title: "Login" }} />
      <Drawer.Screen name="register" options={{ title: "Cadastro" }} />
      <Drawer.Screen name="Agenda" options={{ title: "Agendamentos" }} />
      <Drawer.Screen name="Solicitacoes" options={{ title: "Solicitações" }} />
    </Drawer></AuthProvider>
  );
}
