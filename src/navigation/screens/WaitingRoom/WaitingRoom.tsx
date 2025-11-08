import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator, BackHandler, Modal, FlatList, TextInput } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// (Giả sử bạn đã có AsyncStorage helper)
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import { styles } from './waitingRoom.style';
import { RootStackParamList } from '../../types';
import { 
    db, 
    auth, 
    appId, 
    authenticate, 
    doc, 
    onSnapshot, 
    setDoc, 
    updateDoc, 
    deleteDoc,
    arrayUnion,
    arrayRemove 
} from '../../../firebase';
import { TopicSummary } from '../../../types/TopicType';
import { BASE_API_URL } from '../../../ApiConfig';
import { QuestDetail } from '../../../types/SinglePlayTypes';
import { fetchQuestDetails } from '../../../Utils/QuestUtils';
import { MultiplayerGameState } from '../../../types/MultiplayerTypes';

// Kiểu dữ liệu
export type Player = {
    userId: string;
    username: string;
    avatar: string | null;
};

type BattleRoom = {
    hostId: string;
    status: 'waiting' | 'in_progress';
    topicId: number;
    topicName: string;
    players: Player[];
};

type WaitingRoomRouteProp = RouteProp<RootStackParamList, 'WaitingRoom'>;
type NavigationProps = {
  navigate(screen: string, params?: any): void;
  goBack(): void;
}

// Hàm helper tạo ID phòng ngẫu nhiên
const generateRoomId = () => Math.random().toString(36).substring(2, 7).toUpperCase();

const WaitingRoom: React.FC = () => {
    const TOPIC_API_URL = `${BASE_API_URL}topics/summary`;
    const USER_API_URL = `${BASE_API_URL}users`;
    const navigation = useNavigation<NavigationProps>();
    const route = useRoute<WaitingRoomRouteProp>();
    
    const [currentUser, setCurrentUser] = useState<Player | null>(null);
    const [roomId, setRoomId] = useState<string | null>(null);
    const [roomData, setRoomData] = useState<BattleRoom | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const [isTopicModalVisible, setIsTopicModalVisible] = useState(false);
    const [allTopics, setAllTopics] = useState<TopicSummary[]>([]);
    const [isFetchingTopics, setIsFetchingTopics] = useState(false);

    const [isInviteModalVisible, setIsInviteModalVisible] = useState(false);
    const [inviteUsername, setInviteUsername] = useState("");
    const [isInviting, setIsInviting] = useState(false);

    const isHost = roomData?.hostId === currentUser?.userId;
    const guest = roomData?.players.find(p => p.userId !== roomData.hostId);
    const host = roomData?.players.find(p => p.userId === roomData.hostId);

    // Lấy thông tin người dùng (tương tự SinglePlay)
    const fetchUserInfo = async () => {
        try {
            // 1. Xác thực Firebase (quan trọng)
            const firebaseUser = await authenticate();
            
            // 2. Lấy thông tin chi tiết (ví dụ từ AsyncStorage)
            const jsonValue = await AsyncStorage.getItem('authData');
            if (jsonValue !== null) {
                const authData = JSON.parse(jsonValue);
                const userData = authData.user;
                
                const userInfo: Player = {
                    userId: firebaseUser.uid, // Luôn dùng UID của Firebase làm ID
                    username: userData.username,
                    avatar: userData.avatar,
                };
                setCurrentUser(userInfo);
                return userInfo;
            }
            throw new Error("Không tìm thấy thông tin người dùng trong AsyncStorage.");

        } catch (e) {
            console.error("Lỗi xác thực hoặc lấy thông tin:", e);
            Alert.alert("Lỗi", "Không thể xác thực người dùng.", [{ text: "OK", onPress: () => navigation.goBack() }]);
            return null;
        }
    };

    const handleStartGame = async () => {
        if (!isHost || roomData?.players.length !== 2 || !roomId || !currentUser) {
            Alert.alert("Chưa sẵn sàng", "Cần đủ 2 người chơi để bắt đầu.");
            return;
        }

        try {
            // 1. Lấy Quest ngẫu nhiên từ Backend (API mới)
            const topicId = roomData.topicId;
            const questResponse = await fetch(`${BASE_API_URL}topics/${topicId}/random-quest-id`);
            if (!questResponse.ok) throw new Error("Không thể lấy Quest ngẫu nhiên.");
            const randomQuestId = await questResponse.json();

            // 2. Lấy chi tiết Quest (Sử dụng lại hàm của SinglePlay)
            const questData = await fetchQuestDetails(randomQuestId);

            // 3. Tính tổng điểm
            const totalScore = questData.questions.reduce((sum, q) => sum + q.score, 0);

            // 4. Tạo Game State mới trên Firestore
            const gameRoomRef = doc(db, 'artifacts', appId, 'public', 'data', 'battle_games', roomId);
            
            const initialGameState: MultiplayerGameState = {
                quest: questData,
                topicId: topicId,
                startTime: Date.now(),
                currentQuestionIndex: 0,
                gameState: 'preview', // Bắt đầu ở màn hình xem trước
                questionTimer: 3, // 3 giây
                answerTimer: 5,
                activePlayerId: null,
                playerScores: {
                    [roomData.players[0].userId]: 0, // Player A
                    [roomData.players[1].userId]: 0, // Player B
                },
                totalPossibleScore: totalScore,
                lastAnswer: null
            };
            
            await setDoc(gameRoomRef, initialGameState);

            // 5. Cập nhật Lobby (để kích hoạt chuyển trang)
            const lobbyRoomRef = doc(db, 'artifacts', appId, 'public', 'data', 'battle_rooms', roomId);
            await updateDoc(lobbyRoomRef, {
                status: 'in_progress'
            });

            // (Hàm onSnapshot trong useEffect sẽ tự động điều hướng)
            
        } catch (error: any) {
            console.error("Lỗi khi bắt đầu game:", error);
            Alert.alert("Lỗi", error.message || "Không thể bắt đầu trận đấu.");
        }
    };

    const handleSendInvite = async () => {
        if (!inviteUsername || !currentUser || !roomId || !roomData) return;

        const targetUsername = inviteUsername.trim();
        if (targetUsername.toLowerCase() === currentUser.username.toLowerCase()) {
            Alert.alert("Lỗi", "Bạn không thể tự mời chính mình.");
            return;
        }

        setIsInviting(true);
        try {
            // Bước 1: Kiểm tra xem username có tồn tại trên Server Spring Boot không
            const checkResponse = await fetch(`${USER_API_URL}/check-username?username=${targetUsername}`);
            if (!checkResponse.ok) {
                // (Scenario 2)
                if (checkResponse.status === 404) {
                    Alert.alert("Không tìm thấy", `Không tìm thấy người dùng có tên: ${targetUsername}`);
                } else {
                    Alert.alert("Lỗi", "Không thể kiểm tra người dùng.");
                }
                setIsInviting(false);
                return;
            }

            // Bước 2: (Scenario 1) Gửi lời mời qua Firestore
            // Chúng ta tạo 1 document trong 'invitations' với tên là username của người nhận
            const inviteRef = doc(db, 'invitations', targetUsername);
            
            await setDoc(inviteRef, {
                pending_invite: {
                    roomId: roomId,
                    roomName: roomData.topicName,
                    hostUsername: currentUser.username
                }
            });

            Alert.alert("Đã gửi", `Đã gửi lời mời đến ${targetUsername}.`);
            setIsInviteModalVisible(false);
            setInviteUsername("");

        } catch (error: any) {
            Alert.alert("Lỗi", error.message || "Lỗi khi gửi lời mời.");
        } finally {
            setIsInviting(false);
        }
    };

    // Hàm tạo phòng (cho chủ phòng)
    const createRoom = async (user: Player) => {
        const newRoomId = generateRoomId();
        setRoomId(newRoomId);
        
        const newRoomData: BattleRoom = {
            hostId: user.userId,
            status: 'waiting',
            topicId: 1, // Chủ đề mặc định
            topicName: 'Stack & Queue', // Tên mặc định
            players: [user], // Chỉ có chủ phòng
        };

        // Đường dẫn Firestore (công khai)
        const roomRef = doc(db, 'artifacts', appId, 'public', 'data', 'battle_rooms', newRoomId);
        
        try {
            await setDoc(roomRef, newRoomData);
            return newRoomId; // Trả về ID để bắt đầu lắng nghe
        } catch (error) {
            console.error("Lỗi tạo phòng:", error);
            Alert.alert("Lỗi", "Không thể tạo phòng.", [{ text: "OK", onPress: () => navigation.goBack() }]);
            return null;
        }
    };

    // Hàm tham gia phòng (cho khách)
    const joinRoom = async (user: Player, existingRoomId: string) => {
        setRoomId(existingRoomId);
        const roomRef = doc(db, 'artifacts', appId, 'public', 'data', 'battle_rooms', existingRoomId);

        try {
            // Thêm người chơi vào mảng 'players'
            await updateDoc(roomRef, {
                players: arrayUnion(user)
            });
            return existingRoomId;
        } catch (error) {
            console.error("Lỗi tham gia phòng:", error);
            Alert.alert("Lỗi", "Không thể tham gia phòng này (có thể phòng đã đầy hoặc không tồn tại).", [{ text: "OK", onPress: () => navigation.goBack() }]);
            return null;
        }
    };

    // --- MAIN useEffect: Khởi tạo và Lắng nghe ---
    useEffect(() => {
        let unsubscribe: (() => void) | null = null;
        let localUser: Player | null = null;

        const initialize = async () => {
            setIsLoading(true);
            const user = await fetchUserInfo();
            if (!user) return;
            localUser = user;
            let R_ID = route.params.roomId;

            if (R_ID === null) {
                // Kịch bản 1: TẠO PHÒNG
                R_ID = await createRoom(user);
            } else {
                // Kịch bản 2: THAM GIA PHÒNG
                R_ID = await joinRoom(user, R_ID);
            }

            if (!R_ID) return; // Nếu tạo/tham gia thất bại

            // Bắt đầu lắng nghe (onSnapshot)
            const roomRef = doc(db, 'artifacts', appId, 'public', 'data', 'battle_rooms', R_ID);
            
            unsubscribe = onSnapshot(roomRef, (docSnap:any) => {
                if (docSnap.exists()) {
                    const data = docSnap.data() as BattleRoom;
                    setRoomData(data);
                    
                    if (localUser) {
                          const amIInLobby = data.players.some(p => p.userId === localUser!.userId);
                          // Nếu tôi không phải Host VÀ tôi không còn trong phòng
                          if (data.hostId !== localUser.userId && !amIInLobby) {
                              if (unsubscribe) unsubscribe(); // Dừng lắng nghe
                              Alert.alert("Thông báo", "Bạn đã bị đuổi khỏi phòng.");
                              navigation.navigate('HomeTabs', { screen: 'Home' }); // Về Home
                              return; // Dừng xử lý
                          }
                      }

                    // Xử lý logic game (ví dụ: host bắt đầu)
                    if (data.status === 'in_progress') {
                        // (Hủy đăng ký listener của phòng chờ TRƯỚC KHI chuyển trang)
                        if (unsubscribe) unsubscribe();
                        // Chuyển sang màn hình Game
                        navigation.navigate('MultiplayerGame', { roomId: R_ID! });
                    }
                } else {
                    // Phòng đã bị xóa (ví dụ: chủ phòng rời đi)
                    Alert.alert("Phòng đã đóng", "Chủ phòng đã rời đi.", [{ text: "OK", onPress: () => navigation.goBack() }]);
                }
                setIsLoading(false);
            });
        };

        initialize();

        // Hàm dọn dẹp: Hủy đăng ký listener
        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, []); // Chỉ chạy 1 lần

    // --- useEffect: Xử lý nút Back (Rời phòng) ---
    useEffect(() => {
        const backAction = () => {
            handleLeaveRoom();
            return true; // Ngăn chặn hành vi back mặc định
        };
        const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
        return () => backHandler.remove();
    }, [roomData, currentUser, isHost]); // Cần state mới nhất

    // --- CÁC HÀM XỬ LÝ (ACTIONS) ---

    const handleLeaveRoom = async () => {
        if (!roomId || !currentUser || !roomData) return;

        const roomRef = doc(db, 'artifacts', appId, 'public', 'data', 'battle_rooms', roomId);

        try {
            if (isHost) {
                // (Chủ phòng rời đi)
                if (guest) {
                    // (Còn khách) -> Trao quyền chủ phòng
                    await updateDoc(roomRef, {
                        hostId: guest.userId,
                        players: arrayRemove(currentUser)
                    });
                } else {
                    // (Chủ phòng là người cuối cùng) -> Xóa phòng
                    await deleteDoc(roomRef);
                }
            } else {
                // (Khách rời đi) -> Chỉ cần xóa tên
                await updateDoc(roomRef, {
                    players: arrayRemove(currentUser)
                });
            }
            navigation.goBack();
        } catch (error) {
            console.error("Lỗi khi rời phòng:", error);
        }
    };

    const handleKickPlayer = async () => {
        if (!isHost || !guest || !roomId) return;
        
        const roomRef = doc(db, 'artifacts', appId, 'public', 'data', 'battle_rooms', roomId);
        try {
            // Xóa khách khỏi mảng 'players'
            await updateDoc(roomRef, {
                players: arrayRemove(guest)
            });
        } catch (error) {
            console.error("Lỗi khi kick:", error);
        }
    };

    const handleChangeTopic = async () => {
        if (!isHost) return;
        
        // Nếu chưa có danh sách chủ đề, tải về
        if (allTopics.length === 0) {
            setIsFetchingTopics(true);
            try {
                const response = await fetch(TOPIC_API_URL);
                if (!response.ok) {
                    throw new Error("Không thể tải danh sách chủ đề.");
                }
                const data: TopicSummary[] = await response.json();
                setAllTopics(data);
            } catch (error: any) {
                Alert.alert("Lỗi", error.message || "Lỗi tải chủ đề.");
            } finally {
                setIsFetchingTopics(false);
            }
        }
        // Mở Modal
        setIsTopicModalVisible(true);
    };

    const handleSelectTopic = async (topic: TopicSummary) => {
        if (!isHost || !roomId) return;
        
        // 1. Đóng Modal
        setIsTopicModalVisible(false);

        // 2. Cập nhật Firestore
        const roomRef = doc(db, 'artifacts', appId, 'public', 'data', 'battle_rooms', roomId);
        try {
            await updateDoc(roomRef, {
                topicId: topic.topicId,
                topicName: topic.topicName
            });
        } catch (error) {
            console.error("Lỗi cập nhật chủ đề:", error);
            Alert.alert("Lỗi", "Không thể cập nhật chủ đề.");
        }
    };

    // --- RENDER ---
    if (isLoading || !roomData) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" />
                <Text style={styles.loadingText}>
                    {roomId ? `Đang vào phòng ${roomId}...` : 'Đang tạo phòng...'}
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* 1. Tiêu đề và ID Phòng */}
            <View style={styles.header}>
                <TouchableOpacity onPress={handleLeaveRoom} style={styles.backButton}>
                    <Icon name="chevron-left" size={30} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.title}>Phòng chờ</Text>
                <View style={styles.roomIdContainer}>
                    <Text style={styles.roomIdText}>{roomId}</Text>
                    <Icon name="content-copy" size={20} color="#fff" />
                </View>
            </View>

            {/* 2. Khu vực người chơi */}
            <View style={styles.playersContainer}>
                {/* Slot 1: Chủ phòng */}
                <View style={styles.playerSlot}>
                    {host ? (
                        <>
                            <View style={styles.avatarPlaceholder} />
                            <Text style={styles.playerName}>{host.username}</Text>
                            <View style={styles.hostBadge}>
                                <Text style={styles.hostText}>Chủ phòng</Text>
                            </View>
                        </>
                    ) : (
                        <Text style={styles.waitingText}>Lỗi: Không tìm thấy chủ phòng</Text>
                    )}
                </View>

                {/* Slot 2: Khách */}
                <View style={styles.playerSlot}>
                    {guest ? (
                        <>
                            <View style={styles.avatarPlaceholder} />
                            <Text style={styles.playerName}>{guest.username}</Text>
                            {isHost && (
                                <TouchableOpacity 
                                    style={styles.kickButton} 
                                    onPress={handleKickPlayer}>
                                    <Icon name="close" size={20} color="#fff" />
                                </TouchableOpacity>
                            )}
                        </>
                    ) : (
                        <Text style={styles.waitingText}>Đang chờ người chơi...</Text>
                    )}
                </View>
            </View>
            
            {/* 3. Thông tin chủ đề */}
            <View style={styles.topicContainer}>
                <Text style={styles.topicLabel}>Chủ đề:</Text>
                <Text style={styles.topicName}>{roomData.topicName}</Text>
                {isHost && (
                    <TouchableOpacity 
                        style={styles.changeTopicButton} 
                        onPress={handleChangeTopic}>
                        <Text style={styles.changeTopicText}>Thay đổi</Text>
                    </TouchableOpacity>
                )}
            </View>
            
            {/* 4. Nút điều khiển (Chủ phòng) */}
            {isHost && (
                <View style={styles.hostControls}>
                    <TouchableOpacity
                        style={[styles.startButton, styles.inviteButton]}
                        onPress={() => setIsInviteModalVisible(true)}
                        disabled={roomData.players.length >= 2} // Vô hiệu hóa nếu phòng đầy
                    >
                        <Text style={styles.startButtonText}>Mời người chơi</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.startButton,
                            roomData.players.length < 2 && styles.disabledButton
                        ]}
                        onPress={handleStartGame}
                        disabled={roomData.players.length < 2}
                    >
                        <Text style={styles.startButtonText}>Bắt đầu</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* 4. Nút điều khiển (Khách) */}
            {!isHost && (
                <View style={styles.hostControls}>
                    <TouchableOpacity
                        style={[styles.startButton, styles.leaveButton]}
                        onPress={handleLeaveRoom}
                    >
                        <Text style={styles.startButtonText}>Rời khỏi phòng</Text>
                    </TouchableOpacity>
                </View>
            )}
            <Modal
                transparent={true}
                visible={isTopicModalVisible}
                animationType="fade"
                onRequestClose={() => setIsTopicModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Chọn chủ đề</Text>
                        
                        {/* Hiển thị loading khi đang tải API */}
                        {isFetchingTopics ? (
                            <ActivityIndicator size="large" color="#FFFFFF" />
                        ) : (
                            // Hiển thị danh sách chủ đề
                            <FlatList
                                data={allTopics}
                                keyExtractor={(item) => item.topicId.toString()}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={styles.topicItem}
                                        onPress={() => handleSelectTopic(item)}
                                    >
                                        <Text style={styles.topicItemName}>{item.topicName}</Text>
                                        <Text style={styles.topicItemCount}>{item.questCount} màn</Text>
                                    </TouchableOpacity>
                                )}
                            />
                        )}
                        
                        {/* Nút Hủy */}
                        <TouchableOpacity
                            style={styles.modalCloseButton}
                            onPress={() => setIsTopicModalVisible(false)}
                        >
                            <Text style={styles.modalCloseText}>Hủy</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            <Modal
                transparent={true}
                visible={isInviteModalVisible}
                animationType="fade"
                onRequestClose={() => setIsInviteModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Mời bằng Username</Text>
                        
                        <TextInput
                            style={styles.inviteInput}
                            placeholder="Nhập username..."
                            placeholderTextColor="#888"
                            value={inviteUsername}
                            onChangeText={setInviteUsername}
                            autoCapitalize="none"
                        />
                        
                        <TouchableOpacity
                            style={[styles.modalCloseButton, isInviting && styles.disabledButton]}
                            onPress={handleSendInvite}
                            disabled={isInviting}
                        >
                            {isInviting ? (
                                <ActivityIndicator color="#FFF" />
                            ) : (
                                <Text style={styles.modalCloseText}>Gửi lời mời</Text>
                            )}
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.modalCancelButton]}
                            onPress={() => setIsInviteModalVisible(false)}
                        >
                            <Text style={styles.modalCloseText}>Hủy</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

export default WaitingRoom;
