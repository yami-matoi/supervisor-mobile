// src/components/EditAppointmentModal.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Switch,
  Button,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker, {
  DateTimePickerAndroid,
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import api from "../src/services/api";

export type EditedEvent = {
  IDAGENDA: number;
  ID_PROFISSIO: number;
  ID_PROCED: number;
  titulo_agenda: string;
  profissional: {
    IDPROFISSIO: number;
    especialidade: { IDESPEC: number; DESCESPEC: string };
    pessoa: { NOMEPESSOA: string };
  };
  procedimento: {
    IDPROCED: number;
    DESCRPROC: string;
    especialidades: [
      {
        IDESPEC: number;
        DESCESPEC: string;
      }
    ];
  };
  DESCRICAO: string;
  DATAABERT: string;
  DATAFIM: string;
  SITUAGEN: boolean;
};

export type Especialidade = {
  IDESPEC: number;
  DESCESPEC: string;
};
export type ProcedimentoDTO = {
  IDPROCED: number;
  DESCRPROC: string;
  especialidades: [
    {
      IDESPEC: 5;
      DESCESPEC: "Nutrição";
    }
  ];
};
export type ProfissionalDTO = {
  IDPROFISSIO: number;
  NOMEPESSOA: string;
  pessoa: {
    NOMEPESSOA: string;
  };
};

type Props = {
  visible: boolean;
  editedEvent: EditedEvent;
  especialidades: Especialidade[];
  procedimentos: ProcedimentoDTO[];
  profissionais: ProfissionalDTO[];
  onClose: () => void;
  onSave: (updated: EditedEvent) => void;
  onDelete: (idAgenda: number) => void;
};

const toMysqlString = (d: Date) => {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
};

export default function EditAppointmentModal({
  visible,
  editedEvent,
  especialidades,
  procedimentos,
  profissionais,
  onClose,
  onSave,
  onDelete,
}: Props) {
  const [showStartIOS, setShowStartIOS] = useState(false);
  const [selectedProfissional, setSelectedProfissional] = useState<number>(
    editedEvent.ID_PROFISSIO
  );
  const [descComplementar, setDescComplementar] = useState(
    editedEvent.DESCRICAO
  );
  const [startDate, setStartDate] = useState<Date>(
    new Date(editedEvent.DATAABERT)
  );
  const [endDate, setEndDate] = useState<Date>(new Date(editedEvent.DATAFIM));
  const [collapsed, setCollapsed] = useState(true);
  // const [filteredProfs, setFilteredProfs] = useState<ProfissionalDTO[]>([]);

  const getEspecialidadeNome = (id: number): string => {
    return (
      especialidades.find((e) => e.IDESPEC === id)?.DESCESPEC || "Especialidade"
    );
  };

  const [tituloAgenda, setTituloAgenda] = useState(() => {
    const proc = editedEvent?.procedimento?.DESCRPROC || "Procedimento";
    const esp = getEspecialidadeNome(
      editedEvent?.procedimento?.especialidades[0]?.IDESPEC
    );
    const prof =
      editedEvent?.profissional?.pessoa?.NOMEPESSOA || "Profissional";
    return `${proc} com ${esp} - ${prof}`;
  });

  const adjustEnd = (s: Date, e: Date) =>
    s >= e ? new Date(s.getTime() + 30 * 60_000) : e;

  const handleDateTimeChange = (type: "start" | "end", newDate: Date) => {
    if (type === "start") {
      setStartDate(newDate);
      setEndDate(adjustEnd(newDate, endDate));
    } else {
      setEndDate(adjustEnd(startDate, newDate));
    }
  };

  const openAndroidPicker = (type: "start" | "end") => {
    const current = type === "start" ? startDate : endDate;
    const minDate = type === "start" ? new Date() : startDate;

    DateTimePickerAndroid.open({
      value: current,
      mode: "date",
      minimumDate: minDate,
      onChange: (ev: DateTimePickerEvent, dp?: Date) => {
        if (ev.type !== "set" || !dp) return;

        DateTimePickerAndroid.open({
          value: current,
          mode: "time",
          is24Hour: true,
          onChange: (ev2: DateTimePickerEvent, tp?: Date) => {
            if (ev2.type !== "set" || !tp) return;
            const composed = new Date(
              dp.getFullYear(),
              dp.getMonth(),
              dp.getDate(),
              tp.getHours(),
              tp.getMinutes()
            );
            handleDateTimeChange(type, composed);
          },
        });
      },
    });
  };

  const IOSPicker = ({
    value,
    type,
  }: {
    value: Date;
    type: "start" | "end";
  }) => (
    <DateTimePicker
      value={value}
      mode="datetime"
      display="spinner"
      onChange={(_, d) => d && handleDateTimeChange(type, d)}
      minimumDate={type === "start" ? new Date() : startDate}
    />
  );

  const fmt = (d: Date) =>
    d.toLocaleDateString() +
    " " +
    d
      .toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      .replace(":", "h");

  const handleSave = () => {
    const updated: EditedEvent = {
      ...editedEvent,
      ID_PROFISSIO: selectedProfissional,
      DESCRICAO: descComplementar,
      DATAABERT: toMysqlString(startDate),
      DATAFIM: toMysqlString(endDate),
    };
    onSave(updated);
  };

  const firstEspecId = editedEvent.procedimento?.especialidades?.[0]?.IDESPEC;
  const procs = procedimentos.filter((p) =>
    p.especialidades?.some((esp) => esp.IDESPEC === firstEspecId)
  );

  // procedimentos.map((p) => console.log(p));

  // useEffect(() => {
  //   const specialty = editedEvent.procedimento.especialidades[0].IDESPEC;
  //   if (!specialty) return;

  //   api
  //     .get<ProfissionalDTO[]>(`/especialidade/${specialty}/profissionais`)
  //     .then((res) => setFilteredProfs(res.data))
  //     .catch((err) => {
  //       console.error("Erro ao carregar profissionais:", err);
  //       setFilteredProfs([]);
  //     });
  // }, [editedEvent]);

  useEffect(() => {
    const prof = profissionais.find(
      (p) => p.IDPROFISSIO === selectedProfissional
    );
    const proc = editedEvent?.procedimento?.DESCRPROC || "Procedimento";
    const esp = getEspecialidadeNome(
      editedEvent?.procedimento?.especialidades[0]?.IDESPEC
    );
    const nomeProf = prof?.pessoa?.NOMEPESSOA || "Profissional";
    setTituloAgenda(`${proc} com ${esp} - ${nomeProf}`);
  }, [selectedProfissional]);

  return (
    <Modal transparent visible={visible} animationType="slide">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.overlay}>
          <View style={styles.modalContainer}>
            <ScrollView contentContainerStyle={styles.inner}>
              <Text style={styles.modalTitle}>{tituloAgenda}</Text>

              <Text style={styles.label}>Especialidade</Text>
              <View style={[styles.pickerWrapper, { backgroundColor: "#eee" }]}>
                <Picker enabled={false} selectedValue={firstEspecId}>
                  {especialidades.map((e) => (
                    <Picker.Item
                      key={e.IDESPEC}
                      label={e.DESCESPEC}
                      value={e.IDESPEC}
                    />
                  ))}
                </Picker>
              </View>

              <Text style={styles.label}>Procedimento</Text>
              <View style={[styles.pickerWrapper, { backgroundColor: "#eee" }]}>
                <Picker enabled={false} selectedValue={editedEvent.ID_PROCED}>
                  {procs.map((p) => (
                    <Picker.Item
                      key={p.IDPROCED}
                      label={p.DESCRPROC}
                      value={p.IDPROCED}
                    />
                  ))}
                </Picker>
              </View>

              <Text style={[styles.label, { marginTop: 12 }]}>
                Profissional Responsável
              </Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={selectedProfissional}
                  onValueChange={(id) => {
                    setSelectedProfissional(id);
                    const prof = profissionais.find(
                      (p) => p.IDPROFISSIO === id
                    );
                    if (prof) {
                      const proc = editedEvent.procedimento.DESCRPROC;
                      const esp =
                        editedEvent.procedimento.especialidades[0].DESCESPEC;
                      setTituloAgenda(
                        `${proc} com ${esp} - ${prof.pessoa.NOMEPESSOA}`
                      );
                    }
                  }}
                >
                  {profissionais.map((p) => (
                    <Picker.Item
                      key={p.IDPROFISSIO}
                      label={p.pessoa.NOMEPESSOA}
                      value={p.IDPROFISSIO}
                    />
                  ))}
                </Picker>
              </View>
              <Text style={[styles.label, { marginTop: 12 }]}>Início</Text>
              <TouchableOpacity
                style={styles.dateTimeInput}
                onPress={() =>
                  Platform.OS === "android"
                    ? openAndroidPicker("start")
                    : setShowStartIOS(true)
                }
              >
                <Text>{fmt(startDate)}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.collapseButton}
                onPress={() => setCollapsed((c) => !c)}
              >
                <Text style={styles.collapseButtonText}>
                  {collapsed ? "Mostrar Detalhes" : "Ocultar Detalhes"}
                </Text>
              </TouchableOpacity>

              {!collapsed && (
                <>
                  <Text style={[styles.label, { marginTop: 12 }]}>
                    Descrição Complementar
                  </Text>
                  <TextInput
                    style={[styles.textArea, { height: 80 }]}
                    multiline
                    value={descComplementar}
                    onChangeText={setDescComplementar}
                    placeholder="Digite a descrição complementar"
                  />
                </>
              )}

              <View style={styles.footerRow}>
                <View style={{ flex: 1, marginRight: 4 }}>
                  <Button
                    title="Apagar"
                    color="#C0392B"
                    onPress={() =>
                      Alert.alert("Apagar Agendamento", "Tem certeza?", [
                        { text: "Cancelar", style: "cancel" },
                        {
                          text: "Apagar",
                          style: "destructive",
                          onPress: () => onDelete(editedEvent.IDAGENDA),
                        },
                      ])
                    }
                  />
                </View>
                <View style={{ flex: 1, marginLeft: 4 }}>
                  <Button title="Salvar Alterações" onPress={handleSave} />
                </View>
              </View>

              <View style={{ marginTop: 16 }}>
                <Button title="Fechar" color="#555" onPress={onClose} />
              </View>
            </ScrollView>
          </View>
        </View>
      </TouchableWithoutFeedback>

      {Platform.OS === "ios" && showStartIOS && (
        <View style={styles.iosPickerContainer}>
          <IOSPicker value={startDate} type="start" />
          <Button title="OK" onPress={() => setShowStartIOS(false)} />
        </View>
      )}
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    padding: 16,
  },
  modalContainer: {
    backgroundColor: "#FFF",
    borderRadius: 8,
    maxHeight: "90%",
    overflow: "hidden",
  },
  inner: { padding: 16 },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
    textAlign: "center",
  },
  label: { fontSize: 14, fontWeight: "600" },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 6,
    marginTop: 4,
  },
  textArea: {
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 6,
    padding: 8,
    marginTop: 4,
    textAlignVertical: "top",
  },
  collapseButton: { marginTop: 12, alignSelf: "flex-start" },
  collapseButtonText: { color: "#0066CC", fontWeight: "600" },
  dateTimeInput: {
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 6,
    padding: 12,
    marginTop: 4,
  },
  iosPickerContainer: {
    backgroundColor: "white",
    padding: 20,
    borderTopWidth: 1,
    borderColor: "#ccc",
  },
  smallNote: { fontSize: 12, color: "#666", marginTop: 4 },
  footerRow: { flexDirection: "row", marginTop: 24 },
});
