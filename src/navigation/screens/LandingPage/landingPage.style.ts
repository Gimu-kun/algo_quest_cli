import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    pageBg:{
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        width: '100%',
        height: '100%',
    },
    landingPic:{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        filter: 'brightness(70%)'
    },
    logoPic:{
        width: 250,
        height: 250,
        resizeMode: 'contain',
        alignSelf: 'center',
        marginTop: '30%',
        marginBottom: '20%',
    },
    registerBtn:{
        width: 200,
        alignSelf: 'center',
        marginTop: 20,
        borderColor:'#f20717',
        color: '#ffffff'
    },
    loginBtn:{
        width: 200,
        alignSelf: 'center',
        marginTop: 20,
        backgroundColor: '#f20717',
        borderColor: '#ffffff',
        color: '#ffffff'
    }
});

export default styles;