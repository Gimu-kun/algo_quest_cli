import { Button, Text } from '@react-navigation/elements';
import { StyleSheet, View } from 'react-native';

export function Task1({name, count, setCount}:{name: string, count:number, setCount: (value:number) => void}) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Xin chào {name}</Text>
      <Text style={styles.text}>Bạn đã nhấn {count} lần</Text>
      <Button style={styles.button} onPress={() => setCount(count + 1)}>+ 1</Button>
      <Button style={styles.button} onPress={() => setCount(count > 1 ? count - 1 : 0)}>- 1</Button>
      <Button style={styles.button} onPress={() => setCount(0)}>Reset</Button>
    </View>
  );
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        width: '100%',
    },
  text:{
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '700',
  },
  button:{
    width: '50%',
  }
});
