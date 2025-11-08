// src/screens/SinglePlay.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Alert, BackHandler } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import QuestionRenderer from '../../../components/questionRenderer/QuestionRenderer';
import { ResultsModal, StartModal } from '../../../components/singlePlayModal/QuestModals';
import { QuestDetail, UserAnswer, QuestResult, Question } from '../../../types/SinglePlayTypes';
import { fetchQuestDetails, evaluateAnswer } from '../../../Utils/QuestUtils';
import { styles } from './singlePlay.style';
import { BASE_API_URL } from '../../../ApiConfig';
import { UserInfo } from '../../../types/userType';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Định nghĩa tham số Route (giả sử RootStackParamList đã được định nghĩa ở cấp cao hơn)
type SinglePlayRouteProp = RouteProp<any, 'SinglePlay'>;

const API_URL = `${BASE_API_URL}quest-completions/submit`

const submitCompletionData = async (completionData: any) => {
    console.log("Dữ liệu gửi submit", completionData)
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(completionData),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Lỗi API: ${response.status} - ${errorText}`);
        }

        const result = await response.json();
        return result;

    } catch (error) {
        console.error('Lỗi khi gửi kết quả Quest:', error);
        // Hiển thị lỗi cho người dùng (quan trọng)
        Alert.alert(
            'Lỗi Mạng',
            'Không thể gửi kết quả. Vui lòng kiểm tra kết nối và thử lại.'
        );
        return null; // Trả về null nếu thất bại
    }
};



export const SinglePlay: React.FC = () => {
    const route = useRoute<SinglePlayRouteProp>();
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const navigation = useNavigation();
    const { questId } = route.params as { questId: number }; // Lấy questId từ tham số route

    // --- STATES ---
    const [questData, setQuestData] = useState<QuestDetail | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
    
    // Quản lý Modal
    const [isStartModalVisible, setIsStartModalVisible] = useState(true);
    const [isResultsModalVisible, setIsResultsModalVisible] = useState(false);
    
    // Quản lý Thời gian
    const [startTime, setStartTime] = useState<number | null>(null);
    const [elapsedTime, setElapsedTime] = useState(0); // đơn vị giây
    
    // Kết quả
    const [questResult, setQuestResult] = useState<QuestResult | null>(null);

    // --- useEffects ---

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

    useEffect(() => {
        fetchUserInfo();
    }, []);

    // 1. Giả lập tải dữ liệu (thay thế cho Fetch API thực tế)
    useEffect(() => {
        const loadData = async () => {
            try {
                // Gọi hàm fetch mới từ QuestUtils
                const data: QuestDetail = await fetchQuestDetails(questId); 
                
                setQuestData(data);
                
                // Khởi tạo userAnswers (logic này giữ nguyên)
                const initialAnswers: UserAnswer[] = data.questions.map(q => ({
                    questionId: q.questionId,
                    response: null 
                }));
                setUserAnswers(initialAnswers);
                
            } catch (error) {
                console.error("Lỗi nghiêm trọng khi tải quest:", error);
                // Hiển thị lỗi và cho phép người dùng quay lại
                Alert.alert("Lỗi tải Quest", "Không thể tải dữ liệu. Vui lòng thử lại.", [
                    { text: "Quay lại", onPress: () => navigation.goBack() }
                ]);
            }
        };

        loadData(); // Gọi hàm async
        
    }, [questId, navigation]);


    // 2. Timer: Bắt đầu tính thời gian sau khi Modal Start đóng
    useEffect(() => {
        let timer: NodeJS.Timeout | null = null;
        if (startTime !== null && !isResultsModalVisible) {
            timer = setInterval(() => {
                setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
            }, 1000);
        } else if (timer) {
            clearInterval(timer);
        }
        return () => {
            if (timer) clearInterval(timer);
        };
    }, [startTime, isResultsModalVisible]);

    // 3. Ngăn chặn người dùng thoát giữa chừng
    useEffect(() => {
        const backAction = () => {
            if (!isResultsModalVisible) {
                Alert.alert("Dừng Quest?", "Bạn có chắc muốn thoát? Tiến trình sẽ không được lưu.", [
                    { text: "Tiếp tục chơi", style: "cancel" },
                    { text: "Thoát", onPress: () => navigation.goBack() }
                ]);
                return true;
            }
            return false;
        };

        const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
        return () => backHandler.remove();
    }, [isResultsModalVisible, navigation]);

    // --- HANDLERS ---

    const handleStartQuest = useCallback(() => {
        setIsStartModalVisible(false);
        setStartTime(Date.now()); // Bắt đầu tính thời gian
    }, []);

    const handleAnswerChange = useCallback((newResponse: any) => {
        setUserAnswers(prevAnswers => {
            const newAnswers = [...prevAnswers];
            newAnswers[currentQuestionIndex].response = newResponse;
            return newAnswers;
        });
    }, [currentQuestionIndex]);

    const handleSubmitQuest = useCallback(async () => { 
        if (!questData || startTime === null) return;
        
        const finalTime = Math.floor((Date.now() - startTime) / 1000); 
        setElapsedTime(finalTime); 
        setStartTime(null); 

        // === THAY ĐỔI LOGIC CHẤM ĐIỂM ===
        let totalScore = 0; 
        let totalXp = 0;
        let correctCount = 0;
        const responsesDTO: any[] = [];
        
        const finalUserAnswers = userAnswers.map((userAns, index) => {
            const question = questData.questions[index];
            const evaluation = evaluateAnswer(question, userAns.response); 
            
            let scoreAwarded = 0;
            let xpAwarded = 0;

            if (evaluation.isCorrect) {
                correctCount++; // Tăng số câu đúng
                scoreAwarded = question.score; // Lấy điểm từ question
                xpAwarded = evaluation.xpEarned; // Lấy XP
            }
            
            totalScore += scoreAwarded;
            totalXp += xpAwarded;
            
            responsesDTO.push({
                questionId: userAns.questionId,
                submittedAnswer: JSON.stringify(userAns.response),
                isCorrect: evaluation.isCorrect,
                scoreAwarded: scoreAwarded, 
                xpAwarded: xpAwarded,
            });

            // Cập nhật state nội bộ (để xem lại)
            return {
                ...userAns,
                isCorrect: evaluation.isCorrect,
                xpEarned: xpAwarded,
            };
        });

        setUserAnswers(finalUserAnswers); // Cập nhật state với kết quả chấm
        
        // 3. Chuẩn bị DTO tổng
        const completionData = {
            userId: userInfo?.userId,
            questId: questData.questId,
            score: totalScore, // Gửi TỔNG ĐIỂM
            xpEarned: totalXp,
            spendTime: finalTime, 
            responses: responsesDTO, 
        };

        // 4. Gọi API
        const apiResult = await submitCompletionData(completionData);

        if (apiResult === null) {
            setStartTime(Date.now() - finalTime * 1000); 
            Alert.alert("Gửi thất bại", "Không thể lưu kết quả. Vui lòng thử lại.");
            return; 
        }

        // 5. Hiển thị Modal kết quả
        const result: QuestResult = {
            totalQuestions: questData.questions.length,
            correctAnswers: correctCount, // Hiển thị số câu đúng
            totalXPEarned: apiResult.xpEarned, // Lấy XP từ API
            completionTime: finalTime,
            
            // === THÊM MỚI ===
            totalScore: apiResult.score, // Lấy Điểm từ API
            isCompleted: apiResult.isCompleted, // Lấy Trạng thái từ API
        };

        setQuestResult(result);
        setIsResultsModalVisible(true); 

    }, [questData, startTime, userAnswers, navigation, userInfo]);

    const handleNext = useCallback(() => {
        if (!questData) return;

        // Chuyển sang câu tiếp theo
        if (currentQuestionIndex < questData.questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            handleSubmitQuest(); // Nếu là câu cuối, nộp bài
        }
    }, [questData, currentQuestionIndex, handleSubmitQuest]);

    const handlePrevious = useCallback(() => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    }, [currentQuestionIndex]);
    
    // Quay về màn hình Roadmap sau khi xem kết quả
    const handleCloseResults = useCallback(() => {
        setIsResultsModalVisible(false);
        navigation.goBack();
    }, [navigation]);

    // --- UI RENDER ---

    if (!questData) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <StartModal visible={true} quest={null} onStart={() => {}} />
            </SafeAreaView>
        );
    }
    
    const currentQuestion = questData.questions[currentQuestionIndex];
    const currentAnswer = userAnswers[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === questData.questions.length - 1;
    const completionMinutes = Math.floor(elapsedTime / 60);
    const completionSeconds = elapsedTime % 60;
    
    return (
        <SafeAreaView style={styles.container}>
            {/* Header: Progress Bar & Timer */}
            <View style={styles.header}>
                <View style={styles.progressBarContainer}>
                    <View style={[styles.progressBar, { 
                        width: `${((currentQuestionIndex + 1) / questData.questions.length) * 100}%` 
                    }]} />
                </View>
                <Text style={styles.progressText}>
                    {currentQuestionIndex + 1} / {questData.questions.length}
                </Text>
                <View style={styles.timerContainer}>
                    <Icon name="clock-outline" size={20} color="#e74c3c" />
                    <Text style={styles.timerText}>
                        {completionMinutes.toString().padStart(2, '0')}:{completionSeconds.toString().padStart(2, '0')}
                    </Text>
                </View>
            </View>

            {/* Question Content */}
            <View style={styles.questionContainer}>
                <QuestionRenderer 
                    question={currentQuestion}
                    currentAnswer={currentAnswer}
                    onAnswerChange={handleAnswerChange}
                />
            </View>

            {/* Footer: Navigation Buttons */}
            <View style={styles.navigation}>
                <TouchableOpacity 
                    style={[styles.navButton, styles.prevButton, currentQuestionIndex === 0 && styles.disabledButton]}
                    onPress={handlePrevious}
                    disabled={currentQuestionIndex === 0}
                >
                    <Icon name="arrow-left" size={24} color={currentQuestionIndex === 0 ? '#bdc3c7' : '#2c3e50'} />
                    <Text style={styles.navButtonText}>Trước</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={[styles.navButton, styles.nextButton]}
                    onPress={handleNext}
                >
                    <Text style={styles.navButtonText}>{isLastQuestion ? 'Nộp Bài' : 'Tiếp Theo'}</Text>
                    <Icon name={isLastQuestion ? 'check-circle-outline' : 'arrow-right'} size={24} color="#fff" />
                </TouchableOpacity>
            </View>

            {/* Modals */}
            <StartModal 
                visible={isStartModalVisible} 
                quest={questData} 
                onStart={handleStartQuest} 
            />
            
            <ResultsModal
                visible={isResultsModalVisible}
                result={questResult}
                onClose={handleCloseResults}
                onReview={() => { Alert.alert('Xem Lại', 'Chức năng này cần thêm logic hiển thị kết quả chi tiết.'); }}
            />
        </SafeAreaView>
    );
};
