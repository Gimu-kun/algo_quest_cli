import { StyleSheet } from "react-native";
const modalStyles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Nền mờ
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 25,
        alignItems: 'flex-start',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: '80%', // Chiếm 80% chiều rộng màn hình
    },
    modalTitle: {
        fontSize: 25,
        textAlign:'center',
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    divider: {
        height: 1,
        backgroundColor: '#eee',
        width: '100%',
        marginBottom: 15,
    },
    statText: {
        fontSize: 20,
        marginBottom: 10,
        fontWeight: '600',
        color: '#2C3E50',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 5,
        color: '#8e44ad',
    },
    statItem: {
        fontSize: 16,
        marginLeft: 10,
        color: '#555',
        marginBottom: 3,
    },
    buttonContainer: {
        flexDirection: 'row',
        marginTop: 20,
        justifyContent: 'space-between',
        width: '100%',
    },
    button: {
        borderRadius: 8,
        padding: 10,
        elevation: 2,
        flex: 1,
        marginHorizontal: 5,
        alignItems: 'center',
    },
    buttonClose: {
        backgroundColor: '#95a5a6',
    },
    buttonStart: {
        backgroundColor: '#3498db',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default modalStyles