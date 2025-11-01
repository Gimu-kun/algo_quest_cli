import { View, Image, TouchableOpacity } from "react-native";
import { Button, TextInput, Text } from "react-native-paper";
import styles from "./authLayout.style";
import SocialMediaBox from "../../components/socialMediaBox/SocialMediaBox";
import { SocialMediaBtnProps } from "../../types/socialMediaTypes";
import { AuthFieldsType } from "../../types/authFieldsType";
import DividerWithText from "../../components/dividerWithText/DividerWithText";

type AuthLayoutProps = {
    welcomeWords?: string,
    SocialMediaList: SocialMediaBtnProps[],
    isLogin: boolean,
    fields:AuthFieldsType[]
    onSwitchAction?: () => void;
    onMainAction: () => void;
    onInputChange: (key: string, value: string) => void;
    currentData: { [key: string]: string | null };
    loading?: boolean;
    CustomComponentBeforeFields?: React.ReactNode; 
};

const AuthLayout = ({SocialMediaList, 
    isLogin, 
    fields, 
    welcomeWords, 
    onSwitchAction,
    onMainAction,
    onInputChange,
    currentData,
    loading,
    CustomComponentBeforeFields}: AuthLayoutProps) => {
    const switchText = isLogin ? "Bạn chưa có tài khoản? Đăng ký ngay" : "Bạn đã có tài khoản? Đăng nhập ngay";
    return (
        <View style={styles.container}>
            <View style={styles.formContainer}>
                <View>
                    <View>
                        <Text style={styles.welcomeWords}>{welcomeWords}</Text>
                        <Image style={styles.textHolder} source={{uri:"https://firebasestorage.googleapis.com/v0/b/wander-stay.appspot.com/o/Luigi-txt-holder-removebg-preview.png?alt=media&token=73ee4d82-119f-4a6c-bbc5-327b382f4d4d"}}/>
                    </View>
                    {CustomComponentBeforeFields}
                    <View style={styles.fieldContainer}>
                        {
                            fields.map((field) => (
                                <TextInput 
                                    key={field.key}
                                    style={styles.fields} 
                                    placeholder={field.placeholder} 
                                    // Kiểm tra field.key trong currentData vì key là động
                                    value={currentData[field.key] || ''} 
                                    onChangeText={(text) => onInputChange(field.key, text)}
                                    // Đảm bảo secureTextEntry hoạt động cho cả "password" và "passwords"
                                    secureTextEntry={field.key.toLowerCase().includes("passw")}
                                />
                            ))
                        }
                        {isLogin && <Text style={styles.forgotPassword}>Quên mật khẩu?</Text>}
                    </View>
                    <View>
                        <Button 
                            style={styles.button} 
                            icon={isLogin ? "login" : "account"} 
                            mode="contained" 
                            buttonColor='#f20717' 
                            onPress={onMainAction} // GẮN HÀM HÀNH ĐỘNG CHÍNH
                            loading={loading} // GẮN TRẠNG THÁI LOADING
                            disabled={loading} // DISABLE KHI ĐANG LOADING
                        >
                            <Text style={styles.buttonTxt}>{isLogin ? "Đăng nhập" : "Đăng ký"}</Text>
                        </Button>
                        <Image style={styles.btnHolder} source={{uri:"https://firebasestorage.googleapis.com/v0/b/wander-stay.appspot.com/o/btn_hold-removebg-preview.png?alt=media&token=0973f18d-bcc8-45fc-84ab-ecac7da3c1d5"}}/>
                        <DividerWithText text={isLogin ? "Đăng nhập bằng cách khác" : "Đăng ký bằng cách khác"} />
                        <SocialMediaBox SocialMediaList={SocialMediaList} />
                    </View>
                </View>
                <View style={styles.registerContainer}>
                    <TouchableOpacity onPress={onSwitchAction}>
                        <Text>{switchText}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

export default AuthLayout;