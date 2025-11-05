// src/types/SinglePlayTypes.ts

export interface Answer {
    answerId: number;
    answerText: string;
    answerMeta: string | null;
    correct: boolean;
}

export interface Question {
    questionId: number;
    orderIndex: number;
    score: number;
    questionText: string;
    bloomLevel: string;
    questionType: 'multiple_choice' | 'matching' | 'fill_in_blank' | 'numeric' | 'sequence' | 'true_false';
    correctXpReward: number;
    partialCredit: number | null;
    synonyms: string | null;
    codeTemplate: string | null;
    testCases: string | null;
    testResults: string | null;
    answers: Answer[];
}

export interface QuestDetail {
    questId: number;
    orderIndex: number;
    questName: string;
    questType: string;
    difficulty: string;
    requiredXp: number;
    questions: Question[];
}

// Định nghĩa cấu trúc lưu trữ câu trả lời của người dùng
export interface UserAnswer {
    questionId: number;
    response: any; 
    isCorrect?: boolean;
    xpEarned?: number;
}

export interface QuestResult {
    totalQuestions: number;
    correctAnswers: number;
    totalXPEarned: number;
    completionTime: number;
    totalScore:number;
    isCompleted: boolean;
}