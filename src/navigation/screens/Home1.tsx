import { Button, Text } from '@react-navigation/elements';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Task1 } from './Task1';
import { Task3 } from './Task3';

export function Home() {
  const [name,setName] = useState("");
  const [count, setCount] = useState(0)
  return (
    <View style={styles.container}>
      <Task3 setName={setName}/>
      <Task1 name={name} count={count} setCount={setCount}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    rowGap: 15,
    backgroundColor: '#000000',
    width: '100%',
    height: '100%',
  },
});