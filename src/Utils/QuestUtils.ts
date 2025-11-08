// src/utils/QuestUtils.ts

import { BASE_API_URL } from '../ApiConfig';
import { QuestDetail, Question, Answer } from '../types/SinglePlayTypes';

// --- DỮ LIỆU GIẢ LẬP (Thay thế cho Fetch API) ---
export const fetchQuestDetails = async (questId: number): Promise<QuestDetail> => {
    try {
        const response = await fetch(`${BASE_API_URL}quests/${questId}`);
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Lỗi khi tải Quest: ${response.status} - ${errorText}`);
        }
        
        const data: QuestDetail = await response.json();
        
        // Sắp xếp lại các câu hỏi theo orderIndex (nếu API chưa sắp xếp)
        data.questions.sort((a, b) => a.orderIndex - b.orderIndex);
        
        return data;

    } catch (error) {
        console.error('Không thể fetch quest details:', error);
        // Ném lỗi ra để component có thể bắt và xử lý
        throw error;
    }
};

const normalizeString = (str: string): string => {
    if (!str) return "";
    return str
        .normalize("NFD") // Tách ký tự và dấu (ví dụ: 'ê' -> 'e' + '̂')
        .replace(/[\u0300-\u036f]/g, "") // Xóa các ký tự dấu
        .toLowerCase() // Chuyển sang chữ thường
        .replace(/\s+/g, ' ') // Thay thế nhiều khoảng trắng bằng 1
        .trim(); // Xóa khoảng trắng đầu/cuối
};

// --- HÀM CHẤM ĐIỂM (Cần tùy chỉnh chi tiết hơn cho từng loại câu hỏi) ---
export const evaluateAnswer = (question: Question, userResponse: any): { isCorrect: boolean, xpEarned: number } => {
    let isCorrect = false;
    let xpEarned = 0;
    const correctAnswers = question.answers.filter(a => a.correct);


    switch (question.questionType) {
        case 'multiple_choice':
        case 'true_false': {
            // Logic này dựa trên ID (con số), không cần chuẩn hóa
            const correctIds = correctAnswers.map(a => a.answerId);
            const userIds = Array.isArray(userResponse) ? userResponse : [];

            if (userIds.length === correctIds.length && userIds.every(id => correctIds.includes(id))) {
                 isCorrect = true;
            }
            break;
        }
        
        case 'fill_in_blank':
        case 'numeric': {
            // === (ĐÃ CẬP NHẬT) ===
            // Chuẩn hóa câu trả lời của người dùng
            const userAnswer = normalizeString(String(userResponse || ''));
            
            // Chuẩn hóa TẤT CẢ các đáp án đúng
            const correctText = correctAnswers.map(a => normalizeString(String(a.answerText)));
            
            
            // Kiểm tra xem câu trả lời đã chuẩn hóa có nằm trong danh sách đáp án đúng đã chuẩn hóa không
            if (correctText.includes(userAnswer)) {
                isCorrect = true;
            }
            break;
        }
        
        case 'matching':
        case 'sequence': {
            // === (ĐÃ CẬP NHẬT) ===
            // (Áp dụng cho các loại câu hỏi so sánh chuỗi trong mảng)
            
            // Chuẩn hóa mảng người dùng nhập
            const userArr = Array.isArray(userResponse) ? 
                userResponse.map(s => normalizeString(String(s || ''))) : [];
            
            // Chuẩn hóa mảng đáp án đúng
            const correctArr = correctAnswers.map(a => normalizeString(String(a.answerMeta || a.answerText)));
            
            if (userArr.length === correctArr.length && userArr.every((val, index) => val === correctArr[index])) {
                isCorrect = true;
            }
            break;
        }
        
        default:
            isCorrect = false;
            break;
    }

    if (isCorrect) {
        xpEarned = question.correctXpReward;
    } 
    
    return { isCorrect, xpEarned };
};