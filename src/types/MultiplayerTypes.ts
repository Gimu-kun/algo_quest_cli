// src/types/MultiplayerTypes.ts
import { QuestDetail } from './SinglePlayTypes'; // Import kiểu Quest

// Định nghĩa người chơi (Dùng chung cho WaitingRoom và Game)
export type Player = {
    userId: string; // Đây là Firebase UID
    username: string; // Đây là username của Spring Boot
    avatar: string | null;
};

// Dữ liệu phòng chờ (Lobby) trên Firestore
export type BattleRoom = {
    hostId: string;
    status: 'waiting' | 'in_progress';
    topicId: number;
    topicName: string;
    players: Player[];
};

// Dữ liệu phòng game (Game State) trên Firestore
export type MultiplayerGameState = {
    quest: QuestDetail;
    topicId: number;
    startTime: number;
    currentQuestionIndex: number;
    gameState: 'preview' | 'buzzing' | 'answering' | 'results';
    questionTimer: number; 
    answerTimer: number; 
    activePlayerId: string | null;
    playerScores: { [key: string]: number };
    totalPossibleScore: number;
    lastAnswer: {
        playerId: string;
        isCorrect: boolean;
    } | null;
};