import { StyleSheet } from "react-native";
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f7f6',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2c3e50',
    },
    header: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#ecf0f1',
    },
    progressBarContainer: {
        flex: 2,
        height: 8,
        backgroundColor: '#ecf0f1',
        borderRadius: 4,
        marginRight: 15,
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#2ecc71',
        borderRadius: 4,
    },
    progressText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#2c3e50',
    },
    timerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 15,
    },
    timerText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#e74c3c',
        marginLeft: 5,
    },
    questionContainer: {
        flex: 1,
        padding: 10,
    },
    navigation: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 15,
        borderTopWidth: 1,
        borderTopColor: '#ecf0f1',
        backgroundColor: '#fff',
    },
    navButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    prevButton: {
        backgroundColor: '#ecf0f1',
    },
    nextButton: {
        backgroundColor: '#3498db',
    },
    disabledButton: {
        opacity: 0.5,
    },
    navButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 5,
        color: '#fff',
    },
    prev: {
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 5,
        color: '#2c3e50', // Màu chữ cho nút "Trước"
    },
    next: {
        fontSize: 16,
        fontWeight: 'bold',
        marginRight: 5, // Đảo ngược margin cho icon
        color: '#fff', // Màu chữ cho nút "Tiếp/Nộp"
    }
});

export {styles}