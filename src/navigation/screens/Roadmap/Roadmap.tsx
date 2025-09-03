import { View, Text, Image, useWindowDimensions, TouchableOpacity } from "react-native";
import styles from "./roadmap";
import { Icon, IconButton } from "react-native-paper";

export const Roadmap = () => {
    const height = useWindowDimensions();
    return (
        <View style={[styles.page]}>
            <View style={styles.header}>
                <View style={styles.headerContainer}>
                    <IconButton iconColor='#f20717' size={45} icon="arrow-left-thick"/>
                    <View style={styles.headerTitleContainer}>
                        <Image style={styles.headerTitleRibbon}  source={require('../../../assets/ribbon.png')}/>
                        <Text style={styles.headerTitle}>Màn 1</Text>
                    </View>
                    <IconButton iconColor='#f20717' size={45} icon="cog"/>
                </View>
            </View>
            <View style={styles.footer}>
                <View style={styles.footerTop}>
                    <TouchableOpacity style={styles.sectionNavBtn}>
                        <Icon color='#f20717' size={45} source="arrow-left-thick"/>
                        <Text style={styles.sectionNavBtnTxt}>Màn trước</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.sectionNavBtn}>
                        <Text style={styles.sectionNavBtnTxt}>Màn sau</Text>
                        <Icon color='#f20717' size={45} source="arrow-right-thick"/>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}