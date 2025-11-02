import { View, Text, Image, useWindowDimensions, TouchableOpacity, Alert, ImageBackground, ScrollView } from "react-native";
import styles from "./roadmap.style";
import { Icon, IconButton } from "react-native-paper";
import { NavigationProp, RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { QuestSummary } from "../../../types/QuestType";
import { BASE_API_URL, BASE_URL } from "../../../ApiConfig";
import { Coordinate, MAP_COORDINATES } from "../../../constants/MapCoords";
import { TopicSummary } from "../../../types/TopicType";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserInfo } from "../../../types/userType";

type RootStackParamList = {
        Roadmap: { topicId: number | string };
};

const MAP_BACKGROUNDS = [
    `${BASE_URL}/uploads/maps/map1.png`,
    `${BASE_URL}/uploads/maps/map2.png`,
    `${BASE_URL}/uploads/maps/map3.png`,
    `${BASE_URL}/uploads/maps/map4.png`,
    `${BASE_URL}/uploads/maps/map5.png`,
];

const getMapBackground = (topicId: number | string | undefined): string => {
    if (topicId === undefined) return MAP_BACKGROUNDS[0];
    const id = typeof topicId === 'string' ? parseInt(topicId) : topicId;
    const index = (id - 1) % MAP_BACKGROUNDS.length;
    return MAP_BACKGROUNDS[index >= 0 ? index : 0]; 
};

const getMapPath = (topicId: number | string | undefined): Coordinate[] => {
    if (topicId === undefined) return [];
    const id = typeof topicId === 'string' ? parseInt(topicId) : topicId;
    const mapIndex = (id - 1) % MAP_COORDINATES.length;
    return MAP_COORDINATES[mapIndex] ? MAP_COORDINATES[mapIndex].path : [];
};

type RoadmapRouteProp = RouteProp<RootStackParamList, 'Roadmap'>;
type RoadmapNavigationProp = NavigationProp<RootStackParamList, 'Roadmap'>;

export const Roadmap :React.FC = () => {
    const navigation = useNavigation<RoadmapNavigationProp>();
    const height = useWindowDimensions();
    const route = useRoute<RoadmapRouteProp>();
    const initialTopicId = route.params?.topicId ? Number(route.params.topicId) : undefined;
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [topicId,setTopicId] = useState<number | undefined>(initialTopicId);
    const [mapUri , setMapUri] = useState<string>(getMapBackground(topicId));
    const [mapPath , setMapPath] = useState<Coordinate[]>(getMapPath(topicId));
    const [topicsSummary, setTopicSummary] = useState<TopicSummary[]>([]);
    const [quests, setQuests] = useState<QuestSummary[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isMapLoaded, setIsMapLoaded] = useState<boolean>(false);
    const [topicName , setTopicName] = useState<string | null>(null);
    const [preTopicName , setPreTopicName] = useState<string | null>(null);
    const [nextTopicName , setNextTopicName] = useState<string | null>(null);

    const [completedQuestIds, setCompletedQuestIds] = useState<Set<number>>(new Set());

    const renderQuestNodes = () => {
        if (!quests || quests.length === 0 || mapPath.length === 0) {
            return null;
        }
        
        // Sắp xếp theo orderIndex để khớp với thứ tự tọa độ
        const sortedQuests = quests.sort((a, b) => a.orderIndex - b.orderIndex);

        // CÁC THAM SỐ CHUNG CHO NÚT
        const NODE_SIZE = 55; // Kích thước tổng thể của nút
        
        // Bảng màu cho hiệu ứng 3D dựa trên Difficulty
        const colorPalette = {
            easy: { primary: '#66BB6A', shadow: '#388E3C' }, // Xanh lá
            medium: { primary: '#FFD54F', shadow: '#FFA000' }, // Vàng/Cam
            hard: { primary: '#EF5350', shadow: '#D32F2F' }, // Đỏ
            completed: { primary: '#7986CB', shadow: '#3F51B5' }, // Màu Tím
        };

        return sortedQuests.map((quest, index) => {   
            const coordIndex = Math.min(index, mapPath.length - 1); 
            const position = mapPath[coordIndex];
            const isCompleted = completedQuestIds.has(quest.questId);
            
            const colors = isCompleted 
                ? colorPalette.completed 
                : (colorPalette[quest.difficulty as keyof typeof colorPalette] || colorPalette.easy);
                
            return (
                // Nút quest đặt trên bản đồ
                <TouchableOpacity
                    key={quest.questId}
                    style={{
                        position: 'absolute',
                        top: position.top, 
                        left: position.left,
                        
                        // Kích thước vùng chạm
                        width: NODE_SIZE + 10,
                        height: NODE_SIZE + 10,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                    onPress={() => {
                        console.log(`Bắt đầu Quest: ${quest.questName}`);
                        // Logic điều hướng...
                    }}
                >
                    {/* 1. LAYER DƯỚI: TẠO BÓNG VÀ CHIỀU SÂU (DEPTH) */}
                    <View style={{
                        position: 'absolute',
                        width: NODE_SIZE + 10, 
                        height: NODE_SIZE + 10,
                        borderRadius: "50%",
                        backgroundColor: colors.shadow, // Màu tối hơn
                        // Shadow/Elevation để làm nút nổi lên
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.6,
                        shadowRadius: 4,
                        elevation: 8, 
                    }}/>
                    
                    {/* 2. LAYER TRÊN: BỀ MẶT NÚT CHÍNH VÀ SỐ THỨ TỰ */}
                    <View style={{
                        position: 'absolute',
                        width: NODE_SIZE, 
                        height: NODE_SIZE,
                        borderRadius: NODE_SIZE / 2,
                        backgroundColor: colors.primary, // Màu chính (sáng hơn)
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderWidth: 3,
                        borderColor: 'white', // Viền trắng nổi bật
                    }}>
                        {/* HIỂN THỊ SỐ THỨ TỰ CỦA QUEST */}
                        <Text style={{
                            fontSize: 22,
                            fontWeight: '900',
                            color: 'white',
                            // Thêm shadow cho Text để nổi bật hơn trên nền nút
                            textShadowColor: 'rgba(0, 0, 0, 0.4)',
                            textShadowOffset: { width: 1, height: 1 },
                            textShadowRadius: 2,
                        }}>
                            {quest.orderIndex}
                        </Text>
                        {/* ICON HOÀN THÀNH */}
                        {isCompleted && (
                            <View 
                                style={{
                                    position: 'absolute',
                                    top: -5, // Căn chỉnh vị trí
                                    right: -5,
                                    borderColor: '#66BB6A',
                                    borderWidth:2,
                                    borderRadius:'50%',
                                    backgroundColor:'#FFFFFF'
                                }}
                            >
                                <Icon 
                                    color='#66BB6A' 
                                    size={20} 
                                    source="check-circle" 
                                />
                            </View>
                        )}
                    </View>
                </TouchableOpacity>
            );
        });
    };

    const fetchUserInfo = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('authData');

            if (jsonValue !== null) {
                const authData = JSON.parse(jsonValue);
                const userData = authData.user;
                setUserInfo({
                    userId: userData.userId,
                    username: userData.username,
                    fullName: userData.fullName || userData.username, 
                    avatar: userData.avatar,
                    role: userData.role,
                });
            }
        } catch (e) {
            console.error("Lỗi khi đọc AsyncStorage:", e);
        }
    };

    const handleGoBack = () => {
        navigation.goBack();
    };

    const fetchQuestCompletions = async (userId: number, topicId: number | string) => {
        const apiUrl = `${BASE_API_URL}quest-completions/user/${userId}/topic/${topicId}`;
        
        try {
            const response = await fetch(apiUrl);

            if (!response.ok) {
                // Nếu không có quest nào hoàn thành (404) hoặc lỗi khác
                if (response.status === 404) {
                     setCompletedQuestIds(new Set()); // Đặt là rỗng
                     return;
                }
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data: any[] = await response.json();
            console.log("data-----------------------------------------------------");
            console.log(data);
            // Lọc và lưu trữ các Quest ID duy nhất đã hoàn thành
            const questIds = new Set(data.map(completion => completion.quest.questId as number));
            setCompletedQuestIds(questIds);
        } catch (err) {
            console.error("[API Error] Lỗi khi tải thông tin hoàn thành Quest:", err);
            // Vẫn cho phép map tải, chỉ báo lỗi nhẹ
            setCompletedQuestIds(new Set()); 
        }
    };

    const fetchQuestsSummary = async (id: number | string) => {
        setError(null);
        
        const apiUrl = `${BASE_API_URL}topics/${id}/quests/summary`;

        try {
            const response = await fetch(apiUrl);

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data: QuestSummary[] = await response.json();
            console.log(data);
            setQuests(data);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Đã xảy ra lỗi không xác định";
            Alert.alert("Lỗi", "Không thể tải danh sách Quest. Vui lòng kiểm tra server.");
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const fetchTopicSummary = async () => {
        setError(null);
        
        const apiUrl = `${BASE_API_URL}topics/summary`;

        try {
            const response = await fetch(apiUrl);

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data: TopicSummary[] = await response.json();
            setTopicSummary(data);

            const currentTopic = data.find(item => item.topicId === topicId);
            if (currentTopic) {
                setTopicName(currentTopic.topicName);
                const preTopic = data.find(item => item .orderIndex == currentTopic?.orderIndex-1)
                setPreTopicName(preTopic ? preTopic.topicName : null);
                const nextTopic = data.find(item => item .orderIndex == currentTopic?.orderIndex+1)
                setNextTopicName(nextTopic ? nextTopic.topicName : null);
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Đã xảy ra lỗi không xác định";
            console.error("[API Error] Lỗi khi tải dữ liệu Topic:", errorMessage);
            Alert.alert("Lỗi", "Không thể tải danh sách Topic. Vui lòng kiểm tra server.");
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchUserInfo();
    }, []);

    useEffect(() => {
        if (topicId) {
            setIsMapLoaded(false);
            setMapUri(getMapBackground(topicId));
            setMapPath(getMapPath(topicId))
            fetchQuestsSummary(topicId);
            fetchTopicSummary();
        } else {
            console.error("Không tìm thấy topicId trong route params.");
            setError("Thiếu Topic ID.");
        }
    }, [topicId]);

    useEffect(() => {
        if (topicId && userInfo?.userId) {
            console.log(`Đang gọi API hoàn thành cho User ID: ${userInfo.userId} và Topic ID: ${topicId}`);
            fetchQuestCompletions(userInfo.userId, topicId);
        }
    }, [topicId, userInfo]);

    if (loading || isMapLoaded) {
        return (
            <View style={[styles.page, { justifyContent: 'center', alignItems: 'center' }]}>
                <Text>Đang tải danh sách Quest...</Text>
            </View>
        );
    }

    if (error && quests.length === 0) {
        return (
            <View style={[styles.page, { justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={{ color: 'red' }}>Lỗi: {error}</Text>
                <Text>Vui lòng kiểm tra lại địa chỉ BASE_API_URL.</Text>
            </View>
        );
    }

    const handlePreTopic = () =>{
        const topic = topicsSummary.find(item=>item.topicId == topicId);
        if (!topic || topic.orderIndex == 1) {
            return;
        }
        const preTopic = topicsSummary.find(item=>item.orderIndex == topic.orderIndex - 1);
        if (preTopic) {
            setIsMapLoaded(true)
            setTopicId(preTopic.topicId); 
        }
    }

    const handleNextTopic = () =>{
        const topic = topicsSummary.find(item=>item.topicId == topicId);
        if (!topic || topic.orderIndex == topicsSummary.length) {
            return;
        }
        const nextTopic = topicsSummary.find(item=>item.orderIndex == topic.orderIndex + 1);
        if (nextTopic) {
            setIsMapLoaded(true)
            setTopicId(nextTopic.topicId); 
        }
    }
    
    return (
        <View style={[styles.page]}>
            <View style={styles.header}>
                <View style={styles.headerContainer}>
                    <IconButton iconColor='#f20717' size={45} icon="arrow-left-thick" onPress={handleGoBack}/>
                    <View style={styles.headerTitleContainer}>
                        <Image style={styles.headerTitleRibbon}  source={require('../../../assets/ribbon.png')}/>
                        <Text style={styles.headerTitle}>{topicName}</Text>
                    </View>
                    <IconButton iconColor='#f20717' size={45} icon="cog"/>
                </View>
            </View>
            <ImageBackground 
                source={{ uri: mapUri }}
                style={{ flex: 1, width: '100%', height: '100%' }} 
                imageStyle={{ resizeMode: 'cover' }}
                onLoadEnd={() => setIsMapLoaded(false)}
            >
                    {!isMapLoaded && (
                        <View style={{ flex: 1 }}> 
                            {renderQuestNodes()}
                        </View>
                    )}
            </ImageBackground>
            <View style={styles.footer}>
                <View style={styles.footerTop}>
                    <TouchableOpacity style={[
                        styles.sectionNavBtn, 
                        styles.nextBtn,
                        preTopicName === null && styles.hidden
                    ]} onPress={handlePreTopic}>
                        <Icon color='#f20717' size={45} source="arrow-left-thick"/>
                        <Text style={styles.sectionNavBtnTxt}>{preTopicName}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[
                        styles.sectionNavBtn, 
                        styles.preBtn,
                        nextTopicName === null && styles.hidden
                    ]} onPress={handleNextTopic}>
                        <Text style={styles.sectionNavBtnTxt}>{nextTopicName}</Text>
                        <Icon color='#f20717' size={45} source="arrow-right-thick"/>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}