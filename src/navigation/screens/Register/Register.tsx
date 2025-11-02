import React, { useState } from 'react';
import { SocialMediaBtnProps } from "../../../types/socialMediaTypes";
import AuthLayout from "../../../layout/auth/AuthLayout";
import { AuthFieldsType } from "../../../types/authFieldsType";
import { useNavigation } from "@react-navigation/native";
import axios from 'axios';
import { Alert, TouchableOpacity, View, Text, Image, StyleSheet, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { USER_API_URL } from '../../../ApiConfig';

interface RegisterCredentials {
    username: string;
    email: string;
    password: string; 
    fullName: string;
    avatarUri: string | null;
}

export const Register: React.FC = () => {
    const navigation = useNavigation<any>(); 
    
    const [credentials, setCredentials] = useState<RegisterCredentials>({
        username: '',
        email: '',
        password: '',
        fullName: '',
        avatarUri: null,
    });

    const [loading, setLoading] = useState(false);

    const handleInputChange = (key: keyof RegisterCredentials, value: string) => {
        setCredentials(prev => ({ ...prev, [key]: value }));
    };

    const handlePickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
            base64: true, 
        });

        if (!result.canceled) {
            const base64String = `data:image/jpeg;base64,${result.assets[0].base64}`;
            setCredentials(prev => ({ ...prev, avatarUri: base64String })); 
        }
    };

    const handleRegister = async () => {
        const { username, password, email, fullName, avatarUri } = credentials;

        setLoading(true);

        try {
            const formData = new FormData();
            
            formData.append('username', username);
            formData.append('password', password);
            formData.append('email', email);
            formData.append('fullName', fullName);
            formData.append('role', 'player');
            
            if (avatarUri) {
                const filename = avatarUri.split('/').pop();
                const match = /\.(\w+)$/.exec(filename || '');
                const extension = match ? match[1] : 'jpg';
                
                const safeFilename = `avatar_${username}.${extension}`; 
                
                const mimeType = extension.toLowerCase() === 'jpg' ? 'image/jpeg' : `image/${extension.toLowerCase()}`;
                let uri = avatarUri;
                if (Platform.OS === 'ios') {
                    uri = uri.replace('file://', '');
                }

                formData.append('avatar', {
                    uri: avatarUri,
                    name: safeFilename, 
                    type: mimeType, 
                } as any); 
            }
            

            const requestBody = {
                username,
                password,
                email,
                fullName,
                role: 'player',
                avatarBase64: avatarUri, 
            };

            await axios.post(USER_API_URL, requestBody, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            
            Alert.alert("Thành công", "Đăng ký thành công! Mời bạn đăng nhập.");
            setTimeout(()=>{
                navigation.navigate('Login');
            },500)
        } catch (error) {
        } finally {
            setLoading(false);
        }
    };

    const handleSwitchToLogin = () => {
        navigation.navigate('Login'); 
    };
    
    const SocialMediaList: SocialMediaBtnProps[] = [
        {id:1, icon: "google", onPress: () => { } },
        {id:2, icon: "facebook", onPress: () => { } },
        {id:3, icon: "twitter", onPress: () => { } },
    ];

    const fields:AuthFieldsType[] = [
        { placeholder: "Tên đăng nhập", key: "username" }, 
        { placeholder: "Email", key: "email" }, 
        { placeholder: "Họ và tên", key: "fullName" },
        { placeholder: "Mật khẩu", key: "password" }, 
    ];

    return (
        <AuthLayout 
            welcomeWords="Chào mừng bạn đến với hành trình chinh phục kiến thức!"
            SocialMediaList={SocialMediaList} 
            isLogin={false} 
            fields={fields}
            
            CustomComponentBeforeFields={
                <View style={styles.avatarPickerContainer}>
                   {credentials.avatarUri && (
                        <Image 
                            source={{ uri: credentials.avatarUri }} 
                            style={styles.avatarPreview}
                        />
                    )}
                    <TouchableOpacity onPress={handlePickImage} style={styles.avatarButton}>
                            <Text>
                                Chọn Avatar
                            </Text>
                    </TouchableOpacity>
                </View>
            }
            
            onInputChange={handleInputChange as (key: string, value: string) => void} 
            currentData={credentials as unknown as { [key: string]: string }} 
            onMainAction={handleRegister} 
            onSwitchAction={handleSwitchToLogin} 
        />
    );
}

// <-- Thêm StyleSheet mới
const styles = StyleSheet.create({
    avatarPickerContainer: {
        marginBottom: 20, 
        alignItems: 'center',
        paddingVertical: 10,
    },
    avatarButton: {
        marginTop:13,
        padding: 13, 
        borderWidth: 1, 
        borderColor: '#ccc', 
        borderRadius: 8,
        backgroundColor: '#f0f0f0',
        marginBottom: 10,
    },
    avatarPreview: {
        width: 120,
        height: 120,
        borderRadius: "50%",
        borderWidth: 2,
        borderColor: '#eee',
        marginTop: 10,
    },
});