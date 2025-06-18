// ScheduleScreen.tsx atualizado para o novo modelo de dados
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  useWindowDimensions,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../components/Header";
import CalendarView from "../components/CalendarView";
import DateHeader from "../components/DateHeader";
import AppointmentCard from "../components/AppointmentCard";
import api from "../../frontend/src/services/api";
import EditAppointmentModal, {
  EditedEvent,
  Especialidade,
  ProcedimentoDTO,
  ProfissionalDTO,
} from "@/components/EditAppointmentModal";
import CreateAppointmentForm from "@/components/CreateAppointmentForm";

export default function ScheduleScreen() {
  const MAX_DOTS = 3;
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [eventos, setEventos] = useState<EditedEvent[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EditedEvent | null>(null);
  const [especialidades, setEspecialidades] = useState<Especialidade[]>([]);
  const [procedimentos, setProcedimentos] = useState<ProcedimentoDTO[]>([]);
  const [profissionais, setProfissionais] = useState<ProfissionalDTO[]>([]);
  const { width } = useWindowDimensions();
  const isNarrow = width < 600;

  useEffect(() => {
    api
      .get("/agenda")
      .then((res) => setEventos(res.data))
      .catch(console.error);
    api
      .get("/especialidades")
      .then((res) => setEspecialidades(res.data))
      .catch(console.error);
    api
      .get("/procedimentos")
      .then((res) => setProcedimentos(res.data))
      .catch(console.error);
    api
      .get("/profissionais")
      .then((res) => setProfissionais(res.data))
      .catch(console.error);
  }, [eventos]);

  /*   useEffect(() => {
    console.log("profissionais carregados:", profissionais);
  }, [profissionais]); */

  const eventosWithColor = eventos.map((ev) => ({
    ...ev,
    color: stringToHslColor(ev.profissional?.especialidade?.DESCESPEC || ""),
  }));

  const grouped = eventosWithColor.reduce((acc, ev) => {
    const dateOnly = ev.DATAABERT?.split("T")[0];
    if (!acc[dateOnly]) acc[dateOnly] = [];
    acc[dateOnly].push({ key: `${ev.IDAGENDA}-${ev.color}`, color: ev.color });
    return acc;
  }, {} as Record<string, { key: string; color: string }[]>);

  const markedDates: Record<string, any> = {};
  for (const [date, dots] of Object.entries(grouped)) {
    markedDates[date] = { dots: dots.slice(0, MAX_DOTS) };
  }
  if (selectedDate) {
    markedDates[selectedDate] = {
      ...(markedDates[selectedDate] || { dots: [] }),
      selected: true,
      selectedColor: "#029046",
    };
  }

  const handleEdit = (ev: EditedEvent) => {
    setSelectedEvent(ev);
    setModalVisible(true);
  };

  const handleClose = () => {
    setModalVisible(false);
    setSelectedEvent(null);
  };

  const handleSave = (updated: EditedEvent) => {
    api
      .put(`/agenda/${updated.IDAGENDA}`, updated)
      .then(() => {
        setEventos((prev) =>
          prev.map((e) => (e.IDAGENDA === updated.IDAGENDA ? updated : e))
        );
        handleClose();
        Alert.alert("Sucesso", "Agendamento salvo com sucesso.");
      })
      .catch((err) => {
        console.error("Erro ao salvar:", err);
        Alert.alert("Erro", "Não foi possível salvar alterações.");
      });
  };

  const handleDelete = (id: number) => {
    api
      .delete(`/agenda/${id}`)
      .then(() => {
        setEventos((prev) => prev.filter((e) => e.IDAGENDA !== id));
        handleClose();
        Alert.alert("Removido", "Agendamento excluído com sucesso.");
      })
      .catch((err) => {
        console.error("Erro ao excluir:", err);
        Alert.alert("Erro", "Não foi possível excluir.");
      });
  };

  const filteredEventos = selectedDate
    ? eventos.filter((e) => e.DATAABERT?.split("T")[0] === selectedDate)
    : [];

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <View
        style={[styles.content, { flexDirection: isNarrow ? "column" : "row" }]}
      >
        <View
          style={[
            styles.calendarContainer,
            isNarrow ? { width: "100%" } : { width: "35%" },
          ]}
        >
          <CalendarView
            onDayPress={(day) => setSelectedDate(day.dateString)}
            markedDates={markedDates}
          />
        </View>

        <View
          style={isNarrow ? styles.listContainer : styles.sideListContainer}
        >
          <CreateAppointmentForm />
          {selectedDate ? (
            <>
              <DateHeader dateString={selectedDate} />
            </>
          ) : (
            <Text style={styles.title}>Selecione uma data</Text>
          )}

          <ScrollView contentContainerStyle={styles.scrollContent}>
            {selectedDate && filteredEventos.length === 0 ? (
              <Text style={styles.hint}>
                Nenhum agendamento para esta data.
              </Text>
            ) : (
              filteredEventos.map((ev) => (
                <AppointmentCard
                  key={ev.IDAGENDA}
                  dataInicio={ev.DATAABERT?.slice(11, 16)}
                  procedimento={ev.procedimento?.DESCRPROC}
                  profissional={ev.profissional?.pessoa?.NOMEPESSOA}
                  especialidade={ev.procedimento?.especialidades?.[0]?.DESCESPEC}
                  onEdit={() => handleEdit(ev)}
                />
              ))
            )}
          </ScrollView>
        </View>

        {selectedEvent && (
          <EditAppointmentModal
            visible={modalVisible}
            editedEvent={selectedEvent}
            especialidades={especialidades}
            procedimentos={procedimentos}
            profissionais={profissionais}
            onClose={handleClose}
            onSave={handleSave}
            onDelete={handleDelete}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

function hashString(str: string, mod = 360) {
  let hash = 0;
  for (let i = 0; i < str?.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) % mod;
}

function stringToHslColor(str: string) {
  const hue = hashString(str, 360);
  return `hsl(${hue}, 90%, 50%)`;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F2F2F2" },
  content: { flex: 1 },
  calendarContainer: { backgroundColor: "#fff" },
  listContainer: { width: "100%", flex: 1, paddingHorizontal: 16 },
  sideListContainer: { flex: 1, paddingRight: 16 },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  scrollContent: { marginLeft: "20%", paddingBottom: 20 },
  hint: { textAlign: "center", color: "#666", marginTop: 20 },
});
