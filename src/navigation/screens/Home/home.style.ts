import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    page: {
        alignItems: 'center',
        width: '100%'
    },
    pageRound: {
        position: 'absolute',
        top: -200,
        left: -100,
        width: "150%",
        height: 350,
        borderRadius: 500,
        backgroundColor: '#f20717',
        zIndex: -1,
    },
    container: {
        position: 'relative',
        display: 'flex',
        width: '100%',
        paddingTop: 100
    },
});

export default styles;