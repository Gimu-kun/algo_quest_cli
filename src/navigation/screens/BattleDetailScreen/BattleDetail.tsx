import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from '../../types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // (Cần cài đặt)
import { BASE_API_URL } from '../../../ApiConfig';

// Định nghĩa kiểu dữ liệu trả về từ API /battles/{id}
type ParticipantDto = {
    username: string;
    avatar: string | null;
    score: number;
    rankInBattle: number;
    winner: boolean;
};

type DetailDto = {
    battleId: number;
    topicName: string;
    questName: string;
    playedAt: string;
    participants: ParticipantDto[];
};

type DetailRouteProp = RouteProp<RootStackParamList, 'BattleDetail'>;
type NavigationProps = { goBack(): void; }

export const BattleDetail: React.FC = () => {
    const route = useRoute<DetailRouteProp>();
    const navigation = useNavigation<NavigationProps>();
    const { battleId } = route.params;

    const [detail, setDetail] = useState<DetailDto | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const jsonValue = await AsyncStorage.getItem('authData');
                if (!jsonValue) throw new Error("Chưa đăng nhập.");
                const token = JSON.parse(jsonValue).token;

                const response = await fetch(`${BASE_API_URL}battles/${battleId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Không thể tải chi tiết trận đấu.');
                }
                const data: DetailDto = await response.json();
                setDetail(data);
            } catch (e: any) {
                setError(e.message);
                Alert.alert("Lỗi", e.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDetail();
    }, [battleId]);

    if (isLoading) {
        return <ActivityIndicator style={styles.loading} size="large" />;
    }

    if (error || !detail) {
        return <View style={styles.loading}><Text style={styles.errorText}>{error || 'Không tìm thấy dữ liệu'}</Text></View>;
    }

    // Sắp xếp người chơi (hạng 1 lên trước)
    const sortedParticipants = [...detail.participants].sort((a, b) => a.rankInBattle - b.rankInBattle);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                 <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                     <Icon name="chevron-left" size={30} color="#fff" />
                 </TouchableOpacity>
                 <Text style={styles.headerTitle}>Chi tiết Trận đấu</Text>
            </View>

            <View style={styles.summaryBox}>
                <Text style={styles.topicName}>{detail.topicName}</Text>
                <Text style={styles.questName}>{detail.questName}</Text>
                <Text style={styles.dateText}>{new Date(detail.playedAt).toLocaleString('vi-VN')}</Text>
            </View>

            <View style={styles.participantList}>
                {sortedParticipants.map((p) => (
                    <View key={p.username} style={[styles.playerCard, p.winner && styles.winnerCard]}>
                        {/* (Bạn có thể thêm <Image source={{uri: p.avatar}} /> ở đây) */}
                        <View style={styles.avatarPlaceholder} /> 
                        
                        <View style={styles.playerInfo}>
                            <Text style={styles.playerName}>{p.username}</Text>
                            <Text style={styles.playerRank}>Hạng: {p.rankInBattle}</Text>
                        </View>
                        <Text style={styles.playerScore}>{p.score} điểm</Text>
                        {p.winner && <Icon name="crown" size={24} color="#FFD700" style={styles.crownIcon} />}
                    </View>
                ))}
            </View>
        </SafeAreaView>
    );
};

// (Thêm StyleSheet)
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#1E1E1E' },
    loading: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1E1E1E' },
    errorText: { color: '#999', textAlign: 'center', marginTop: 20 },
    header: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        paddingHorizontal: 10, 
        paddingVertical: 15 
    },
    backButton: {
        position: 'absolute',
        left: 10,
        top: 10,
        padding: 5, // Tăng vùng bấm
        zIndex: 1,
    },
    headerTitle: { 
        flex: 1, 
        fontSize: 22, 
        fontWeight: 'bold', 
        color: '#FFF', 
        textAlign: 'center' 
    },
    summaryBox: {
        backgroundColor: '#2A2A2A',
        padding: 15,
        margin: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    topicName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFF',
    },
    questName: {
        fontSize: 16,
        color: '#AAA',
        marginTop: 5,
    },
    dateText: {
        fontSize: 14,
        color: '#888',
        marginTop: 10,
    },
    participantList: {
        marginTop: 10,
    },
    playerCard: {
        flexDirection: 'row',
        backgroundColor: '#2A2A2A',
        marginHorizontal: 10,
        marginVertical: 5,
        borderRadius: 8,
        padding: 15,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    winnerCard: {
        borderColor: '#FFD700', // Viền vàng cho người thắng
    },
    avatarPlaceholder: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#555',
        marginRight: 15,
    },
    playerInfo: {
        flex: 1,
    },
    playerName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFF',
    },
    playerRank: {
        fontSize: 14,
        color: '#AAA',
        marginTop: 4,
    },
    playerScore: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFF',
    },
    crownIcon: {
        marginLeft: 10,
    }
});

export default BattleDetail;