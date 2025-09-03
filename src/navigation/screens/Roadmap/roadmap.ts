import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    page:{
        display: 'flex',
        position: 'relative',
        flex: 1,
    },
    header:{
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: 130,
        borderColor: '#eeeeee',
        borderBottomWidth: 2,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.4,
        shadowRadius: 2,
        elevation: 5,
    },
    headerContainer:{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'absolute',
        top: '63%',
        width: '100%',
        height: 50,
        shadowColor: "#000",
    },
    headerTitleContainer:{
        display: 'flex',
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitleRibbon:{
        position: 'absolute',
        top: 0,
        height: 50,
        width: 300,
        zIndex: 3
    },
    headerTitle:{
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 800,
        lineHeight: 18,
        padding: 20,
        zIndex:4
    },
    footer:{
        position: 'absolute',
        width: '100%',
        height: 100,
        bottom: 30,
        paddingHorizontal: 20
    },
    footerTop:{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        width:'100%',
    },
    sectionNavBtn:{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    sectionNavBtnTxt:{
        borderLeftWidth: 3,
        borderLeftColor: '#f20717',
        borderRightWidth: 3,
        borderRightColor: '#f20717',
        paddingHorizontal: 4,
        color: '#f20717',
        fontSize: 15
    }
})

export default styles;