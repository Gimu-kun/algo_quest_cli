import React, { useState } from 'react';
import { SocialMediaBtnProps } from "../../../types/socialMediaTypes";
import AuthLayout from "../../../layout/auth/AuthLayout";
import { AuthFieldsType } from "../../../types/authFieldsType";
import { useNavigation } from "@react-navigation/native";
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { LOGIN_URL } from '../../../ApiConfig';

// Khai báo kiểu cho dữ liệu đăng nhập
interface LoginCredentials {
    emailOrUsername: string;
    passwords: string;
}

export const Login: React.FC = () => {
    // Sử dụng useNavigation với kiểu dữ liệu an toàn nếu bạn đã định nghĩa RootStackParamList
    const navigation = useNavigation<any>(); 
    
    // 1. STATE để lưu trữ dữ liệu nhập liệu
    const [credentials, setCredentials] = useState<LoginCredentials>({
        emailOrUsername: '',
        passwords: '',
    });

    // Hàm cập nhật state khi người dùng nhập liệu
    const handleInputChange = (key: keyof LoginCredentials, value: string) => {
        setCredentials(prev => ({ ...prev, [key]: value }));
    };

    // 2. HÀM XỬ LÝ ĐĂNG NHẬP VÀ GỌI API
    const handleLogin = async () => {
        const { emailOrUsername, passwords } = credentials;
        
        if (!emailOrUsername || !passwords) {
            Alert.alert("Lỗi", "Vui lòng nhập tên tài khoản/email và mật khẩu.");
            return;
        }

        try {
            // Chú ý: Cần kiểm tra key 'password' trong body có đúng không.
            // Tôi giả định API backend nhận { username: ..., password: ... }
            const dataToSend = {
                username: emailOrUsername, 
                password: passwords, 
            };

            // Gọi API
            const response = await axios.post(LOGIN_URL, dataToSend);

            if (response.data && response.data.token) {
                const token: string = response.data.token;

                // 3. LƯU TOKEN VÀO ASYNC STORAGE
                await AsyncStorage.setItem('userToken', token);
                
                Alert.alert("Thành công", "Đăng nhập thành công!");
                
                // 4. ĐIỀU HƯỚNG ĐẾN HOME TABS
                navigation.navigate('HomeTabs'); 
            } else {
                Alert.alert("Lỗi Đăng nhập", "Phản hồi API không hợp lệ.");
            }
        } catch (error) {
            // Xử lý lỗi
            const errorMessage = axios.isAxiosError(error) && error.response 
                ? (error.response.data.message || "Tên tài khoản hoặc mật khẩu không đúng.")
                : "Không thể kết nối đến máy chủ.";
            
            Alert.alert("Lỗi Đăng nhập", errorMessage);
        }
    };

    // Hàm điều hướng đến màn hình Đăng ký (Register)
    const handleSwitchToRegister = () => {
        navigation.navigate('Register'); 
    };
    
    // Các khai báo dữ liệu không đổi
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
            fields={fields}
            
            // THÊM CÁC PROPS MỚI CHO FORM VÀ HÀNH ĐỘNG CHÍNH
            onInputChange={handleInputChange as (key: string, value: string) => void} // Ép kiểu an toàn
            currentData={credentials as unknown as { [key: string]: string }} // Ép kiểu an toàn
            onMainAction={handleLogin} 
            
            onSwitchAction={handleSwitchToRegister} 
        />
    );
}