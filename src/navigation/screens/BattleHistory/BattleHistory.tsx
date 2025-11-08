import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import { RootStackParamList } from '../../types'; 
import { UserInfo } from '../../../types/userType'; 
import { BASE_API_URL } from '../../../ApiConfig';

// Định nghĩa kiểu dữ liệu trả về từ API /history
type HistoryItemDto = {
  battleId: number;
  topicName: string;
  playedAt: string; // (dạng ISO string)
  myScore: number;
  winner: boolean; 
  opponentUsername: string;
  opponentScore: number;
};

// Định nghĩa kiểu cho navigation
type NavigationProps = {
    navigate(screen: keyof RootStackParamList, params?: any): void;
}

export const BattleHistory: React.FC = () => {
    const navigation = useNavigation<NavigationProps>();
    const [history, setHistory] = useState<HistoryItemDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Dùng useFocusEffect để tải lại mỗi khi quay về màn hình này
    useFocusEffect(
        useCallback(() => {
            const fetchHistory = async () => {
                setIsLoading(true);
                setError(null);
                try {
                    // 1. Lấy authData
                    const jsonValue = await AsyncStorage.getItem('authData');
                    if (!jsonValue) throw new Error("Chưa đăng nhập.");
                    
                    const authData = JSON.parse(jsonValue);
                    const token = authData.token;
                    const user: UserInfo = authData.user;

                    if (!user || !user.username) {
                        throw new Error("Không tìm thấy thông tin người dùng.");
                    }

                    // 2. Gọi API (Sử dụng username làm query param)
                    const response = await fetch(`${BASE_API_URL}battles/history?username=${user.username}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`, // Gửi kèm token để xác thực
                        },
                    });

                    if (!response.ok) {
                        throw new Error('Không thể tải lịch sử trận đấu.');
                    }

                    const data: HistoryItemDto[] = await response.json();
                    setHistory(data);
                } catch (e: any) {
                    setError(e.message);
                    Alert.alert("Lỗi", e.message);
                } finally {
                    setIsLoading(false);
                }
            };

            fetchHistory();
        }, [])
    );

    // Hàm render
    const renderItem = ({ item }: { item: HistoryItemDto }) => {
        const isWin = item.winner; 
        const resultColor = isWin ? '#4CAF50' : (item.myScore === item.opponentScore ? '#FFA000' : '#F44336'); // Xanh, Vàng, Đỏ
        const resultText = isWin ? 'Thắng' : (item.myScore === item.opponentScore ? 'Hòa' : 'Thua');

        return (
            <TouchableOpacity 
                style={styles.itemContainer} 
                onPress={() => navigation.navigate('BattleDetail', { battleId: item.battleId })}
            >
                <View style={[styles.resultIndicator, { backgroundColor: resultColor }]} />
                <View style={styles.infoContainer}>
                    <Text style={styles.topicName}>{item.topicName}</Text>
                    <Text style={styles.opponentName}>vs. {item.opponentUsername}</Text>
                    <Text style={styles.dateText}>{new Date(item.playedAt).toLocaleString('vi-VN')}</Text>
                </View>
                <View style={styles.scoreContainer}>
                    <Text style={[styles.scoreText, { color: resultColor }]}>{resultText}</Text>
                    <Text style={styles.scoreDetail}>{item.myScore} - {item.opponentScore}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    if (isLoading) {
        return <ActivityIndicator style={styles.loading} size="large" />;
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.headerTitle}>Lịch sử Đấu</Text>
            {error && <Text style={styles.errorText}>{error}</Text>}
            <FlatList
                data={history}
                renderItem={renderItem}
                keyExtractor={(item) => item.battleId.toString()}
                ListEmptyComponent={<Text style={styles.errorText}>Bạn chưa có trận đấu nào.</Text>}
            />
        </SafeAreaView>
    );
};

// (Thêm StyleSheet)
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#1E1E1E' },
    loading: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1E1E1E' },
    errorText: { color: '#999', textAlign: 'center', marginTop: 20 },
    headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#FFF', padding: 15, textAlign: 'center' },
    itemContainer: {
        flexDirection: 'row',
        backgroundColor: '#2A2A2A',
        marginHorizontal: 10,
        marginVertical: 5,
        borderRadius: 8,
        overflow: 'hidden',
    },
    resultIndicator: {
        width: 8,
    },
    infoContainer: {
        flex: 1,
        padding: 12,
    },
    topicName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFF',
    },
    opponentName: {
        fontSize: 14,
        color: '#AAA',
        marginTop: 4,
    },
    dateText: {
        fontSize: 12,
        color: '#888',
        marginTop: 4,
    },
    scoreContainer: {
        padding: 12,
        alignItems: 'flex-end',
    },
    scoreText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    scoreDetail: {
        fontSize: 14,
        color: '#FFF',
        marginTop: 4,
    },
});

export default BattleHistory;