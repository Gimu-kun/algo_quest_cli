interface AnswerDetail {
    answerId: number;
    answerText: string;
    answerMeta: string | null;
    correct: boolean;
}

export type {AnswerDetail}