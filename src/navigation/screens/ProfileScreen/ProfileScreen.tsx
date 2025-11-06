import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert, ScrollView, SafeAreaView, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { UserInfo } from '../../../types/userType';
import { BASE_API_URL, BASE_URL } from '../../../ApiConfig';
import { styles } from './profileScreen.style';

export const ProfileScreen: React.FC = () => {
    const navigation = useNavigation();
    
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    
    // Form state
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [avatarUri, setAvatarUri] = useState<string | null>(null);
    const [avatarBase64, setAvatarBase64] = useState<string | null>(null);
    const [currentPassword, setCurrentPassword] = useState('');

    // 1. Tải thông tin người dùng từ AsyncStorage khi vào màn hình
    useEffect(() => {
        const loadUserInfo = async () => {
            const jsonValue = await AsyncStorage.getItem('authData');
            if (jsonValue) {
                const authData = JSON.parse(jsonValue);
                const user: UserInfo = authData.user;
                setUserInfo(user);
                
                // Điền thông tin vào form
                setFullName(user.fullName);
                setEmail(user.username); // (Giả sử email là username, hoặc user.email nếu có)
                if (user.avatar) {
                    setAvatarUri(`${BASE_URL}${user.avatar}`);
                }
            }
        };
        loadUserInfo();
    }, []);

    // 2. Hàm chọn ảnh
    const handlePickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1], // Avatar vuông
            quality: 0.5,
            base64: true, // Yêu cầu Base64
        });

        if (!result.canceled && result.assets[0].base64) {
            const asset = result.assets[0];
            // Cập nhật ảnh hiển thị
            setAvatarUri(asset.uri);
            // Chuẩn bị Base64 để gửi đi
            setAvatarBase64(`data:${asset.mimeType};base64,${asset.base64}`);
        }
    };

    // 3. Hàm lưu thay đổi
    const handleSave = async () => {
        if (!userInfo) return;

        // Kiểm tra mật khẩu
        if (currentPassword.trim() === "") {
            Alert.alert("Lỗi", "Vui lòng nhập mật khẩu hiện tại để xác nhận.");
            return;
        }

        setIsLoading(true);

        // Build DTO
        const updateDTO = {
            fullName: fullName,
            email: email,
            avatarBase64: avatarBase64, // Gửi null nếu không đổi, hoặc chuỗi Base64 nếu đổi
            currentPassword: currentPassword,
        };

        try {
            const response = await fetch(`${BASE_API_URL}users/${userInfo.userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updateDTO),
            });

            if (response.ok) {
                const updatedUser = await response.json();
                
                // (QUAN TRỌNG) Cập nhật lại AsyncStorage
                const jsonValue = await AsyncStorage.getItem('authData');
                if (jsonValue) {
                    const authData = JSON.parse(jsonValue);
                    authData.user = updatedUser; // Thay thế user cũ bằng user mới
                    await AsyncStorage.setItem('authData', JSON.stringify(authData));
                }

                Alert.alert("Thành công", "Cập nhật thông tin cá nhân thành công!");
                navigation.goBack();

            } else if (response.status === 401) {
                Alert.alert("Lỗi", "Mật khẩu hiện tại không đúng.");
            } else {
                const errorText = await response.text();
                Alert.alert("Lỗi", `Không thể cập nhật: ${errorText}`);
            }

        } catch (error) {
            console.error(error);
            Alert.alert("Lỗi", "Lỗi mạng, không thể kết nối đến máy chủ.");
        } finally {
            setIsLoading(false);
            setAvatarBase64(null); // Xóa base64 khỏi bộ nhớ
            setCurrentPassword(""); // Xóa mật khẩu
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.title}>Tài khoản của tôi</Text>

                {/* Avatar */}
                <View style={styles.avatarContainer}>
                    <Image 
                        source={avatarUri ? { uri: avatarUri } : { uri: "" }} 
                        style={styles.avatar} 
                    />
                    <TouchableOpacity style={styles.editButton} onPress={handlePickImage}>
                        <Icon name="pencil" size={20} color="#fff" />
                    </TouchableOpacity>
                </View>
                
                {/* Form */}
                <Text style={styles.label}>Họ và tên</Text>
                <TextInput
                    style={styles.input}
                    value={fullName}
                    onChangeText={setFullName}
                    placeholder="Nhập họ tên đầy đủ"
                />

                <Text style={styles.label}>Email (Tên đăng nhập)</Text>
                <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Nhập email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                <View style={styles.divider} />

                <Text style={styles.label}>Xác nhận mật khẩu</Text>
                <TextInput
                    style={styles.input}
                    value={currentPassword}
                    onChangeText={setCurrentPassword}
                    placeholder="Nhập mật khẩu hiện tại để lưu"
                    secureTextEntry
                />

                {/* Nút lưu */}
                <TouchableOpacity 
                    style={[styles.saveButton, isLoading && styles.disabledButton]} 
                    onPress={handleSave}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.saveButtonText}>Lưu thay đổi</Text>
                    )}
                </TouchableOpacity>

                {/* Nút Hủy */}
                <TouchableOpacity 
                    style={styles.cancelButton} 
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.cancelButtonText}>Hủy</Text>
                </TouchableOpacity>

            </ScrollView>
        </SafeAreaView>
    );
};