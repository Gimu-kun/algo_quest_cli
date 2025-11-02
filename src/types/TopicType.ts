interface TopicSummary {
  topicId: number;
  topicName: string;
  description: string;
  orderIndex: number;
  imageUrl?: string;
  questCount: number;
}

interface TopicMinimal {
    topicId: number;
    topicName: string;
    description: string;
    orderIndex: number;
    quests: string[]; 
}

export type {TopicSummary,TopicMinimal}