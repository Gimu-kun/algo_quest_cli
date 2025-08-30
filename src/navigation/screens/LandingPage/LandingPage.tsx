import { View, Text, StyleSheet, Image } from "react-native";
import landingPic from '../../../assets/landing.jpg';
import logoWhite from '../../../assets/NR-white-removebg-preview.png';
import { Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

export const LandingPage = () => {
    const navigation = useNavigation()
    return (
        <View style={styles.pageBg}>
            <Image style={styles.landingPic} source={landingPic}/>
            <Image style={styles.logoPic} source={logoWhite}/>
            <Button style={styles.loginBtn} mode="contained" onPress={() => navigation.navigate('HomeTabs', {
                screen: 'Login',
                })}>
                <Text style={{color: '#ffffff'}}>Login</Text>
            </Button>
            <Button style={styles.registerBtn} mode="outlined" onPress={() => navigation.navigate('HomeTabs', {
                screen: 'Register',
                })}>
                <Text style={styles.registerBtn}>Register</Text>
            </Button>
        </View>
    );
}

const styles = StyleSheet.create({
    pageBg:{
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        backgroundColor: '#00aaffff',
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
        filter: 'brightness(50%)'
    },
    logoPic:{
        width: 250,
        height: 250,
        resizeMode: 'contain',
        alignSelf: 'center',
        marginTop: '50%'
    },
    registerBtn:{
        width: 200,
        alignSelf: 'center',
        marginTop: 20,
        borderColor:'#00aaffff',
        color: '#ffffff'
    },
    loginBtn:{
        width: 200,
        alignSelf: 'center',
        marginTop: 20,
        backgroundColor: '#00aaffff',
        borderColor: '#ffffff',
        color: '#ffffff'
    }
});