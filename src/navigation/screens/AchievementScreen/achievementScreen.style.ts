import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F0F2F5', // Màu nền xám nhạt
    },
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        paddingVertical: 10,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    backButton: {
        padding: 5,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1C1C1E',
    },
    errorText: {
        textAlign: 'center',
        marginTop: 50,
        fontSize: 16,
        color: '#8E8E93',
    },
    noDataText: {
        textAlign: 'center',
        marginVertical: 10,
        fontSize: 14,
        color: '#8E8E93',
    },
    // Card Style
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        margin: 15,
        padding: 15,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#0F3460',
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F2F5',
        paddingBottom: 10,
    },
    // Profile Header
    profileHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    avatar: {
        width: 70,
        height: 70,
        borderRadius: 35,
        borderWidth: 2,
        borderColor: '#0F3460',
    },
    profileInfo: {
        marginLeft: 15,
        flex: 1,
    },
    fullName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1C1C1E',
    },
    username: {
        fontSize: 16,
        color: '#8E8E93',
    },
    // Stat Grid
    statGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
    },
    statBox: {
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: '40%', // Cho 2 cột
        marginVertical: 10,
    },
    statValue: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1C1C1E',
        marginTop: 5,
    },
    statLabel: {
        fontSize: 14,
        color: '#8E8E93',
        marginTop: 2,
    },
    // Progress Bar
    progressItem: {
        marginBottom: 15,
    },
    progressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    progressLabel: {
        fontSize: 15,
        color: '#333',
    },
    progressPercent: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#0F3460',
    },
    progressBarBg: {
        height: 10,
        backgroundColor: '#E0E0E0',
        borderRadius: 5,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#3498db',
        borderRadius: 5,
    },
    // Badges
    badgeScroll: {
        paddingTop: 10,
    },
    badgeBox: {
        alignItems: 'center',
        marginHorizontal: 10,
        width: 80,
    },
    badgeImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#f0f2f5',
    },
    badgeName: {
        fontSize: 12,
        color: '#333',
        marginTop: 5,
        textAlign: 'center',
    },
});