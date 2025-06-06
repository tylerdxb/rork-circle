import { Stack } from "expo-router";
import { View } from "react-native";
import { globalStyles } from "@/constants/theme";

export default function AuthLayout() {
  return (
    <View style={globalStyles.container}>
      <Stack screenOptions={{ headerShown: false }} />
    </View>
  );
}