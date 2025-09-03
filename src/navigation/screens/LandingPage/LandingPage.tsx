import { View, Text, Image } from "react-native";
import logoWhite from '../../../assets/NR-white-removebg-preview.png';
import { Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import styles from "./landingPage.style";

export const LandingPage = () => {
    const navigation = useNavigation()
    return (
        <View style={styles.pageBg}>
            <Image style={styles.landingPic} source={{uri:"https://firebasestorage.googleapis.com/v0/b/wander-stay.appspot.com/o/landingPic.jpeg?alt=media&token=e7e819fa-e805-4163-8602-114fb4a7b002"}}/>
            <Image style={styles.logoPic} source={logoWhite}/>
            <Button style={styles.loginBtn} mode="contained" onPress={() => navigation.navigate('HomeTabs', {
                screen: 'Login',
                })}>
                <Text style={{color: '#ffffff'}}>Đăng nhập</Text>
            </Button>
            <Button style={styles.registerBtn} mode="outlined" onPress={() => navigation.navigate('HomeTabs', {
                screen: 'Register',
                })}>
                <Text style={styles.registerBtn}>Đăng ký</Text>
            </Button>
        </View>
    );
}

