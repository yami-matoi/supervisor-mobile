// src/screens/Solicitacoes.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Modal,
  TouchableOpacity,
  Alert,
} from "react-native";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import Header from "../components/Header"; // seu header com menu e logo
import { SafeAreaView } from "react-native-safe-area-context";
import api from "../src/services/api"; // supondo que seu Axios está configurado em src/services/api.ts

// 1) Adicionamos eventId ao modelo para referenciar o agendamento correspondente:
type Solicitation = {
  id: string;
  eventId: string; // <-- ID do agendamento que queremos deletar
  type: "change" | "cancel";
  oldDate: string;
  oldFrom: string;
  oldTo: string;
  newDate?: string;
  newFrom?: string;
  newTo?: string;
  client: string;
  description: string;
};

// 2) Mock inicial (em produção, você viria da API ou DB)
const INITIAL_MOCK: Solicitation[] = [
  {
    id: "1",
    eventId: "6", // supondo que o agendamento 2 exista na tabela agenda
    type: "change",
    oldDate: "2025-06-05",
    oldFrom: "08:07",
    oldTo: "08:57",
    newDate: "2025-06-05",
    newFrom: "14:00",
    newTo: "15:00",
    client: "João Francisco",
    description:
      "COLETA DE SANGUE PARA HEMOGRAMA COMPLETO com FISIOTERAPIA  - LUCAS SANTOS ANDRADE",
  },
  {
    id: "2",
    eventId: "9", // supondo que o agendamento 3 exista na tabela agenda
    type: "cancel",
    oldDate: "2025-06-23",
    oldFrom: "16:00",
    oldTo: "16:30",
    client: "Gabriel Pereira",
    description: "INTERVENÇÃO EM CRISES com PSICOLOGIA – JOÃO GUILHERME LEMES",
  },
];

export default function Solicitacoes() {
  const [list, setList] = useState<Solicitation[]>(INITIAL_MOCK);
  const [modalVisible, setModalVisible] = useState(false);
  const [selected, setSelected] = useState<Solicitation | null>(null);

  const open = (item: Solicitation) => {
    setSelected(item);
    setModalVisible(true);
  };
  const close = () => {
    setModalVisible(false);
    setSelected(null);
  };

  const formatDate = (iso: string) =>
    format(parseISO(iso), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });

  // Handler unificado para remover a solicitação do estado local
  const removeSolicitation = (solicId: string) => {
    setList((prev) => prev.filter((item) => item.id !== solicId));
  };

  // 1) Cancelamento de evento: deleta agenda e remove solicitação
  const handleCancelSolicitation = () => {
    if (!selected) return;
    Alert.alert(
      "Remover Solicitação",
      "Deseja realmente remover esta solicitação e o agendamento associado?",
      [
        { text: "Não", style: "cancel" },
        {
          text: "Sim",
          style: "destructive",
          onPress: () => {
            api
              .delete(`/agenda/${selected.eventId}`)
              .then(() => {
                removeSolicitation(selected.id);
                close();
                Alert.alert("Sucesso", "Solicitação e agendamento removidos.");
              })
              .catch((err) => {
                console.error("Erro ao excluir agendamento:", err);
                Alert.alert(
                  "Falha",
                  "Não foi possível remover o agendamento. Tente novamente."
                );
              });
          },
        },
      ]
    );
  };

  // 2) Aprovar alteração: atualiza agenda e remove solicitação
  const handleApproveChange = () => {
    if (!selected) return;

    // Valida campos newDate, newFrom, newTo
    if (!selected.newDate || !selected.newFrom || !selected.newTo) {
      Alert.alert("Erro", "Dados de nova data/hora estão incompletos.");
      return;
    }

    // Monta data_inicio ISO (YYYY-MM-DDThh:mm:00.000Z)
    const inicioISO = `${selected.newDate}T${selected.newFrom}:00.000Z`;

    // Monta data_fim ISO (YYYY-MM-DDThh:mm:00.000Z)
    const fimISO = `${selected.newDate}T${selected.newTo}:00.000Z`;

    const payload = {
      data_inicio: inicioISO,
      data_fim: fimISO,
      // Se necessário, incluir ag_profissional_id ou id_procedimento aqui
    };

    api
      .put(`/agenda/${selected.eventId}`, payload)
      .then(() => {
        removeSolicitation(selected.id);
        close();
        Alert.alert("Sucesso", "Evento atualizado com sucesso.");
      })
      .catch((err) => {
        console.error("Erro ao alterar o agendamento:", err);
        Alert.alert(
          "Falha",
          "Não foi possível atualizar o agendamento. Tente novamente."
        );
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.flex}>
        <Header />
        <Text style={styles.title}>SOLICITAÇÕES</Text>

        <FlatList
          data={list}
          keyExtractor={(i) => i.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <Pressable style={styles.card} onPress={() => open(item)}>
              <Text style={styles.cardHeader}>
                {formatDate(item.oldDate)} {"›"} {item.oldFrom} - {item.oldTo}
              </Text>
              <Text style={styles.cardBody}>
                {item.type === "change"
                  ? "Alteração de Data/Hora"
                  : "Cancelamento de Evento"}
              </Text>
              <Text style={styles.cardDots}>⋯</Text>
            </Pressable>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              Não há solicitações no momento.
            </Text>
          }
        />

        {selected && (
          <Modal
            visible={modalVisible}
            animationType="slide"
            transparent
            onRequestClose={close}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modal}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>
                    {selected.type === "change"
                      ? "Alteração de Data/Hora"
                      : "Cancelamento de Evento"}
                  </Text>
                  <TouchableOpacity onPress={close}>
                    <Text style={styles.modalClose}>✕</Text>
                  </TouchableOpacity>
                </View>

                {selected.type === "change" ? (
                  <>
                    {/* Exibe data antiga (vermelho) */}
                    <View style={styles.modalRow}>
                      <Text style={styles.modalLabel}>📅</Text>
                      <Text style={styles.modalText}>
                        <Text style={styles.oldText}>
                          {formatDate(selected.oldDate)}{" "}
                        </Text>
                        <Text>› </Text>
                        <Text style={styles.oldText}>
                          {selected.oldFrom} - {selected.oldTo}
                        </Text>
                      </Text>
                    </View>

                    {/* Exibe data nova (verde) */}
                    <View style={styles.modalRow}>
                      <Text style={styles.modalLabel}>📅</Text>
                      <Text style={styles.modalText}>
                        <Text style={styles.newText}>
                          {formatDate(selected.newDate!)}{" "}
                        </Text>
                        <Text>› </Text>
                        <Text style={styles.newText}>
                          {selected.newFrom} - {selected.newTo}
                        </Text>
                      </Text>
                    </View>
                  </>
                ) : (
                  /* Exibe apenas a data antiga (cancel) */
                  <View style={styles.modalRow}>
                    <Text style={styles.modalLabel}>📅</Text>
                    <Text style={styles.modalText}>
                      {formatDate(selected.oldDate)} › {selected.oldFrom} -{" "}
                      {selected.oldTo}
                    </Text>
                  </View>
                )}

                {/* Cliente */}
                <View style={styles.modalRow}>
                  <Text style={styles.modalLabel}>👤</Text>
                  <Text style={styles.modalText}>{selected.client}</Text>
                </View>
                {/* Descrição */}
                <View style={styles.modalRow}>
                  <Text style={styles.modalLabel}>❗️</Text>
                  <Text style={styles.modalText}>{selected.description}</Text>
                </View>

                {/* Botões de ação */}
                {selected.type === "change" ? (
                  <View style={styles.modalActions}>
                    <Pressable
                      style={[styles.button, styles.cancelButton]}
                      onPress={handleCancelSolicitation}
                    >
                      <Text style={styles.cancelText}>Cancelar</Text>
                    </Pressable>
                    <Pressable
                      style={[styles.button, styles.approveButton]}
                      onPress={handleApproveChange}
                    >
                      <Text style={styles.approveText}>Aprovar</Text>
                    </Pressable>
                  </View>
                ) : (
                  <View style={styles.modalActions}>
                    <Pressable
                      style={[styles.button, styles.cancelButton]}
                      onPress={handleCancelSolicitation}
                    >
                      <Text style={styles.cancelText}>Cancelado</Text>
                    </Pressable>
                  </View>
                )}
              </View>
            </View>
          </Modal>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },
  flex: { flex: 1, backgroundColor: "#FFF" },
  title: {
    marginTop: 8,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
  },
  list: { padding: 16 },
  emptyText: {
    textAlign: "center",
    color: "#666",
    marginTop: 32,
    fontSize: 16,
  },
  card: {
    backgroundColor: "#F7F7F7",
    borderRadius: 6,
    marginBottom: 12,
    padding: 12,
    position: "relative",
    borderWidth: 1,
    borderColor: "#DDD",
  },
  cardHeader: {
    fontSize: 12,
    color: "#444",
    marginBottom: 4,
  },
  cardBody: {
    fontSize: 16,
    fontWeight: "600",
  },
  cardDots: {
    position: "absolute",
    right: 12,
    top: 12,
    fontSize: 18,
    color: "#999",
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    padding: 24,
  },
  modal: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    elevation: 4,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  modalTitle: { fontSize: 18, fontWeight: "700" },
  modalClose: { fontSize: 20, color: "#666" },

  modalRow: { flexDirection: "row", alignItems: "center", marginVertical: 4 },
  modalLabel: { width: 24, fontSize: 16 },
  modalText: { flex: 1, fontSize: 14, color: "#333" },

  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  button: {
    flex: 1,
    height: 44,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#C0392B",
    marginRight: 8,
  },
  approveButton: {
    backgroundColor: "#27AE60",
  },
  cancelText: { color: "#FFF", fontWeight: "600" },
  approveText: { color: "#FFF", fontWeight: "600" },
  oldText: {
    color: "#C0392B",
    fontWeight: "600",
  },
  newText: {
    color: "#27AE60",
    fontWeight: "600",
  },
});
