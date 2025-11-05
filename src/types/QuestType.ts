import { AnswerDetail } from "./AnswerType";
import { TopicMinimal } from "./TopicType";

type QuestStatus = {
    questId: number;
    questName: string;
    orderIndex: number;
    completed: boolean;
    locked: boolean;
    questType: 'quiz' | 'puzzle';
    difficulty: 'easy' | 'medium' | 'hard';
    requiredXp: number;
};

interface QuestDetail {
    questId: number;
    topic: TopicMinimal;
    orderIndex: number;
    questName: string;
    questType: 'quiz' | 'puzzle'; 
    difficulty: 'easy' | 'medium' | 'hard'; 
    requiredXp: number;
    questions: QuestionDetail[];
}

interface QuestStats {
    questId: number;
    questName: string;
    totalQuestions: number;
    difficultyStats: Record<string, number>;
    typeStats: Record<string, number>;
}

interface QuestionDetail {
    questionId: number;
    orderIndex: number;
    questionText: string;
    bloomLevel: string; // 'remember', 'understand', 'analyze', ...
    questionType: string; // 'multiple_choice', 'sequence', 'code', ...
    correctXpReward: number;
    partialCredit: number | null;
    answers: AnswerDetail[];
}

export type{QuestStatus,QuestionDetail,QuestDetail,QuestStats }