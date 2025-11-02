import { View, Text, Dimensions, Image, ImageBackground, TouchableOpacity, GestureResponderEvent } from "react-native";
import styles from "./homeCourses.style";
import Carousel from "react-native-reanimated-carousel";
import { Icon } from "react-native-paper";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { TopicSummary } from "../../types/TopicType";
import axios from "axios";
import { BASE_API_URL } from "../../ApiConfig";

const { width } = Dimensions.get("window");
const TOPICS_SUMMARY_URL = BASE_API_URL + 'topics/summary';

type RootStackParamList = {
    Roadmap: { topicId: number | string };
    [key: string]: object | undefined;
};

const staticCourseData = [ // Đổi tên thành staticCourseData để tránh trùng tên với state
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
  
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    const [courseData, setCourseData] = useState<TopicSummary[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const staticImageUrls = staticCourseData.map(item => item.imageUrl);
    const totalStaticImages = staticImageUrls.length;

    useEffect(() => {
        const fetchTopics = async () => {
            try {
                const response = await axios.get<TopicSummary[]>(TOPICS_SUMMARY_URL);
                console.log(response)
                const dataWithImage = response.data.map((topic, index) => ({
                    ...topic,
                    imageUrl: staticImageUrls[index % totalStaticImages] || "",
                }));

                setCourseData(dataWithImage);
                setLoading(false);
            } catch (err) {
                console.error("Lỗi khi tải danh sách Topic:", err);
                setError("Không thể tải danh sách khóa học.");
                setLoading(false);
            }
        };

        fetchTopics();
    }, []);

    const CourseItem = ({ item }: { item: TopicSummary }) => (
        <View style={styles.card}>
          <ImageBackground 
              source={{ uri: item.imageUrl }}
              style={styles.image}
              imageStyle={{ borderRadius: 10 }}
            >
              <View style={styles.markBox}>
                <Text style={styles.markTxt}>{item.topicName}</Text>
              </View>
            </ImageBackground>

            <View style={styles.infoBox}>
              <View style={styles.titleInfo}>
                <View style={styles.courseRole}>
                    <Text style={styles.courseRoleTxt}>Dễ</Text>
                </View>
                <View style={styles.courseRank}>
                  <Icon color='red' size={14} source={'star'}/>
                  <Text style={styles.courseRankTxt}>Rank 1</Text>
                </View>
              </View>
              <Text style={styles.title} numberOfLines={1}>{item.topicName}</Text>
              <View>
                {/* Thông tin thêm, ví dụ: số lượng Quest */}
                <Text style={styles.subTitle}><Icon size={14} source={'text-box-multiple'}/> Quests: Đang cập nhật</Text> 
                <Text style={styles.subTitle}><Icon size={14} source={'calendar'}/> Index: {item.questCount}</Text>
              </View>
              <TouchableOpacity style={styles.navigateBtn} onPress={()=>{navigation.navigate('Roadmap', { topicId: item.topicId })}}>
                <Image style={styles.btnHolder} source={{uri:"https://firebasestorage.googleapis.com/v0/b/wander-stay.appspot.com/o/btn_hold-removebg-preview.png?alt=media&token=0973f18d-bcc8-45fc-84ab-ecac7da3c1d5"}}/>
                <Icon color="#e0e0e0" size={20} source={"mushroom-outline"}/>
                <Text style={styles.navigateBtnTxt}>
                  Chọn hành trình
                </Text>
              </TouchableOpacity>
            </View>
        </View>
      );

      if (loading) {
        return (
            <View style={styles.container}>
                <Text style={{textAlign: 'center', color: '#888'}}>Đang tải danh sách khóa học...</Text>
            </View>
        );
      }

      if (error) {
        return (
            <View style={styles.container}>
                <Text style={{textAlign: 'center', color: 'red'}}>{error}</Text>
            </View>
        );
      }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Danh sách hành trình</Text>
              <Text style={styles.seeAll}>Xem tất cả</Text>
            </View>
            {courseData.length > 0 ? (
                <Carousel
                    loop={false}
                    width={width * 0.9}
                    height={400}
                    autoPlay={false}
                    data={courseData}
                    scrollAnimationDuration={1000}
                    renderItem={CourseItem}
                    mode={"parallax"}
                    modeConfig={{
                        parallaxScrollingScale: 0.9,
                        parallaxScrollingOffset: 40,
                        parallaxAdjacentItemScale: 0.8
                    }}
                />
            ) : (
                <Text style={{textAlign: 'center', color: '#888', marginTop: 20}}>Không có khóa học nào để hiển thị.</Text>
            )}
        </View>
    )
}

export default HomeCourses;