import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, SafeAreaView, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { BASE_API_URL } from '../../../ApiConfig';

// Định nghĩa kiểu dữ liệu cho mỗi hàng trong bảng xếp hạng
type UserStats = {
  username: string;
  elo: number;
  wins: number;
  losses: number;
};

// Kiểu cho các ô có style flex
type FlexStyle = { flex: number };

const LeaderboardScreen: React.FC = () => {
  const [leaderboardData, setLeaderboardData] = useState<UserStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Sử dụng useFocusEffect để fetch dữ liệu mỗi khi màn hình được focus
  useFocusEffect(
    useCallback(() => {
      const fetchLeaderboard = async () => {
        setIsLoading(true);
        setError(null);
        try {
          // [QUAN TRỌNG] Giả định endpoint này tồn tại ở backend của bạn
          const response = await fetch(`${BASE_API_URL}users/leaderboard`);
          
          if (!response.ok) {
            throw new Error('Không thể tải dữ liệu bảng xếp hạng.');
          }
          
          const data: UserStats[] = await response.json();
          setLeaderboardData(data);
        } catch (e) {
          if (e instanceof Error) {
            setError(e.message);
          } else {
            setError('Đã xảy ra lỗi không xác định.');
          }
        } finally {
          setIsLoading(false);
        }
      };

      fetchLeaderboard();

      // Cleanup function (nếu cần)
      return () => {
        // Ví dụ: hủy bỏ fetch nếu component unmount
      };
    }, [])
  );

  // Hàm tính toán tỉ lệ thắng
  const getWinRate = (wins: number, losses: number): string => {
    const totalGames = wins + losses;
    if (totalGames === 0) {
      return '0%';
    }
    const rate = (wins / totalGames) * 100;
    return `${rate.toFixed(1)}%`; // Làm tròn 1 chữ số thập phân
  };

  // Hàm style cho 3 hạng đầu
  const getRankStyle = (rank: number) => {
    if (rank === 1) return styles.rank1;
    if (rank === 2) return styles.rank2;
    if (rank === 3) return styles.rank3;
    return styles.rankNormal;
  };

  // Render tiêu đề của FlatList
  const renderHeader = () => (
    <View style={styles.headerRow}>
      <Text style={[styles.headerText, styles.cellRank]}>Hạng</Text>
      <Text style={[styles.headerText, styles.cellUser]}>Người Chơi</Text>
      <Text style={[styles.headerText, styles.cellElo]}>ELO</Text>
      <Text style={[styles.headerText, styles.cellStats]}>Thắng</Text>
      <Text style={[styles.headerText, styles.cellStats]}>Thua</Text>
      <Text style={[styles.headerText, styles.cellWinRate]}>Tỉ Lệ</Text>
    </View>
  );

  // Render mỗi hàng trong FlatList
  const renderItem = ({ item, index }: { item: UserStats; index: number }) => {
    const rank = index + 1;
    const winRate = getWinRate(item.wins, item.losses);

    return (
      <View style={styles.row}>
        <Text style={[styles.cell, styles.cellRank, getRankStyle(rank)]}>{rank}</Text>
        <Text style={[styles.cell, styles.cellUser]} numberOfLines={1}>{item.username}</Text>
        <Text style={[styles.cell, styles.cellElo]}>{item.elo}</Text>
        <Text style={[styles.cell, styles.cellStats, styles.winsText]}>{item.wins}</Text>
        <Text style={[styles.cell, styles.cellStats, styles.lossesText]}>{item.losses}</Text>
        <Text style={[styles.cell, styles.cellWinRate]}>{winRate}</Text>
      </View>
    );
  };

  // Xử lý trạng thái loading
  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text>Đang tải bảng xếp hạng...</Text>
      </SafeAreaView>
    );
  }

  // Xử lý trạng thái lỗi
  if (error) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <Text>Vui lòng thử lại sau.</Text>
      </SafeAreaView>
    );
  }

  // Xử lý khi không có dữ liệu
  if (leaderboardData.length === 0) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text>Chưa có dữ liệu bảng xếp hạng.</Text>
      </SafeAreaView>
    );
  }

  // Giao diện chính
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Bảng Xếp Hạng ELO</Text>
      <FlatList
        data={leaderboardData}
        renderItem={renderItem}
        keyExtractor={(item) => item.username}
        ListHeaderComponent={renderHeader}
        stickyHeaderIndices={[0]} // Giữ header cố định
      />
    </SafeAreaView>
  );
};

// StyleSheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 16,
    color: '#333',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    marginBottom: 10,
  },
  // Header
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#007bff', // Màu xanh dương
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  headerText: {
    color: '#ffffff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 14,
  },
  // Row
  row: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  cell: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
  // Định nghĩa flex cho các cột
  cellRank: {
    flex: 0.15,
  },
  cellUser: {
    flex: 0.35,
    textAlign: 'left', // Tên người dùng căn trái
    paddingLeft: 5,
  },
  cellElo: {
    flex: 0.18,
    fontWeight: 'bold',
  },
  cellStats: {
    flex: 0.12,
  },
  cellWinRate: {
    flex: 0.2,
  },
  // Style cho Hạng
  rankNormal: {
    fontWeight: 'bold',
    color: '#333',
  },
  rank1: {
    fontWeight: 'bold',
    color: '#FFD700', // Vàng
    fontSize: 16,
  },
  rank2: {
    fontWeight: 'bold',
    color: '#C0C0C0', // Bạc
    fontSize: 16,
  },
  rank3: {
    fontWeight: 'bold',
    color: '#CD7F32', // Đồng
    fontSize: 16,
  },
  // Style cho Thắng/Thua
  winsText: {
    color: '#28a745', // Xanh lá
    fontWeight: '600',
  },
  lossesText: {
    color: '#dc3545', // Đỏ
    fontWeight: '600',
  },
});

export default LeaderboardScreen;