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
        { placeholder: "Email or Username", key: "emailOrUsername" },
        { placeholder: "Full name", key: "fullName" },
        { placeholder: "Passwords", key: "passwords" },
    ];

    return (
        <AuthLayout 
        welcomeWords="Welcome new friend! Nice to meet you"
        SocialMediaList={SocialMediaList} 
        isLogin={false} 
        fields={fields}/>
    );
}