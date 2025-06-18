import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

type Props = {
  dataInicio: string;
  procedimento: string;
  profissional: string;
  especialidade: string;
  onEdit: () => void;
};

export default function AppointmentCard({
  dataInicio,
  procedimento,
  profissional,
  especialidade,
  onEdit,
}: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.content}>
        <Text style={styles.time}>{dataInicio}</Text>
        <Text style={styles.label}>
          {(especialidade || "Especialidade").toUpperCase()} -{" "}
          {(profissional || "Profissional").toUpperCase()}
        </Text>
        <Text style={styles.procedimento}>
          {(procedimento || "Procedimento").toUpperCase()}
        </Text>
      </View>
      <TouchableOpacity onPress={onEdit} style={styles.editButton}>
        <Text style={styles.edit}>Editar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  content: {
    flex: 1,
    paddingRight: 12,
  },
  time: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
    color: "#111",
  },
  label: {
    color: "#333",
    fontSize: 13,
    marginBottom: 2,
    fontWeight: "600",
  },
  procedimento: {
    color: "#444",
    fontSize: 13,
    fontStyle: "italic",
  },
  editButton: {
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 12,
  },
  edit: {
    color: "#0066CC",
    fontWeight: "600",
  },
});
