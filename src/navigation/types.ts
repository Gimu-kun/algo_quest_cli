export type RootStackParamList = {
    Home: undefined; // (Giả sử bạn có màn Home)
    Roadmap: { topicId: number | string };
    SinglePlay: { questId: number };
    WaitingRoom: { roomId: string | null }; // Màn hình mới
    // (Thêm các màn hình khác của bạn ở đây)
};