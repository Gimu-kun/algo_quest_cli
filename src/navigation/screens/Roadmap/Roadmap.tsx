import { View, Text, Image, useWindowDimensions, TouchableOpacity, Alert, ImageBackground, ScrollView } from "react-native";
import styles from "./roadmap.style";
import { Icon, IconButton } from "react-native-paper";
import { NavigationProp, RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { QuestSummary } from "../../../types/QuestType";
import { BASE_API_URL, BASE_URL } from "../../../ApiConfig";
import { Coordinate, MAP_COORDINATES } from "../../../constants/MapCoords";

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

const getMapBackground = (topicId: number | string): string => {
    const id = typeof topicId === 'string' ? parseInt(topicId) : topicId;
    const index = (id - 1) % MAP_BACKGROUNDS.length;
    return MAP_BACKGROUNDS[index >= 0 ? index : 0]; 
};

const getMapPath = (topicId: number | string): Coordinate[] => {
    const id = typeof topicId === 'string' ? parseInt(topicId) : topicId;
    
    // Sử dụng Modulo (%) để lặp lại map khi vượt quá số lượng 5
    // index = (id - 1) % 5, sau đó tìm mapId tương ứng
    const mapIndex = (id - 1) % MAP_COORDINATES.length;
    
    // Sử dụng mapIndex để lấy path
    return MAP_COORDINATES[mapIndex] ? MAP_COORDINATES[mapIndex].path : [];
};

type RoadmapRouteProp = RouteProp<RootStackParamList, 'Roadmap'>;
type RoadmapNavigationProp = NavigationProp<RootStackParamList, 'Roadmap'>;

export const Roadmap :React.FC = () => {
    const navigation = useNavigation<RoadmapNavigationProp>();
    const height = useWindowDimensions();
    const route = useRoute<RoadmapRouteProp>();
    const { topicId } = route.params;
    const mapUri = getMapBackground(topicId);
    const mapPath = getMapPath(topicId);
    const [quests, setQuests] = useState<QuestSummary[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(()=>{
        console.log("mapUri",mapUri)
    },[mapUri])

    const renderQuestNodes = () => {
        if (!quests || quests.length === 0 || mapPath.length === 0) {
            return null;
        }
        
        // Sắp xếp theo orderIndex để khớp với thứ tự tọa độ
        const sortedQuests = quests.sort((a, b) => a.orderIndex - b.orderIndex);

        // CÁC THAM SỐ CHUNG CHO NÚT
        const NODE_SIZE = 55; // Kích thước tổng thể của nút
        const DEPTH_OFFSET = 3; // Độ lệch (offset) để tạo bóng đổ
        
        // Bảng màu cho hiệu ứng 3D dựa trên Difficulty
        const colorPalette = {
            easy: { primary: '#66BB6A', shadow: '#388E3C' }, // Xanh lá
            medium: { primary: '#FFD54F', shadow: '#FFA000' }, // Vàng/Cam
            hard: { primary: '#EF5350', shadow: '#D32F2F' }, // Đỏ
        };

        return sortedQuests.map((quest, index) => {   
            const coordIndex = Math.min(index, mapPath.length - 1); 
            const position = mapPath[coordIndex];
            
            const colors = colorPalette[quest.difficulty as keyof typeof colorPalette] || colorPalette.easy;
                
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
                    </View>
                    
                </TouchableOpacity>
            );
        });
    };

    const handleGoBack = () => {
        navigation.goBack();
    };

    const fetchQuestsSummary = async (id: number | string) => {
        setLoading(true);
        setError(null);
        
        const apiUrl = `${BASE_API_URL}topics/${id}/quests/summary`;

        try {
            const response = await fetch(apiUrl);

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data: QuestSummary[] = await response.json();
            
            console.log("[API Success] Dữ liệu Quest đã tải:"); 
            console.log(data);
            
            setQuests(data);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Đã xảy ra lỗi không xác định";
            console.error("[API Error] Lỗi khi tải dữ liệu Quest:", errorMessage);
            Alert.alert("Lỗi", "Không thể tải danh sách Quest. Vui lòng kiểm tra server.");
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (topicId) {
            fetchQuestsSummary(topicId);
        } else {
            console.error("Không tìm thấy topicId trong route params.");
            setError("Thiếu Topic ID.");
        }
    }, [topicId]);

    if (loading && quests.length === 0) {
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
    
    return (
        <View style={[styles.page]}>
            <View style={styles.header}>
                <View style={styles.headerContainer}>
                    <IconButton iconColor='#f20717' size={45} icon="arrow-left-thick" onPress={handleGoBack}/>
                    <View style={styles.headerTitleContainer}>
                        <Image style={styles.headerTitleRibbon}  source={require('../../../assets/ribbon.png')}/>
                        <Text style={styles.headerTitle}>Màn 1</Text>
                    </View>
                    <IconButton iconColor='#f20717' size={45} icon="cog"/>
                </View>
            </View>
            <ImageBackground 
                source={{ uri: mapUri }}
                style={{ flex: 1, width: '100%', height: '100%' }} 
                imageStyle={{ resizeMode: 'cover' }}
            >
                    <View style={{ flex: 1 }}> 
                        {renderQuestNodes()}
                    </View>
            </ImageBackground>
            <View style={styles.footer}>
                <View style={styles.footerTop}>
                    <TouchableOpacity style={styles.sectionNavBtn}>
                        <Icon color='#f20717' size={45} source="arrow-left-thick"/>
                        <Text style={styles.sectionNavBtnTxt}>Màn trước</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.sectionNavBtn}>
                        <Text style={styles.sectionNavBtnTxt}>Màn sau</Text>
                        <Icon color='#f20717' size={45} source="arrow-right-thick"/>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}