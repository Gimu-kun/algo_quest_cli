import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, SafeAreaView, ActivityIndicator, Alert, RefreshControl, Image, TouchableOpacity } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { styles } from './achievementScreen.style';
import { UserInfo } from '../../../types/userType';
import { BASE_API_URL, BASE_URL } from '../../../ApiConfig';

// (Kiểu dữ liệu cho DTO từ UserProgressService)
interface TopicCompletionDto {
    topicId: number;
    topicName: string;
    totalQuests: number;
    completedQuests: number;
    completionPercentage: number; // <-- SỬA: Tên khớp với API
}
interface EarnedBadgeDto {
    badgeId: number;
    badgeName: string;
    description: string;
    imageUrl: string;
}
interface UserProgressDetailDto {
    userId: number;
    username: string;
    fullName: string;
    progressSummary: { // <-- SỬA: Tên khớp với API
        totalXp: number;
        currentLevel: number;
        questsCompletedCount: number;
        badgesEarnedCount: number;
    };
    topicCompletionRates: TopicCompletionDto[]; // <-- SỬA: Tên khớp với API
    earnedBadges: EarnedBadgeDto[];
}

// (Kiểu dữ liệu cho DTO từ UserRatingController)
interface UserRating {
    eloRating: number;
    winCount: number;
    lossCount: number;
}

export const AchievementScreen: React.FC = () => {
    const navigation = useNavigation();
    
    const [isLoading, setIsLoading] = useState(true);
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [stats, setStats] = useState<UserProgressDetailDto | null>(null);
    const [rating, setRating] = useState<UserRating | null>(null);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        try {
            // 1. Lấy thông tin User từ AsyncStorage
            const jsonValue = await AsyncStorage.getItem('authData');
            if (!jsonValue) throw new Error("Chưa đăng nhập.");
            
            const authData = JSON.parse(jsonValue);
            const user: UserInfo = authData.user;
            setUserInfo(user);

            // 2. Gọi 2 API song song
            const [statsResponse, ratingResponse] = await Promise.all([
                // API 1: Lấy thống kê (từ UserProgressController)
                fetch(`${BASE_API_URL}user-progress/my-stats/${user.userId}`),
                // API 2: Lấy xếp hạng (từ UserRatingController)
                fetch(`${BASE_API_URL}ratings/${user.userId}`)
            ]);

            // 3. Xử lý Stats
            if (statsResponse.ok) {
                const statsData = await statsResponse.json();
                setStats(statsData);
            } else {
                throw new Error("Không thể tải Thống kê");
            }

            // 4. Xử lý Rating
            if (ratingResponse.ok) {
                const ratingData = await ratingResponse.json();
                setRating(ratingData);
            } else {
                // (Có thể 404 nếu user chưa đấu trận nào)
                console.warn("Không tìm thấy thông tin Xếp hạng");
                setRating(null); // Đặt là null nếu 404
            }

        } catch (error: any) {
            Alert.alert("Lỗi", error.message || "Không thể tải dữ liệu thành tích.");
            navigation.goBack();
        } finally {
            setIsLoading(false);
        }
    }, [navigation]);

    // Tải dữ liệu mỗi khi vào màn hình
    useFocusEffect(
        useCallback(() => {
            fetchData();
        }, [fetchData])
    );

    // Tính toán tỷ lệ thắng
    const getWinRate = () => {
        if (!rating || (rating.winCount + rating.lossCount === 0)) {
            return 0;
        }
        return Math.round((rating.winCount / (rating.winCount + rating.lossCount)) * 100);
    };

    const renderContent = () => {
        if (isLoading) {
            return <ActivityIndicator size="large" color="#0F3460" style={{ marginTop: 50 }} />;
        }
        
        if (!stats || !userInfo) {
            return <Text style={styles.errorText}>Không có dữ liệu thành tích.</Text>;
        }

        const winRate = getWinRate();

        return (
            <>
                {/* Thẻ Thông tin chung */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Tổng quan</Text>
                    <View style={styles.profileHeader}>
                        <Image 
                            source={userInfo.avatar ? { uri: `${BASE_URL}${userInfo.avatar}` } : { uri: "" }} 
                            style={styles.avatar} 
                        />
                        <View style={styles.profileInfo}>
                            <Text style={styles.fullName}>{userInfo.fullName}</Text>
                            <Text style={styles.username}>@{userInfo.username}</Text>
                        </View>
                    </View>
                    <View style={styles.statGrid}>
                        <View style={styles.statBox}>
                            <Icon name="star-four-points" size={24} color="#f39c12" />
                            <Text style={styles.statValue}>{stats.progressSummary.totalXp}</Text>
                            <Text style={styles.statLabel}>Tổng XP</Text>
                        </View>
                        <View style={styles.statBox}>
                            <Icon name="chevron-double-up" size={24} color="#2ecc71" />
                            <Text style={styles.statValue}>{stats.progressSummary.currentLevel}</Text>
                            <Text style={styles.statLabel}>Cấp độ</Text>
                        </View>
                        <View style={styles.statBox}>
                            <Icon name="check-circle-outline" size={24} color="#3498db" />
                            <Text style={styles.statValue}>{stats.progressSummary.questsCompletedCount}</Text>
                            <Text style={styles.statLabel}>Quest đã qua</Text>
                        </View>
                    </View>
                </View>

                {/* Thẻ Xếp hạng */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Đấu hạng</Text>
                    {rating ? (
                        <View style={styles.statGrid}>
                            <View style={styles.statBox}>
                                <Icon name="chess-king" size={24} color="#E94560" />
                                <Text style={styles.statValue}>{rating.eloRating}</Text>
                                <Text style={styles.statLabel}>Điểm ELO</Text>
                            </View>
                            <View style={styles.statBox}>
                                <Icon name="trophy-award" size={24} color="#27ae60" />
                                <Text style={styles.statValue}>{rating.winCount}</Text>
                                <Text style={styles.statLabel}>Thắng</Text>
                            </View>
                            <View style={styles.statBox}>
                                <Icon name="shield-off" size={24} color="#7f8c8d" />
                                <Text style={styles.statValue}>{rating.lossCount}</Text>
                                <Text style={styles.statLabel}>Thua</Text>
                            </View>
                            <View style={styles.statBox}>
                                <Icon name="chart-pie" size={24} color="#9b59b6" />
                                <Text style={styles.statValue}>{winRate}%</Text>
                                <Text style={styles.statLabel}>Tỷ lệ thắng</Text>
                            </View>
                        </View>
                    ) : (
                        <Text style={styles.noDataText}>Chưa tham gia đấu hạng</Text>
                    )}
                </View>

                {/* Thẻ Tiến độ Chủ đề */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Tiến độ học tập</Text>
                    {stats.topicCompletionRates.length > 0 ? (
                        stats.topicCompletionRates.map(topic => (
                            <View key={topic.topicName} style={styles.progressItem}>
                                <View style={styles.progressHeader}>
                                    <Text style={styles.progressLabel}>{topic.topicName}</Text>
                                    {/* === (SỬA LỖI 4) THAY 'percentage' BẰNG 'completionPercentage' === */}
                                    <Text style={styles.progressPercent}>{Math.round(topic.completionPercentage)}%</Text>
                                </View>
                                <View style={styles.progressBarBg}>
                                    <View style={[styles.progressBarFill, { width: `${topic.completionPercentage}%` }]} />
                                </View>
                            </View>
                        ))
                    ) : (
                        <Text style={styles.noDataText}>Chưa hoàn thành chủ đề nào</Text>
                    )}
                </View>

                {/* Thẻ Huy hiệu */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Huy hiệu ({stats.progressSummary.badgesEarnedCount})</Text>
                    {stats.earnedBadges.length > 0 ? (
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.badgeScroll}>
                            {stats.earnedBadges.map(badge => (
                                <View key={badge.badgeId} style={styles.badgeBox}>
                                    <Image 
                                        source={{ uri: `${BASE_URL}${badge.imageUrl}` }} 
                                        style={styles.badgeImage} 
                                        resizeMode="contain"
                                    />
                                    <Text style={styles.badgeName} numberOfLines={1}>{badge.badgeName}</Text>
                                </View>
                            ))}
                        </ScrollView>
                    ) : (
                        <Text style={styles.noDataText}>Chưa có huy hiệu nào</Text>
                    )}
                </View>
            </>
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView
                style={styles.container}
                refreshControl={
                    <RefreshControl refreshing={isLoading} onRefresh={fetchData} />
                }
            >
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Icon name="arrow-left" size={24} color="#333" />
                    </TouchableOpacity>
                    <Text style={styles.title}>Thành Tích Cá Nhân</Text>
                    <View style={{ width: 40 }} />
                </View>
                {renderContent()}
            </ScrollView>
        </SafeAreaView>
    );
};