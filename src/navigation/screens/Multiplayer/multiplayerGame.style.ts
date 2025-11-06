import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0F3460',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 15,
        backgroundColor: '#16213E',
    },
    scoreText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    questionContainer: {
        flex: 2,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    questionText: {
        color: '#FFF',
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    timerContainer: {
        padding: 10,
        alignItems: 'center',
    },
    timerText: {
        color: '#E94560',
        fontSize: 28,
        fontWeight: 'bold',
    },
    answerContainer: {
        flex: 3,
        padding: 10,
    },
    buzzButton: {
        backgroundColor: '#E94560',
        padding: 20,
        borderRadius: 15,
        margin: 20,
        alignItems: 'center',
    },
    buzzButtonText: {
        color: '#FFF',
        fontSize: 22,
        fontWeight: 'bold',
    },
    resultsModal: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    resultsTitle: {
        fontSize: 40,
        fontWeight: 'bold',
        color: '#FFD700',
        marginBottom: 20,
    },
    resultsScore: {
        fontSize: 24,
        color: '#FFF',
        marginBottom: 10,
    },
});