import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    infoBar: {
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        height: 100,
        justifyContent: 'space-between'
    },
    infoBox:{
        display: 'flex',
        flexDirection: 'row',
        alignItems:'center',
        width: '35%',
        height: '100%'
    },
    avatarBox:{
        width: '50%',
        height: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding:5
    },
    avatar:{
        height: 55,
        width: 55,
        borderRadius: '50%',
        objectFit: 'cover'
    },
    accName:{
        fontFamily: 'Roboto'
    },
    toolBox:{
        display:'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },
    toolIcon:{
        width: 25,
        borderRadius:0
    },
    toolLine:{
        height:"50%",
        borderLeftWidth:1,
        borderColor:'#ffffff'
    },
    notiBox:{
        width: '30%',
        height: '100%',
        display: 'flex',
        flexDirection: 'row',
        columnGap:7,
        justifyContent: 'center',
        alignItems: 'center'
    },
    infoIconShadow:{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: 50,
        height: 50,
        borderRadius:'50%',
        backgroundColor: '#ffffff2e'
    },
    notiIcon:{
        width: 35,
        height: 35,
        padding: 5,
        borderRadius:'50%',
        backgroundColor: '#ffffff3e'
    }
})