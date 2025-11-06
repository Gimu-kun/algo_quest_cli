import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Question, UserAnswer } from '../../types/SinglePlayTypes';
import { Icon } from 'react-native-paper';

import DraggableFlatList, {
    DragEndParams,
    RenderItemParams,
} from 'react-native-draggable-flatlist';
import { GestureHandlerRootView } from 'react-native-gesture-handler'; // <-- Bắt buộc

// --- (THÊM MỚI) HÀM XÁO TRỘN MẢNG ---
// (Thuật toán Fisher-Yates shuffle)
const shuffleArray = (array: any[]) => {
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }
    return array;
};

// (Định nghĩa kiểu dữ liệu cho các mục kéo thả)
type DraggableItem = {
    key: string; // ID duy nhất cho mỗi mục
    label: string; // Văn bản hiển thị (ví dụ: "FIFO")
};

interface QuestionRendererProps {
    question: Question;
    currentAnswer: UserAnswer;
    onAnswerChange: (newResponse: any) => void;
}

const QuestionRenderer: React.FC<QuestionRendererProps> = ({ question, currentAnswer, onAnswerChange }) => {
    const [draggableItems, setDraggableItems] = useState<DraggableItem[]>([]);
    // State cục bộ để quản lý lựa chọn/input (giúp UI nhạy hơn)
    const [localResponse, setLocalResponse] = useState(currentAnswer.response || null);

    useEffect(() => {
        // Đồng bộ hóa khi câu hỏi thay đổi
        const response = currentAnswer.response;
        setLocalResponse(response || null);
        if (question.questionType === 'matching') {
            // Nếu CHƯA có câu trả lời (lần đầu load):
            if (!response) {
                // 1. Lấy cột bên phải (answerMeta)
                const rightColumn = question.answers.map(a => a.answerMeta || '');
                // 2. Xáo trộn cột bên phải (theo yêu cầu của bạn)
                const shuffledRightColumn = shuffleArray([...rightColumn]);
                
                // 3. Tạo dữ liệu cho DraggableFlatList
                const items = shuffledRightColumn.map((label, index) => ({
                    key: `item-${index}-${question.questionId}`, // Key duy nhất
                    label: label,
                }));
                
                setDraggableItems(items);
                // 4. Lưu thứ tự đã xáo trộn làm câu trả lời ban đầu
                onAnswerChange(shuffledRightColumn);
            } 
            // Nếu ĐÃ có câu trả lời (quay lại câu hỏi):
            else {
                // Tải lại thứ tự cũ mà người dùng đã sắp xếp
                const items = (response as string[]).map((label, index) => ({
                    key: `item-${index}-${question.questionId}`,
                    label: label,
                }));
                setDraggableItems(items);
            }
        }
    }, [question.questionId, currentAnswer.response]);

    // Xử lý Multiple Choice / True False
    const handleSelectOption = (answerId: number) => {
        let newSelection = new Set<number>(localResponse || []);
        
        // multiple_choice có thể là 1 hoặc nhiều đáp án đúng (tạm thời coi là 1 cho UI đơn giản)
        // Nếu là True/False, cũng là chọn 1
        if (question.questionType === 'multiple_choice' || question.questionType === 'true_false') {
            
            // Logic đơn chọn 1 (Radio button style)
            if (newSelection.has(answerId)) {
                newSelection.delete(answerId);
            } else {
                newSelection = new Set([answerId]); // Chỉ cho phép chọn 1
            }
        }
        
        const finalResponse = Array.from(newSelection);
        setLocalResponse(finalResponse);
        onAnswerChange(finalResponse);
    };

    // Xử lý Fill in Blank / Numeric
    const handleTextAnswer = (text: string) => {
        setLocalResponse(text);
        onAnswerChange(text);
    };

    // Xử lý Matching / Sequence (Giả lập đơn giản bằng Text Input)
    const handleComplexAnswer = (text: string, index: number) => {
        const currentArr = Array.isArray(localResponse) ? [...localResponse] : [];
        currentArr[index] = text;
        setLocalResponse(currentArr);
        onAnswerChange(currentArr);
    };

    const isSelected = (answerId: number) => {
        return Array.isArray(localResponse) && localResponse.includes(answerId);
    };

    const onDragEnd = (params: DragEndParams<DraggableItem>) => {
        // Cập nhật state của UI
        setDraggableItems(params.data);
        // Cập nhật câu trả lời (chỉ lưu mảng các chuỗi)
        const newResponseOrder = params.data.map(item => item.label);
        onAnswerChange(newResponseOrder);
    };

    const renderDraggableItem = ({ item, drag, isActive }: RenderItemParams<DraggableItem>) => {
        return (
            <TouchableOpacity
                style={[
                    rendererStyles.draggableItem,
                    isActive && rendererStyles.draggableItemActive
                ]}
                onLongPress={drag} // Kích hoạt kéo khi nhấn giữ
                disabled={isActive}
            >
                <Icon source="drag-vertical" size={24} color="#7f8c8d" />
                <Text style={rendererStyles.draggableItemText}>{item.label}</Text>
            </TouchableOpacity>
        );
    };

    const renderAnswerOptions = () => {
        // Chỉ hiển thị cho các loại câu hỏi có sẵn `answers`
        if (question.questionType === 'multiple_choice' || question.questionType === 'true_false') {
            return question.answers.map((answer) => (
                <TouchableOpacity
                    key={answer.answerId}
                    style={rendererStyles.optionButton}
                    onPress={() => handleSelectOption(answer.answerId)}
                >
                    <Icon 
                        // Sử dụng prop 'source' và tên icon của MaterialCommunityIcons
                        source={isSelected(answer.answerId) ? 'radiobox-marked' : 'radiobox-blank'} 
                        size={20} 
                        color={isSelected(answer.answerId) ? '#3498db' : '#7f8c8d'} 
                    />
                    <Text style={rendererStyles.optionText}>{answer.answerText}</Text>
                </TouchableOpacity>
            ));
        }
        
        // Logic cho Fill in Blank / Numeric
        if (question.questionType === 'fill_in_blank' || question.questionType === 'numeric') {
            const inputPlaceholder = question.questionType === 'numeric' ? 'Nhập giá trị số...' : 'Nhập câu trả lời...';
            const keyboardType = question.questionType === 'numeric' ? 'numeric' : 'default';
            return (
                <TextInput
                    style={rendererStyles.textInput}
                    placeholder={inputPlaceholder}
                    keyboardType={keyboardType}
                    value={typeof localResponse === 'string' ? localResponse : ''}
                    onChangeText={handleTextAnswer}
                />
            );
        }

        if (question.questionType === 'matching') {
            
            // Lấy cột bên trái (answerText) - Cột này cố định
            const leftColumnItems = question.answers.map((ans, index) => (
                <View key={`left-${index}`} style={rendererStyles.staticItem}>
                    <Text style={rendererStyles.staticItemText}>{ans.answerText}</Text>
                </View>
            ));

            return (
                <GestureHandlerRootView>
                    <View style={rendererStyles.matchingContainer}>
                        {/* Cột trái (Cố định) */}
                        <View style={rendererStyles.column}>
                            {leftColumnItems}
                        </View>
                        
                        {/* Cột phải (Kéo thả) */}
                        <View style={rendererStyles.column}>
                            <DraggableFlatList
                                data={draggableItems}
                                onDragEnd={onDragEnd}
                                keyExtractor={(item) => item.key}
                                renderItem={renderDraggableItem}
                                scrollEnabled={false} // Không cần cuộn trong component nhỏ
                            />
                        </View>
                    </View>
                </GestureHandlerRootView>
            );
        }

        // Logic cho Matching / Sequence (Đơn giản hóa: yêu cầu nhập theo thứ tự)
        if (question.questionType === 'sequence') {
            return (
                <View>
                    <Text style={rendererStyles.helperText}>
                        *Hãy nhập các đáp án tương ứng (Đang đơn giản hóa UI)
                    </Text>
                    {question.answers.map((ans, index) => (
                        <View key={index} style={rendererStyles.complexInputContainer}>
                            <Text style={rendererStyles.complexInputLabel}>
                                {question.questionType === 'matching' ? ans.answerText : `Vị trí ${index + 1}`}:
                            </Text>
                            <TextInput
                                style={rendererStyles.complexInput}
                                placeholder={ans.answerMeta || "Nhập giá trị khớp..."}
                                value={Array.isArray(localResponse) ? localResponse[index] : ''}
                                onChangeText={(text) => handleComplexAnswer(text, index)}
                            />
                        </View>
                    ))}
                </View>
            );
        }

        return <Text>Không hỗ trợ loại câu hỏi này.</Text>;
    };

    return (
        <ScrollView contentContainerStyle={rendererStyles.container}>
            <Text style={rendererStyles.questionIndex}>
                Câu hỏi {question.orderIndex} (ID: {question.questionId})
            </Text>
            <Text style={rendererStyles.questionText}>{question.questionText}</Text>
            
            <View style={rendererStyles.optionsContainer}>
                {renderAnswerOptions()}
            </View>
        </ScrollView>
    );
};

const rendererStyles = StyleSheet.create({
    container: {
        padding: 20,
    },
    questionIndex: {
        fontSize: 14,
        color: '#95a5a6',
        marginBottom: 5,
    },
    questionText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#2c3e50',
    },
    optionsContainer: {
        // Tùy chỉnh khoảng cách giữa các lựa chọn
    },
    optionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 5,
        borderWidth: 1,
        borderColor: '#ecf0f1',
        borderRadius: 5,
        marginBottom: 8,
        backgroundColor: '#fff',
    },
    optionIcon: {
        marginRight: 10,
    },
    optionText: {
        fontSize: 16,
        flexShrink: 1,
        color: '#34495e',
    },
    textInput: {
        borderWidth: 1,
        borderColor: '#bdc3c7',
        borderRadius: 5,
        padding: 10,
        fontSize: 16,
        marginTop: 10,
        backgroundColor: '#fff',
    },
    helperText: {
        fontSize: 12,
        color: '#e74c3c',
        marginBottom: 10,
    },
    complexInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    complexInputLabel: {
        width: 120,
        fontWeight: '600',
        fontSize: 15,
        color: '#3498db',
    },
    complexInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#bdc3c7',
        borderRadius: 5,
        padding: 8,
        fontSize: 15,
        backgroundColor: '#fff',
    },
    matchingContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    column: {
        width: '48%',
    },
    staticItem: {
        padding: 15,
        backgroundColor: '#ecf0f1', // Màu nền cho cột cố định
        borderRadius: 8,
        marginBottom: 10,
        height: 50, // Đảm bảo chiều cao bằng nhau
        justifyContent: 'center',
    },
    staticItemText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#2c3e50',
    },
    draggableItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 10,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#bdc3c7',
        borderRadius: 8,
        marginBottom: 10,
        height: 50, // Đảm bảo chiều cao bằng nhau
    },
    draggableItemActive: {
        backgroundColor: '#e0f7fa', // Màu khi đang kéo
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    draggableItemText: {
        fontSize: 16,
        color: '#34495e',
        marginLeft: 10,
    },
});

export default QuestionRenderer;