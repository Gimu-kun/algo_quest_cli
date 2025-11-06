import { View, Text, ImageBackground, TouchableOpacity } from "react-native";
import { styles } from "./homeMultiplay.style";
import { Icon } from "react-native-paper";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../../navigation/types";

export default function HomeMultiplay() {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const handleCreateRoom = () => {
    // 5. Điều hướng đến 'WaitingRoom' và truyền 'roomId: null'
    //    để báo cho màn hình đó biết đây là "Tạo phòng mới"
    navigation.navigate('WaitingRoom', { roomId: null }); 
  };

  const handleJoinRoom = () => {
    // (Logic này sẽ cần một Modal để nhập ID phòng)
    console.log('Tham gia phòng');
  };
  return (
    <View style={styles.container}>
      {/* Sử dụng ImageBackground để chứa các nút 
        justifyContent: 'flex-end' đẩy nội dung xuống dưới
      */}
      <ImageBackground 
        source={{ uri: "https://firebasestorage.googleapis.com/v0/b/wander-stay.appspot.com/o/mario-pk.jpg?alt=media&token=6089fc10-e988-4041-9e97-032cab2e8152" }} 
        style={styles.imageBackground}
        imageStyle={styles.imageStyle} // Style cho tấm ảnh bên trong
      >
        {/* Container cho các nút, được đẩy xuống dưới 
          bởi justifyContent: 'flex-end' của cha
        */}
        <View style={styles.buttonContainer}>
          {/* Nút 1: Tham gia phòng */}
          <TouchableOpacity 
            style={styles.button} 
            onPress={handleJoinRoom} // <-- Cập nhật
          >
            <Icon source="login" size={20} color="#a13203ff" />
            <Text style={styles.buttonText}>Tham gia phòng</Text>
          </TouchableOpacity>

          {/* Nút 2: Tạo phòng mới */}
          <TouchableOpacity 
            style={styles.button}
            onPress={handleCreateRoom} // <-- 6. SỬ DỤNG HÀM MỚI
          >
            <Icon source="circle" size={20} color="#0ba103ff" />
            <Text style={styles.buttonText}>Tạo phòng mới</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  )
}
