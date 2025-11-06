import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1A1A2E',
    },
    loadingText: {
        marginTop: 15,
        fontSize: 16,
        color: '#E0E0E0',
    },
    container: {
        flex: 1,
        backgroundColor: '#1A1A2E', // Nền tối chủ đạo
        padding: 20,
    },
    header: {
        marginTop: 40,
        alignItems: 'center',
        marginBottom: 30,
    },
    backButton: {
        position: 'absolute',
        left: 0,
        top: -5,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    roomIdContainer: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 20,
        marginTop: 10,
        alignItems: 'center',
    },
    roomIdText: {
        fontSize: 18,
        color: '#FFFFFF',
        fontWeight: 'bold',
        marginRight: 10,
        letterSpacing: 2,
    },
    playersContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 40,
    },
    playerSlot: {
        width: '45%',
        height: 200,
        backgroundColor: '#16213E',
        borderRadius: 15,
        borderWidth: 2,
        borderColor: '#0F3460',
        alignItems: 'center',
        padding: 15,
    },
    avatarPlaceholder: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        marginBottom: 15,
    },
    playerName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    hostBadge: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: '#E94560',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 10,
    },
    hostText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: 'bold',
    },
    waitingText: {
        fontSize: 16,
        color: '#AAB8C2',
        marginTop: 60,
    },
    kickButton: {
        position: 'absolute',
        top: 5,
        right: 5,
        backgroundColor: 'rgba(233, 69, 96, 0.7)',
        borderRadius: 15,
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    topicContainer: {
        backgroundColor: '#16213E',
        borderRadius: 15,
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 40,
    },
    topicLabel: {
        fontSize: 16,
        color: '#AAB8C2',
    },
    topicName: {
        fontSize: 18,
        color: '#FFFFFF',
        fontWeight: 'bold',
        flex: 1, // Để tên chủ đề co giãn
        marginHorizontal: 10,
    },
    changeTopicButton: {
        backgroundColor: '#0F3460',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    changeTopicText: {
        color: '#FFFFFF',
        fontWeight: '600',
    },
    hostControls: {
        marginTop: 'auto', // Đẩy xuống cuối
    },
    startButton: {
        backgroundColor: '#50C878', // Màu xanh lá
        padding: 20,
        borderRadius: 15,
        alignItems: 'center',
    },
    startButtonText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    disabledButton: {
        backgroundColor: '#555',
        opacity: 0.7,
    },
    leaveButton: {
        backgroundColor: '#E94560', // Màu đỏ
    },modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '85%',
        maxHeight: '70%',
        backgroundColor: '#16213E', // Giống màu nền của các slot
        borderRadius: 15,
        padding: 20,
        borderWidth: 1,
        borderColor: '#0F3460', // Giống viền của các slot
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#FFFFFF',
        textAlign: 'center',
        marginBottom: 20,
    },
    topicItem: {
        padding: 15,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 10,
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    topicItemName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
        flex: 1, // Cho phép tên chủ đề xuống dòng nếu quá dài
    },
    topicItemCount: {
        fontSize: 14,
        color: '#AAB8C2',
        marginLeft: 10,
    },
    modalCloseButton: {
        marginTop: 15,
        backgroundColor: '#E94560', // Giống màu nút Rời phòng
        padding: 12,
        borderRadius: 10,
        alignItems: 'center',
    },
    modalCloseText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    // Nút Mời (màu xanh dương)
    inviteButton: {
        backgroundColor: '#3498db',
        marginBottom: 10, // Thêm khoảng cách
    },

    // Input cho Modal Mời
    inviteInput: {
        width: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 10,
        padding: 15,
        fontSize: 16,
        color: '#FFFFFF',
        marginBottom: 20,
    },
    
    // Nút Hủy (màu xám)
    modalCancelButton: {
        marginTop: 10,
        backgroundColor: '#7f8c8d',
        padding: 12,
        borderRadius: 10,
        alignItems: 'center',
    },
});
