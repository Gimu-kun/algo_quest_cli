import { View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";

const DividerWithText = ({ text }: { text: string }) => {
  return (
    <View style={styles.container}>
      <View style={styles.line} />
      <Text style={styles.text}>{text}</Text>
      <View style={styles.line} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 16,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#aaa",
  },
  text: {
    marginHorizontal: 8,
    fontSize: 14,
    color: "#777",
  },
});

export default DividerWithText;
