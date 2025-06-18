// app/_layout.tsx
import React from "react";
import { Drawer } from "expo-router/drawer";
import Sidebar from "../../components/Sidebar";

export default function RootLayout() {
  return (
    <Drawer
      drawerContent={() => <Sidebar />}
      screenOptions={{ headerShown: false }}
    >
      <Drawer.Screen name="initial" options={{ title: "Inicial" }} />
      <Drawer.Screen name="login" options={{ title: "Login" }} />
      <Drawer.Screen name="register" options={{ title: "Cadastro" }} />
      <Drawer.Screen name="Agenda" options={{ title: "Agendamentos" }} />
      <Drawer.Screen name="Solicitacoes" options={{ title: "Solicitações" }} />
    </Drawer>
  );
}
