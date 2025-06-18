import React from "react";
import {
  Text as RNText,
  View as RNView,
  useColorScheme,
  StyleSheet,
} from "react-native";

type ThemedProps = {
  lightColor?: string;
  darkColor?: string;
  style?: any;
};

export function Text(props: ThemedProps & React.ComponentProps<typeof RNText>) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const colorScheme = useColorScheme();
  const color = colorScheme === "dark" ? darkColor : lightColor;
  return <RNText style={[{ color }, style as any]} {...otherProps} />;
}

export function View(props: ThemedProps & React.ComponentProps<typeof RNView>) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const colorScheme = useColorScheme();
  const backgroundColor = colorScheme === "dark" ? darkColor : lightColor;
  return <RNView style={[{ backgroundColor }, style as any]} {...otherProps} />;
}
