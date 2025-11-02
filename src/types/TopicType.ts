interface TopicSummary {
  topicId: number;
  topicName: string;
  description: string;
  orderIndex: number;
  imageUrl?: string;
  questCount: number;
}

export type {TopicSummary}