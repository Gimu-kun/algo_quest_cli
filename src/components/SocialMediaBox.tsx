import { StyleSheet, View } from "react-native";
import { Button, Icon, IconButton } from "react-native-paper";
import { SocialMediaBtnProps } from "../types/socialMediaTypes";

interface SocialMediaBoxProps {
    SocialMediaList: SocialMediaBtnProps[];
}

const SocialMediaBox = ({ SocialMediaList }: SocialMediaBoxProps) => {
    return (
        <View style={styles.socialMediaBox}>
            {SocialMediaList.map((btn) => (
                <IconButton
                    key={btn.id}
                    style={styles.btn}
                    icon={btn.icon}
                    iconColor={"#000000"}
                    size={30}
                    onPress={btn.onPress}
                />
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    socialMediaBox:{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 30,
        paddingVertical: 10
    },
    btn:{
        backgroundColor: "transparent",
        borderRadius: 50,
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default SocialMediaBox;