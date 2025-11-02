interface QuestSummary {
    questId: number;
    questName: string;
    orderIndex: number;
    questType: 'quiz' | 'puzzle'; // Hoặc string nếu bạn không dùng kiểu cụ thể
    difficulty: 'easy' | 'medium' | 'hard';
    requiredXp: number;
}

export type{ QuestSummary }