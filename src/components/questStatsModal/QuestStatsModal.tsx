import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import modalStyles from './questStatsModal.styles';

// Đảm bảo interface QuestStats được import/định nghĩa đúng
interface QuestStats {
    questName: string;
    totalQuestions: number;
    difficultyStats: Record<string, number>;
    typeStats: Record<string, number>;
}

interface QuestStatsModalProps {
    visible: boolean;
    stats: QuestStats | null;
    onClose: () => void;
    onStartQuest: () => void;
}

// Hàm format tên loại (Ví dụ: 'multiple_choice' -> 'Multiple Choice')
const formatKeyName = (key: string) => {
    return key.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
};

export const QuestStatsModal: React.FC<QuestStatsModalProps> = ({ visible, stats, onClose, onStartQuest }) => {
    if (!stats) return null;

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={modalStyles.centeredView}>
                <View style={modalStyles.modalView}>
                    <Text style={modalStyles.modalTitle}>Tổng quan Quest: {stats.questName}</Text>
                    <View style={modalStyles.divider} />

                    <Text style={modalStyles.statText}>
                        Tổng số câu hỏi: {stats.totalQuestions}
                    </Text>

                    {/* Thống kê theo Bloom Level / Độ khó */}
                    <Text style={modalStyles.sectionTitle}>Cấp độ Bloom / Độ khó</Text>
                    {Object.entries(stats.difficultyStats).map(([key, value]) => (
                        <Text key={key} style={modalStyles.statItem}>
                            • {formatKeyName(key)}: {value} câu
                        </Text>
                    ))}

                    {/* Thống kê theo Loại câu hỏi */}
                    <Text style={modalStyles.sectionTitle}>Loại câu hỏi</Text>
                    {Object.entries(stats.typeStats).map(([key, value]) => (
                        <Text key={key} style={modalStyles.statItem}>
                            • {formatKeyName(key)}: {value} câu
                        </Text>
                    ))}
                    
                    <View style={modalStyles.buttonContainer}>
                        <TouchableOpacity
                            style={[modalStyles.button, modalStyles.buttonClose]}
                            onPress={onClose}
                        >
                            <Text style={modalStyles.textStyle}>Đóng</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[modalStyles.button, modalStyles.buttonStart]}
                            onPress={onStartQuest}
                        >
                            <Text style={modalStyles.textStyle}>Bắt đầu Quest</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

