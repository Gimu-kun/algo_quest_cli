import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Question, UserAnswer } from '../../types/SinglePlayTypes';
import { Icon } from 'react-native-paper';

interface QuestionRendererProps {
    question: Question;
    currentAnswer: UserAnswer;
    onAnswerChange: (newResponse: any) => void;
}

const QuestionRenderer: React.FC<QuestionRendererProps> = ({ question, currentAnswer, onAnswerChange }) => {
    // State cục bộ để quản lý lựa chọn/input (giúp UI nhạy hơn)
    const [localResponse, setLocalResponse] = useState(currentAnswer.response || null);

    useEffect(() => {
        // Đồng bộ hóa khi câu hỏi thay đổi
        setLocalResponse(currentAnswer.response || null);
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

        // Logic cho Matching / Sequence (Đơn giản hóa: yêu cầu nhập theo thứ tự)
        if (question.questionType === 'matching' || question.questionType === 'sequence') {
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
    }
});

export default QuestionRenderer;