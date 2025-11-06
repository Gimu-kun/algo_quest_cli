import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { QuestDetail } from '../../../types/SinglePlayTypes';
import { RootStackParamList } from '../../types';
import { UserInfo } from '../../../types/userType';
import { doc, getDoc, onSnapshot, updateDoc, writeBatch } from 'firebase/firestore';
import { appId, authenticate, db } from '../../../firebase';
import { evaluateAnswer } from '../../../Utils/QuestUtils';
import { BASE_API_URL } from '../../../ApiConfig';
import { styles } from './multiplayerGame.style';
import QuestionRenderer from '../../../components/questionRenderer/QuestionRenderer';
import { MultiplayerGameState, Player } from '../../../types/MultiplayerTypes';


type GameRouteProp = RouteProp<RootStackParamList, 'MultiplayerGame'>;
type NavigationProps = {
  navigate(screen: string, params?: any): void;
  goBack(): void;
  replace(screen: string, params?: any): void;
}

export const MultiplayerGame: React.FC = () => {
    const navigation = useNavigation<NavigationProps>();
    const route = useRoute<GameRouteProp>();
    const { roomId } = route.params;

    const [firebaseUID, setFirebaseUID] = useState<string | null>(null);
    const [springBootUser, setSpringBootUser] = useState<UserInfo | null>(null);
    const [gameData, setGameData] = useState<MultiplayerGameState | null>(null);
    const firebaseUIDRef = useRef<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isExiting, setIsExiting] = useState(false);

    // Dùng để chạy timer
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const isHost = useRef(false);
    const localTimer = useRef(0);
    const currentAnswer = useRef<any>(null); // Lưu câu trả lời của người chơi

    const gameRef = doc(db, 'artifacts', appId, 'public', 'data', 'battle_games', roomId);

    // 1. Tải thông tin người dùng
    useEffect(() => {
        const fetchUser = async () => {
            try {
                // 1. Lấy Firebase UID (string)
                const firebaseUser = await authenticate(); 
                setFirebaseUID(firebaseUser.uid);

                // 2. Lấy UserInfo (Spring Boot) từ AsyncStorage
                const jsonValue = await AsyncStorage.getItem('authData');
                if (jsonValue) {
                    const authData = JSON.parse(jsonValue);
                    setSpringBootUser(authData.user);
                } else {
                    throw new Error("Không tìm thấy authData");
                }
            } catch (e) {
                console.error("Lỗi tải user:", e);
                Alert.alert("Lỗi", "Không thể tải thông tin người dùng.");
            }
        };
        fetchUser();
    }, []);

    // 2. Lắng nghe Game State
    useEffect(() => {
        const unsubscribe = onSnapshot(gameRef, (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data() as MultiplayerGameState;
                setGameData(data);
                setIsLoading(false);
                
                // (Logic timer)
                if (data.gameState === 'preview') {
                    localTimer.current = data.questionTimer;
                } else if (data.gameState === 'answering') {
                    localTimer.current = data.answerTimer;
                }
                
            } else {
                Alert.alert("Trận đấu kết thúc", "Host đã đóng phòng.", [{ text: "OK", onPress: () => navigation.goBack() }]);
            }
        });
        return () => unsubscribe();
    }, [roomId, navigation]);

    // 3. Logic Timer (Chỉ Host chạy)
    // (Tạm thời: Cả 2 client cùng chạy timer, nhưng chỉ Host cập nhật CSDL)
    useEffect(() => {
        const setupTimers = async () => {
            // Xác định Host (chỉ Host mới được cập nhật timer)
            const lobbyRef = doc(db, 'artifacts', appId, 'public', 'data', 'battle_rooms', roomId);
            const lobbySnap = await getDoc(lobbyRef);
            if (lobbySnap.exists()) {
                const firebaseUser = await authenticate();
                isHost.current = lobbySnap.data().hostId === firebaseUser.uid;
            }

            if (intervalRef.current) clearInterval(intervalRef.current);
            
            intervalRef.current = setInterval(() => {
                if (!isHost.current) return; // Chỉ Host cập nhật

                // (Nếu không có gameData, dừng lại)
                if (!gameDataRef.current) return;

                const currentState = gameDataRef.current.gameState;
                
                if (currentState === 'preview') {
                    localTimer.current -= 1;
                    if (localTimer.current <= 0) {
                        // Hết 3s Preview -> Chuyển sang Buzzing
                        updateDoc(gameRef, { gameState: 'buzzing', questionTimer: 0 });
                    } else {
                        updateDoc(gameRef, { questionTimer: localTimer.current });
                    }
                } 
                else if (currentState === 'answering') {
                    localTimer.current -= 1;
                    if (localTimer.current <= 0) {
                        // Hết 5s Trả lời -> Tính là sai
                        handleAnswerSubmit(false, gameDataRef.current.activePlayerId!);
                    } else {
                        updateDoc(gameRef, { answerTimer: localTimer.current });
                    }
                }
            }, 1000);
        };
        
        setupTimers();
        
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []); // Chỉ chạy 1 lần

    // (Lưu state mới nhất vào ref để setInterval có thể thấy)
    const gameDataRef = useRef(gameData);
    useEffect(() => {
        gameDataRef.current = gameData;
    }, [gameData]);

    useEffect(() => {
        firebaseUIDRef.current = firebaseUID;
    }, [firebaseUID]);

    // 4. (ACTION) Xử lý Bấm Buzz-in
    const handleBuzzIn = async () => {
        if (!firebaseUID || gameData?.gameState !== 'buzzing') return;

        try {
            const batch = writeBatch(db);
            batch.update(gameRef, {
                gameState: 'answering',
                activePlayerId: firebaseUID,
                answerTimer: 5
            });
            await batch.commit();
        } catch (e) {
            console.log("Bị chậm!", e);
        }
    };

    // 5. (ACTION) Xử lý Nộp Trả Lời (từ QuestionRenderer)
    const handleAnswerChange = (response: any) => {
        currentAnswer.current = response;
    };
    
    const onPlayerSubmit = () => {
        if (!gameData || !currentAnswer.current || !firebaseUID) return;
        const question = gameData.quest.questions[gameData.currentQuestionIndex];
        const evaluation = evaluateAnswer(question, currentAnswer.current);
        handleAnswerSubmit(evaluation.isCorrect, firebaseUID);
    };

    // 6. (LOGIC) Xử lý Điểm số
    const handleAnswerSubmit = async (isCorrect: boolean, answeringPlayerId: string) => {
        // (SỬA LỖI) Đọc từ REF thay vì STATE
        if (!gameDataRef.current || !firebaseUIDRef.current) return;

        const game = gameDataRef.current;
        const currentQuestion = game.quest.questions[game.currentQuestionIndex];
        const questionScore = currentQuestion.score; 

        const newPlayerScores = { ...game.playerScores };
        
        // (Logic này giờ đã đúng: string vs string)
        const opponentId = Object.keys(newPlayerScores).find(id => id !== answeringPlayerId)!; 

        if (isCorrect) {
            newPlayerScores[answeringPlayerId] += questionScore;
        } else {
            newPlayerScores[opponentId] += questionScore;
        }
        
        const nextIndex = game.currentQuestionIndex + 1;

        if (nextIndex >= game.quest.questions.length) {
            // HẾT GAME
            await updateDoc(gameRef, {
                gameState: 'results',
                playerScores: newPlayerScores,
                lastAnswer: { playerId: answeringPlayerId, isCorrect: isCorrect }
            });
            if (isHost.current) {
                await handleEndGame(newPlayerScores);
            }
        } else {
            // Chuyển sang câu tiếp
            await updateDoc(gameRef, {
                gameState: 'preview',
                currentQuestionIndex: nextIndex,
                questionTimer: 3,
                activePlayerId: null,
                playerScores: newPlayerScores,
                lastAnswer: { playerId: answeringPlayerId, isCorrect: isCorrect }
            });
        }
        currentAnswer.current = null; // Reset
    };

    // 7. (ACTION) Kết thúc game và gọi API ELO
    const handleEndGame = async (finalScores: { [key: string]: number }) => {
        // (Sửa) Dùng springBootUser
        if (!gameData || !springBootUser) return; 
        
        const lobbyRef = doc(db, 'artifacts', appId, 'public', 'data', 'battle_rooms', roomId);
        const lobbySnap = await getDoc(lobbyRef);
        if (!lobbySnap.exists()) return;
        const players = lobbySnap.data().players as Player[];
        
        const playerA = players[0];
        const playerB = players[1];

        const scoreA = finalScores[playerA.userId];
        const scoreB = finalScores[playerB.userId];
        const totalScore = gameData.totalPossibleScore;
        const isWinnerA = scoreA > scoreB;
        const isWinnerB = scoreB > scoreA;

        let rankA: number;
        let rankB: number;

        if (scoreA > scoreB) {
            rankA = 1;
            rankB = 2;
        } else if (scoreB > scoreA) {
            rankA = 2;
            rankB = 1;
        } else {
            rankA = 1;
            rankB = 1;
        }

        const spendTimeSeconds = Math.floor((Date.now() - gameData.startTime) / 1000);

        const battleResultDto = {
            topicId: gameData.topicId,
            questId: gameData.quest.questId,
            spendTimeSeconds: spendTimeSeconds,
            participants: [
                { username: playerA.username, score: scoreA, isWinner: isWinnerA, rank_in_battle: rankA },
                { username: playerB.username, score: scoreB, isWinner: isWinnerB,rank_in_battle: rankB }
            ]
        };

        try {
            console.log("payload JSON",JSON.stringify(battleResultDto));
            await fetch(`${BASE_API_URL}battles/save-result`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(battleResultDto)
            });
            console.log("Đã lưu kết quả trận đấu.");
        } catch (e) {
            console.error("Lỗi gọi API save-result:", e);
            // (Không dừng lại, vẫn tiếp tục tính ELO)
        }
        
        const eloDto = {
            // (Không thay đổi) Logic này đã đúng, vì 'Player' type chứa 'username'
            playerA_Username: playerA.username,
            playerB_Username: playerB.username,
            // (Không thay đổi) Logic này đã đúng, vì 'player.userId' là Firebase UID
            playerA_Score: finalScores[playerA.userId],
            playerB_Score: finalScores[playerB.userId],
            totalPossibleScore: gameData.totalPossibleScore
        };

        try {
            console.log("payload2 JSON",JSON.stringify(eloDto));
            await fetch(`${BASE_API_URL}battles/calculate-elo`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(eloDto)
            });
        } catch (e) {
            console.error("Lỗi gọi API ELO:", e);
        }
    };
    
    // --- RENDER ---
    if (isLoading || !gameData || !firebaseUID || !springBootUser) {
        return <ActivityIndicator style={{ flex: 1 }} size="large" />;
    }

    const currentQuestion = gameData.quest.questions[gameData.currentQuestionIndex];
    const { gameState, activePlayerId, playerScores } = gameData;
    const isActivePlayer = activePlayerId === firebaseUID;
    const opponentId = Object.keys(playerScores).find(id => id !== firebaseUID)!;

    return (
        <SafeAreaView style={styles.container}>
            {/* Header: Scores */}
            <View style={styles.header}>
                <Text style={styles.scoreText}>Bạn: {playerScores[firebaseUID]}</Text>
                <Text style={styles.scoreText}>Đối thủ: {playerScores[opponentId]}</Text>
            </View>

            {/* Question Area */}
            <View style={styles.questionContainer}>
                <Text style={styles.questionText}>{currentQuestion.questionText}</Text>
            </View>

            {/* Timer / State Area */}
            <View style={styles.timerContainer}>
                {gameState === 'preview' && (
                    <Text style={styles.timerText}>Xem đề: {gameData.questionTimer}s</Text>
                )}
                {gameState === 'buzzing' && (
                    <Text style={styles.timerText}>BẤM NHANH!</Text>
                )}
                {gameState === 'answering' && (
                    <Text style={styles.timerText}>
                        {isActivePlayer ? `Trả lời: ${gameData.answerTimer}s` : `Đối thủ đang trả lời...`}
                    </Text>
                )}
                {gameState === 'results' && (
                    <Text style={styles.timerText}>KẾT THÚC!</Text>
                )}
            </View>

            {/* Answer Area */}
            <View style={styles.answerContainer}>
                {gameState === 'answering' && isActivePlayer ? (
                    <>
                        <QuestionRenderer
                            question={currentQuestion}
                            currentAnswer={{ questionId: currentQuestion.questionId, response: currentAnswer.current }}
                            onAnswerChange={handleAnswerChange}
                        />
                        <TouchableOpacity style={styles.buzzButton} onPress={onPlayerSubmit}>
                            <Text style={styles.buzzButtonText}>NỘP BÀI</Text>
                        </TouchableOpacity>
                    </>
                ) : (
                    <View /> // Placeholder
                )}
            </View>
            
            {/* Buzz Button */}
            {gameState === 'buzzing' && (
                <TouchableOpacity style={styles.buzzButton} onPress={handleBuzzIn}>
                    <Text style={styles.buzzButtonText}>GIÀNH QUYỀN!</Text>
                </TouchableOpacity>
            )}

            {/* Results Modal */}
            {gameState === 'results' && (
                <View style={styles.resultsModal}>
                    {/* [MỚI] Hiển thị loading khi đang dọn phòng */}
                    {isExiting ? (
                        <ActivityIndicator size="large" color="#FFFFFF" />
                    ) : (
                        <>
                            <Text style={styles.resultsTitle}>KẾT QUẢ</Text>
                            <Text style={styles.resultsScore}>Bạn: {playerScores[firebaseUID]}</Text>
                            <Text style={styles.resultsScore}>Đối thủ: {playerScores[opponentId]}</Text>
                            {/* [SỬA] Gọi hàm dọn dẹp mới */}
                            <TouchableOpacity style={styles.buzzButton} onPress={()=>{navigation.navigate('HomeTabs', { screen: 'Home' })}}>
                                <Text style={styles.buzzButtonText}>VỀ SẢNH CHỜ</Text>
                            </TouchableOpacity>
                        </>
                    )}
                </View>
            )}
        </SafeAreaView>
    );
};