import { useNavigation } from "@react-navigation/native";
import { View, StyleSheet } from "react-native";
import HomeCarousel from "../../../components/homeCarousel/HomeCarousel";
import InfoBar from "../../../components/infoBar/InfoBar";

export const Home = () => {
    const styles = StyleSheet.create({
        page:{
            flex: 1,
            position: 'relative',
            alignItems: 'center',
            width: '100%',
            height: '100%',
            overflow: 'hidden',
        },
        pageRournd: {
            position: 'absolute',
            top: '-25%',
            left: '-100%',
            width: '300%',
            height: 400,
            borderRadius: '50%',
            backgroundColor: '#00aaffff',
        },
        container:{
            width:'100%',
            height: '100%',
            padding: 10
        }
        
    });

    
    return (
        <View style={styles.page}>
            <View style={styles.pageRournd}></View>
            <View style={styles.container}>
                <InfoBar/>
                <HomeCarousel/>
            </View>
        </View>
    );
}

