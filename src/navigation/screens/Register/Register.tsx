import { SocialMediaBtnProps } from "../../../types/socialMediaTypes";
import AuthLayout from "../../../layout/auth/AuthLayout";
import { AuthFieldsType } from "../../../types/authFieldsType";

export const Register = () => {
    const SocialMediaList: SocialMediaBtnProps[] = [
        {id:1, icon: "google", onPress: () => { } },
        {id:2, icon: "facebook", onPress: () => { } },
        {id:3, icon: "twitter", onPress: () => { } },
    ];

    const fields:AuthFieldsType[] = [
        { placeholder: "Tên tài khoản", key: "emailOrUsername" },
        { placeholder: "Họ và tên", key: "fullName" },
        { placeholder: "Mật khẩu", key: "passwords" },
    ];

    return (
        <AuthLayout 
        welcomeWords="Xin chào, hãy bắt đầu cuộc phiêu lưu nào!"
        SocialMediaList={SocialMediaList} 
        isLogin={false} 
        fields={fields}/>
    );
}