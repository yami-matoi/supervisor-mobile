// src/components/DateHeader.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { parseISO, format } from "date-fns";
import { ptBR } from "date-fns/locale";

type Props = { dateString: string };

export default function DateHeader({ dateString }: Props) {
  const date = parseISO(dateString);
  const dayNumber = format(date, "d", { locale: ptBR });
  const dayAbbrev = format(date, "EEE", { locale: ptBR }).toUpperCase();

  return (
    <View style={styles.container}>
      <Text style={styles.number}>{dayNumber}</Text>
      <Text style={styles.abbrev}>{dayAbbrev}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginRight: 12,
    width: 55,
  },
  number: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#6C6C8A",
    lineHeight: 32,
  },
  abbrev: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6C6C8A",
  },
});
