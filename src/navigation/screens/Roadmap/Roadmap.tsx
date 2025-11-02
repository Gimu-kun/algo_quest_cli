import { View, Text, Image, useWindowDimensions, TouchableOpacity, Alert, ImageBackground, ScrollView } from "react-native";
import styles from "./roadmap.style";
import { Icon, IconButton } from "react-native-paper";
import { NavigationProp, RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { QuestDetail, QuestStats, QuestStatus } from "../../../types/QuestType"; // Giả định QuestStatus là DTO mới
import { BASE_API_URL, BASE_URL } from "../../../ApiConfig";
import { Coordinate, MAP_COORDINATES } from "../../../constants/MapCoords";
import { TopicSummary } from "../../../types/TopicType";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserInfo } from "../../../types/userType";
import { QuestStatsModal } from "../../../components/questStatsModal/QuestStatsModal";

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
    const [quests, setQuests] = useState<QuestStatus[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isMapLoaded, setIsMapLoaded] = useState<boolean>(false);
    const [topicName , setTopicName] = useState<string | null>(null);
    const [preTopicName , setPreTopicName] = useState<string | null>(null);
    const [nextTopicName , setNextTopicName] = useState<string | null>(null);
    const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    const [selectedQuestStats, setSelectedQuestStats] = useState<QuestStats | null>(null);
    const [currentSelectedQuestId, setCurrentSelectedQuestId] = useState<number | null>(null);

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
            completed: { primary: '#7986CB', shadow: '#3F51B5' }, // Màu Tím (Hoàn thành)
            locked: { primary: '#B0BEC5', shadow: '#78909C' }, // Màu Xám (Khóa)
        };

        return sortedQuests.map((quest, index) => { 
            const coordIndex = Math.min(index, mapPath.length - 1); 
            const position = mapPath[coordIndex];
            
            // LẤY TRẠNG THÁI TỪ DỮ LIỆU MỚI (QuestStatus DTO)
            const isCompleted = quest.completed; 
            const isLocked = quest.locked; 
            
            // TÍNH TOÁN BẢNG MÀU VÀ HIỆU ỨNG THỊ GIÁC
            let colors: { primary: string, shadow: string };
            let nodeOpacity = 1;

            if (isLocked) {
                colors = colorPalette.locked; // Áp dụng màu xám
                nodeOpacity = 0.9; // Giảm độ mờ 
            } else if (isCompleted) {
                colors = colorPalette.completed;
            } else {
                // Lấy màu dựa trên difficulty nếu chưa hoàn thành và chưa bị khóa
                colors = (colorPalette[quest.difficulty as keyof typeof colorPalette] || colorPalette.easy);
            }
                
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
                        // Áp dụng độ mờ (opacity) cho toàn bộ nút khi bị khóa
                        opacity: nodeOpacity, 
                    }}
                    // VÔ HIỆU HÓA TƯƠNG TÁC
                    disabled={isLocked} // KHÔNG CHO BẤM NẾU isLocked là true
                    onPress={() => {
                        // --- CẬP NHẬT LOGIC onPress MỚI ---
                        handleQuestPress(quest.questId, isLocked, quest.questName);
                        // --- END CẬP NHẬT ---
                    }}
                >
                    {/* 1. LAYER DƯỚI: TẠO BÓNG VÀ CHIỀU SÂU (DEPTH) */}
                    <View style={{
                        position: 'absolute',
                        width: NODE_SIZE + 10, 
                        height: NODE_SIZE + 10,
                        borderRadius: NODE_SIZE / 2 + 5, // Dùng giá trị cụ thể thay cho "50%"
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
                                    borderRadius: NODE_SIZE / 2, // Dùng giá trị cụ thể thay cho "50%"
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

    const fetchQuests = async (id: number | string) => {
        
        setError(null);
        try {
            // SỬ DỤNG ENDPOINT MỚI TRẢ VỀ TRẠNG THÁI QUEST (bao gồm isCompleted và isLocked)
            const response = await fetch(`${BASE_API_URL}quest-completions/status/user/${userInfo?.userId}/topic/${topicId}`);
            if (!response.ok) {
                // Xử lý khi không tìm thấy quest (ví dụ: topic không có quest)
                if (response.status === 404) {
                    setQuests([]);
                    return;
                }
                // Ném lỗi cho các lỗi HTTP khác
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data: QuestStatus[] = await response.json();
            console.log("data---quest-------------",data)
            setQuests(data);
        } catch (error) {
            console.error("Error fetching quest status:", error);
            setError(error instanceof Error ? error.message : "Lỗi khi tải trạng thái Quest.");
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

    const fetchQuestDetails = async (questId: number): Promise<QuestDetail | null> => {
        try {
            const response = await fetch(`${BASE_API_URL}quests/${questId}`);

            if (!response.ok) {
                if (response.status === 404) {
                     // Quest không tồn tại, có thể do lỗi dữ liệu
                    Alert.alert("Lỗi", `Không tìm thấy chi tiết Quest ID: ${questId}.`);
                    return null;
                }
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data: QuestDetail = await response.json();
            return data;

        } catch (error) {
            console.error("Lỗi khi tải chi tiết Quest:", error);
            Alert.alert("Lỗi", "Không thể tải chi tiết Quest. Vui lòng kiểm tra server.");
            return null;
        }
    };

    const handleStartQuest = () => {
        if (currentSelectedQuestId !== null) {
            console.log(`Bắt đầu Quest ID: ${currentSelectedQuestId} - Điều hướng...`);
            // Logic điều hướng đến màn hình Quest thực tế
            // Ví dụ: navigation.navigate('QuestScreen', { questId: currentSelectedQuestId });
            setIsModalVisible(false); // Đóng Modal
        }
    };

    const calculateQuestStats = (questDetail: QuestDetail): QuestStats => {
        const totalQuestions = questDetail.questions.length;
        
        // Thống kê theo độ khó (sử dụng bloomLevel của Question)
        const difficultyStats = questDetail.questions.reduce((acc, q) => {
            const key = q.bloomLevel.toLowerCase(); 
            acc[key] = (acc[key] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
        
        // Thống kê theo loại câu hỏi (questionType)
        const typeStats = questDetail.questions.reduce((acc, q) => {
            const key = q.questionType.toLowerCase();
            acc[key] = (acc[key] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return {
            questName: questDetail.questName,
            totalQuestions,
            difficultyStats,
            typeStats,
        };
    };

    const handleQuestPress = async (questId: number, isLocked: boolean, questName: string) => {
        if (isLocked) {
            Alert.alert(
                "Khóa!", 
                "Bạn cần hoàn thành màn trước đó để mở khóa màn này.",
                [{ text: "OK" }]
            );
            return;
        }

        console.log(`Đang tải chi tiết Quest: ${questName} (ID: ${questId})`);
        
        const questDetail = await fetchQuestDetails(questId);
        
        if (questDetail) {
            const stats = calculateQuestStats(questDetail);
            
            // LƯU TRỮ VÀ HIỂN THỊ MODAL
            setCurrentSelectedQuestId(questId); // Lưu ID quest đang được chọn
            setSelectedQuestStats(stats);      // Lưu thống kê quest
            setIsModalVisible(true);           // Mở Modal
        }
    };

    useEffect(() => {
        fetchUserInfo();
    }, []);

    useEffect(() => {
        console.log("----test 1----")
        if (topicId && userInfo?.userId) {
            
            setIsMapLoaded(false);
            setMapUri(getMapBackground(topicId));
            setMapPath(getMapPath(topicId))
            
            // Cần userInfo.userId để gọi API fetchQuests/status
            fetchQuests(topicId); 
            fetchTopicSummary();
        } else if (topicId) {
             // Trường hợp chưa có userInfo nhưng có topicId, chỉ fetch topic summary và map
             fetchTopicSummary();
        } else {
            console.error("Không tìm thấy topicId trong route params.");
            setError("Thiếu Topic ID.");
        }
    }, [topicId, userInfo]); // Thêm userInfo vào dependency list để đảm bảo fetchQuests chạy sau khi có userId


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
                        <Image style={styles.headerTitleRibbon}  source={require('../../../assets/ribbon.png')}/>
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
            <QuestStatsModal
                visible={isModalVisible}
                stats={selectedQuestStats}
                onClose={() => setIsModalVisible(false)}
                onStartQuest={handleStartQuest}
            />
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