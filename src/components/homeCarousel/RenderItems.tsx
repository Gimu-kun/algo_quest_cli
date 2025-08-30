import React from "react";
import { View, Text, Image } from "react-native";



export const renderItem = ({ rounded }: { rounded?: boolean }) => {
    
  return ({ item, index }: { item: string; index: number }) => (
      <View
        style={{
          flex: 1,
          borderRadius: rounded ? 20 : 0,
          justifyContent: "center",
          alignItems: "center",
          overflow:'hidden'
        }}
      >
        <Image style={{width:'100%',height:'100%',objectFit:'cover'}} source={{ uri: item }} />
      </View>
    );
};
