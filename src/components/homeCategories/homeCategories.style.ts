import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    categoriesBox: {
        marginBottom: 15,
    },
    header: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingRight: 35,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: "bold",
        paddingHorizontal: 35,
        marginVertical: 20,
    },
    seeAll:{
      fontSize: 14,
      color: '#00aaffff',
      textDecorationLine: 'underline'
    },
    categoriesContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal:30,
        width: '100%',
        shadowColor: "#000",
        shadowOffset: {
            width: 2,
            height: 2,
        },
        shadowOpacity: 0.4,
        shadowRadius: 2,
        elevation: 5,
    },
    listContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        flexWrap: 'wrap',
        width: '100%',
        minHeight: 245,
        borderRadius: 10,
        backgroundColor: '#ffffff',
        overflow:'hidden',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
        zIndex: 1,
    },
    itemContainer: {
        display: 'flex',
        alignItems: 'center',
        width: '20%',
        rowGap: 10,
        margin: 12,
        zIndex:2
    },
    categoryTitle: {
        fontSize: 13
    },
    categoryRound: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: 60,
        height: 60,
        borderRadius: 300,
        backgroundColor: '#ffffff',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0.4,
        shadowRadius: 2,
        elevation: 5,
    },
    categoryShadow: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 500,
        width: 45,
        height: 45,
    },
    categoryBtn: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: 35,
        height: 35,
        borderRadius: 500
    }
});

export default styles;