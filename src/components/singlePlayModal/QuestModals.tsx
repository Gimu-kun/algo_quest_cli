// src/components/QuestModals.tsx

import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native'; // Sửa đường dẫn nếu cần
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { QuestDetail, QuestResult } from '../../types/SinglePlayTypes';

// --- Start Modal ---
interface StartModalProps {
    visible: boolean;
    quest: QuestDetail | null;
    onStart: () => void;
}

export const StartModal: React.FC<StartModalProps> = ({ visible, quest, onStart }) => {
    if (!quest) {
        return (
            <Modal transparent={true} visible={visible}>
                <View style={modalStyles.centeredView}>
                    <ActivityIndicator size="large" color="#3498db" />
                    <Text style={modalStyles.loadingText}>Đang tải Quest...</Text>
                </View>
            </Modal>
        );
    }

    const totalMaxScore = quest.questions.reduce((sum: number, q) => sum + q.score, 0);

    return (
        <Modal animationType="fade" transparent={true} visible={visible}>
            <View style={modalStyles.centeredView}>
                <View style={modalStyles.modalView}>
                    <Text style={modalStyles.title}>🚀 Bắt đầu Quest</Text>
                    <Text style={modalStyles.questName}>"{quest.questName}"</Text>
                    <View style={modalStyles.divider} />
                    
                    <View style={modalStyles.statRow}>
                        <Icon name="file-question-outline" size={20} color="#27ae60" />
                        <Text style={modalStyles.statText}>Tổng số câu hỏi: **{quest.questions.length}**</Text>
                    </View>
                    <View style={modalStyles.statRow}>
                        <Icon name="flash" size={20} color="#f39c12" />
                        <Text style={modalStyles.statText}>Độ khó: **{quest.difficulty.toUpperCase()}**</Text>
                    </View>
                    <View style={modalStyles.statRow}>
                        <Icon name="trophy-outline" size={20} color="#c0392b" />
                        <Text style={modalStyles.statText}>XP thưởng tối đa: **{quest.questions.reduce((sum:number, q) => sum + q.correctXpReward, 0)}**</Text>
                    </View>
                    <View style={modalStyles.statRow}>
                        <Icon name="star-circle-outline" size={20} color="#c0392b" />
                        <Text style={modalStyles.statText}>Tổng điểm: {totalMaxScore} điểm</Text>
                    </View>
                    <TouchableOpacity
                        // (Sửa lỗi Style) Áp dụng style 'buttonStart' (có width: 100%)
                        // thay vì 'button' (có flex: 1)
                        style={[modalStyles.buttonBase, modalStyles.buttonStart]}
                        onPress={onStart}
                    >
                        <Text style={modalStyles.buttonText}>Bắt Đầu Thử Thách Ngay!</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

// --- Results Modal ---
interface ResultsModalProps {
    visible: boolean;
    result: QuestResult | null;
    onClose: () => void;
    onReview: () => void; // Thêm chức năng xem lại (tùy chọn)
}

export const ResultsModal: React.FC<ResultsModalProps> = ({ visible, result, onClose, onReview }) => {
    if (!result) return null;

    const completionMinutes = Math.floor(result.completionTime / 60);
    const completionSeconds = result.completionTime % 60;
    const isCompleted = result.isCompleted;
    const titleText = isCompleted ? '🎉 Hoàn Thành!' : '😥 Thất Bại!';
    const scoreColor = isCompleted ? '#27ae60' : '#e74c3c';

    return (
        <Modal animationType="slide" transparent={true} visible={visible}>
            <View style={modalStyles.centeredView}>
                <View style={modalStyles.modalView}>
                    <Text style={[modalStyles.title, { color: scoreColor }]}>{titleText}</Text>
                    <View style={modalStyles.divider} />

                    <View style={modalStyles.resultBox}>
                        <Text style={modalStyles.resultLabel}>Điểm Số Đạt Được</Text>
                        <Text style={[modalStyles.resultValue, { color: scoreColor }]}>
                            {result.totalScore} điểm
                        </Text>
                    </View>

                    <View style={modalStyles.resultBox}>
                        <Text style={modalStyles.resultLabel}>XP Kiếm Được</Text>
                        <Text style={modalStyles.resultValue}>+{result.totalXPEarned} XP</Text>
                    </View>
                    <View style={modalStyles.resultBox}>
                        <Text style={modalStyles.resultLabel}>Độ Chính Xác</Text>
                        <Text style={modalStyles.resultValue}>
                            {result.correctAnswers}/{result.totalQuestions} ({Math.round((result.correctAnswers / result.totalQuestions) * 100)}%)
                        </Text>
                    </View>
                    <View style={modalStyles.resultBox}>
                        <Text style={modalStyles.resultLabel}>Thời Gian</Text>
                        <Text style={modalStyles.resultValue}>
                            {completionMinutes.toString().padStart(2, '0')}:{completionSeconds.toString().padStart(2, '0')}
                        </Text>
                    </View>

                    <View style={modalStyles.buttonContainer}>
                        <TouchableOpacity
                            style={[modalStyles.buttonBase, modalStyles.buttonReview]}
                            onPress={onReview}
                        >
                            <Text style={modalStyles.buttonText}>Xem Lại</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[modalStyles.buttonBase, modalStyles.buttonClose]}
                            onPress={onClose}
                        >
                            <Text style={modalStyles.buttonText}>Tiếp Tục</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

// --- Styles for Modals ---
const modalStyles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 15,
        padding: 30,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: '85%',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2c3e50',
    },
    questName: {
        fontSize: 16,
        color: '#3498db',
        marginTop: 5,
        marginBottom: 10,
    },
    divider: {
        height: 1,
        backgroundColor: '#ecf0f1',
        width: '100%',
        marginVertical: 15,
    },
    statRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
        width: '100%',
        paddingLeft: 20,
    },
    statText: {
        fontSize: 16,
        marginLeft: 10,
        color: '#34495e',
    },
    resultBox: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    resultLabel: {
        fontSize: 16,
        color: '#7f8c8d',
    },
    resultValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#27ae60',
    },
    buttonContainer: {
        flexDirection: 'row',
        marginTop: 25,
        width: '100%',
        justifyContent: 'space-between',
    },
    buttonBase: {
        borderRadius: 10,
        padding: 12,
        elevation: 2,
        marginHorizontal: 5,
        alignItems: 'center',
    },
    buttonStart: {
        backgroundColor: '#27ae60',
        marginTop: 20,
        width: '100%', // Đảm bảo nút này rộng 100%
    },
    // 3. Cập nhật các nút còn lại để dùng flex: 1
    buttonClose: {
        backgroundColor: '#3498db',
        flex: 1, // Nút này cần flex 1
    },
    buttonReview: {
        backgroundColor: '#e67e22',
        flex: 1, // Nút này cần flex 1
    },
    // ========================

    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
});