import { SocialMediaBtnProps } from "../../../types/socialMediaTypes";
import AuthLayout from "../../../layout/auth/AuthLayout";
import { AuthFieldsType } from "../../../types/authFieldsType";

export const Login = () => {
    const SocialMediaList: SocialMediaBtnProps[] = [
        {id:1, icon: "google", onPress: () => { } },
        {id:2, icon: "facebook", onPress: () => { } },
        {id:3, icon: "twitter", onPress: () => { } },
    ];

    const fields:AuthFieldsType[] = [
        { placeholder: "Tên tài khoản", key: "emailOrUsername" },
        { placeholder: "Mật khẩu", key: "passwords" },
    ];

    return (
        <AuthLayout 
        welcomeWords="Chào mừng quay lại, chúng ta cùng tiếp tục hành trình nhé!"
        SocialMediaList={SocialMediaList} 
        isLogin={true} 
        fields={fields}/>
    );
}