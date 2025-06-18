import React from "react";
import { StyleSheet, View } from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";
import { MarkedDates } from "react-native-calendars/src/types";

LocaleConfig.locales["pt-br"] = {
  monthNames: [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ],
  monthNamesShort: [
    "jan.",
    "fev.",
    "mar.",
    "abr.",
    "mai.",
    "jun.",
    "jul.",
    "ago.",
    "set.",
    "out.",
    "nov.",
    "dez.",
  ],
  dayNames: [
    "domingo",
    "segunda-feira",
    "terça-feira",
    "quarta-feira",
    "quinta-feira",
    "sexta-feira",
    "sábado",
  ],
  dayNamesShort: ["dom.", "seg.", "ter.", "qua.", "qui.", "sex.", "sáb."],
};

LocaleConfig.defaultLocale = "pt-br";

type Props = {
  onDayPress: (day: { dateString: string }) => void;
  onMonthChange?: (month: { year: number; month: number }) => void;
  markedDates?: MarkedDates;
};

export default function CalendarView({
  onDayPress,
  onMonthChange,
  markedDates,
}: Props) {
  return (
    <View style={styles.container}>
      <Calendar
        onDayPress={onDayPress}
        onMonthChange={onMonthChange}
        markedDates={markedDates}
        markingType={"multi-dot"}
        theme={{
          selectedDayBackgroundColor: "#029046",
          todayTextColor: "#14d370",
          arrowColor: "#0066CC",
        }}
        monthFormat={"MMMM yyyy"}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
    backgroundColor: "#fff",
  },
});
