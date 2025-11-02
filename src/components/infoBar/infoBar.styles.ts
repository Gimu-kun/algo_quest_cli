import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    infoBar: {
        display: 'flex',
        position: 'absolute',
        top: 0,
        flexDirection: 'row',
        width: '100%',
        paddingVertical:10,
        justifyContent: 'space-between',
        backgroundColor: '#f20717',
        zIndex: 3
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
        fontFamily: 'Roboto',
        color: '#E0E0E0',
        fontSize: 14,
        fontWeight: 800
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
    },
    logoutButton: {
        backgroundColor: '#e74c3c', // Màu nền đỏ cho nút
        borderRadius: 5,
        padding: 0,
        marginLeft: 10,
        height: 30, // Chiều cao phù hợp
        width: 30,  // Chiều rộng phù hợp
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoutIcon: {
        margin: 0,
        width: 30,
        height: 30,
    },
})