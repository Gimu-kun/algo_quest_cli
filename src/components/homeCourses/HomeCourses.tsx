import { View, Text, Dimensions, Image, ImageBackground, TouchableOpacity, GestureResponderEvent } from "react-native";
import styles from "./homeCourses.style";
import Carousel from "react-native-reanimated-carousel";
import { renderItem } from "../homeCarousel/RenderItems";
import { Button, Icon } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { useRef, useState } from "react";

const { width } = Dimensions.get("window");

const courseData = [
  {
    id: "1",
    name: "Tổng quan",
    imageUrl: "https://firebasestorage.googleapis.com/v0/b/wander-stay.appspot.com/o/general.jpeg?alt=media&token=07395a4e-a717-44cf-8543-e237e1d09244",
  },
  {
    id: "2",
    name: "Danh sách liên kết",
    imageUrl: "https://firebasestorage.googleapis.com/v0/b/wander-stay.appspot.com/o/linklist.jpg?alt=media&token=bbc13067-e537-405a-9f08-8f34e585f2e0",
  },
  {
    id: "3",
    name: "Hàng chờ (Queues)",
    imageUrl: "https://firebasestorage.googleapis.com/v0/b/wander-stay.appspot.com/o/queue.jpg?alt=media&token=b862505e-2622-4213-82b1-489270effc6e",
  },
  {
    id: "4",
    name: "Ngăn xếp (Stacks)",
    imageUrl: "https://firebasestorage.googleapis.com/v0/b/wander-stay.appspot.com/o/stack.jpg?alt=media&token=56f4ad2e-ba4b-4703-bb5e-02fc4b3ba0c2",
  },
  {
    id: "5",
    name: "Cây (Tree)",
    imageUrl: "https://firebasestorage.googleapis.com/v0/b/wander-stay.appspot.com/o/tree.jpg?alt=media&token=a998eb6e-c17c-4024-a939-f8e4226264d8",
  },
];

const HomeCourses = () => {
    const navigation = useNavigation();

    const renderItem = ({ item } :  any) => (
        <View style={styles.card}>
          <ImageBackground source={{ uri: item.imageUrl }} style={styles.image} />
          <Text style={styles.title}>{item.name}</Text>
          <View style={styles.markBox}>
            <View style={styles.courseRole}>
              <Text style={styles.courseRoleTxt}>Khoá chính</Text>
            </View>
            <View style={styles.courseRank}>
              <Icon color="red" size={14} source={'crown'}/>
              <Text style={styles.courseRankTxt}>VIP</Text>
            </View>
          </View>
          <View>
            <Text style={styles.subTitle}><Icon size={14} source={'group'}/> Đang cập nhật</Text>
            <Text style={styles.subTitle}><Icon size={14} source={'calendar'}/> 19-02-2025</Text>
          </View>
          <TouchableOpacity style={styles.navigateBtn} onPress={()=>{navigation.navigate('Roadmap')}}>
            <Image style={styles.btnHolder} source={{uri:"https://firebasestorage.googleapis.com/v0/b/wander-stay.appspot.com/o/btn_hold-removebg-preview.png?alt=media&token=0973f18d-bcc8-45fc-84ab-ecac7da3c1d5"}}/>
            <Icon color="#e0e0e0" size={20} source={"mushroom-outline"}/>
            <Text style={styles.navigateBtnTxt}>
              Chọn hành trình
            </Text>
          </TouchableOpacity>
        </View>
      );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Danh sách hành trình</Text>
              <Text style={styles.seeAll}>Xem tất cả</Text>
            </View>
            <Carousel
                loop={false}
                width={width * 0.9}
                height={400}
                autoPlay={false}
                data={courseData}
                scrollAnimationDuration={1000}
                renderItem={renderItem}
                pagingEnabled
                style={{ alignSelf: "center" }}
            />
        </View>
    )
}

export default HomeCourses;