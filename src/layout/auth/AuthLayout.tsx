import { View } from "react-native";
import { Button, TextInput, Text } from "react-native-paper";
import DividerWithText from "../../components/DividerWithText";
import styles from "./authLayout.style";
import SocialMediaBox from "../../components/SocialMediaBox";
import { SocialMediaBtnProps } from "../../types/socialMediaTypes";
import { AuthFieldsType } from "../../types/authFieldsType";

type AuthLayoutProps = {
    welcomeWords?: string,
    SocialMediaList: SocialMediaBtnProps[],
    isLogin: boolean,
    fields:AuthFieldsType[]
};

const AuthLayout = ({SocialMediaList,isLogin,fields,welcomeWords}: AuthLayoutProps) => {
    return (
        <View style={styles.container}>
            <View style={styles.formContainer}>
                <View>
                    <Text style={styles.welcomeWords}>{welcomeWords}</Text>
                    <View style={styles.fieldContainer}>
                        {
                            fields.map((field) => (
                                <TextInput 
                                key={field.key}
                                style={styles.fields} 
                                placeholder={field.placeholder} 
                                secureTextEntry={field.key === "password" ? true : false}/>
                            ))
                        }
                        {isLogin && <Text style={styles.forgotPassword}>Forgot Password?</Text>}
                    </View>
                    <View>
                        <Button style={styles.button} icon={isLogin ? "login" : "account"} mode="contained" buttonColor='#00aaffff' >
                            <Text style={styles.buttonTxt}>{isLogin ? "Login" : "Register"}</Text>
                        </Button>
                        <DividerWithText text="Login with social media" />
                        <SocialMediaBox SocialMediaList={SocialMediaList} />
                    </View>
                </View>
                <View style={styles.registerContainer}>
                    {isLogin ? 
                    <Text>Don't have an account? <Text style={styles.linkText}>Register now</Text></Text> :
                    <Text>Already have an account? <Text style={styles.linkText}>Login</Text></Text>
                    }
                </View>
            </View>
        </View>
    );
}

export default AuthLayout;