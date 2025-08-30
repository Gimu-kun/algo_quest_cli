import { TextInput, Text, View } from "react-native";
import { StyleSheet } from "react-native";

export function Task3({setName}: {setName: (name: string) => void}) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Nhập tên của bạn</Text>
      <TextInput
        style={styles.button}
        placeholder="Tên của bạn"
        onChangeText={(text:string) => setName(text)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    width: '100%',
    },
    text: {
        color: '#ffffff',
        fontSize: 20,
        fontWeight: '700',
    },
    button: {
        width: '50%',
        borderColor: '#ffffff',
        borderWidth: 1,
        color: '#ffffff',
        padding: 10,
        borderRadius: 5,
    }
});