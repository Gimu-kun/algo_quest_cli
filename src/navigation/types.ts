export type RootStackParamList = {
    Home: undefined; // (Giả sử bạn có màn Home)
    Roadmap: { topicId: number | string };
    SinglePlay: { questId: number };
    WaitingRoom: { roomId: string | null };
    ProfileScreen: undefined;
    Login: undefined;
    AchievementScreen: undefined;
    MultiplayerGame: { roomId: string };
    LeaderBoardScreen: undefined;
    BattleDetail: {battleId :number}
};