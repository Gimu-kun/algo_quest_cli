import { View , Animated, TouchableOpacity, Text, StyleSheet, Alert } from "react-native";
import HomeCarousel from "../../../components/homeCarousel/HomeCarousel";
import InfoBar from "../../../components/infoBar/InfoBar";
import HomeCourses from "../../../components/homeCourses/HomeCourses";
import styles from "./home.style";
import HomeCategories from "../../../components/homeCategories/HomeCategories";
import { cateItemsType } from "../../../types/cateItemsType";
import { useEffect, useRef, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "../../../ApiConfig";
import { UserInfo } from "../../../types/userType";
import HomeMultiplay from "../../../components/homeMultiplay/HomeMultiplay";
import { deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { db } from "../../../firebase";

type InviteData = {
    roomId: string;
    roomName: string;
    hostUsername: string;
};

export const Home = () => {
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const navigation = useNavigation<any>();

    useEffect(() => {
        let unsubscribe: (() => void) | null = null;

        const checkInvites = async () => {
            try {
                // 1. Lấy thông tin người dùng hiện tại
                const jsonValue = await AsyncStorage.getItem('authData');
                if (jsonValue === null) return; // Chưa đăng nhập

                const authData = JSON.parse(jsonValue);
                const username = authData.user?.username;
                if (!username) return;

                setUserInfo(authData.user); // (Cập nhật userInfo nếu cần)

                // 2. Tạo listener trong Firestore
                // Lắng nghe document có ID là username của MÌNH
                const inviteRef = doc(db, 'invitations', username);
                
                unsubscribe = onSnapshot(inviteRef, (docSnap) => {
                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        
                        // 3. Nếu có lời mời, hiển thị Alert
                        if (data.pending_invite) {
                            const invite: InviteData = data.pending_invite;
                            handleIncomingInvite(invite, inviteRef);
                        }
                    }
                });

            } catch (e) {
                console.error("Lỗi khi kiểm tra lời mời:", e);
            }
        };

        checkInvites();

        // Dọn dẹp listener
        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, []);

        const handleIncomingInvite = (invite: InviteData, inviteRef: any) => {
        Alert.alert(
            "Bạn có lời mời!",
            `'${invite.hostUsername}' mời bạn tham gia phòng: ${invite.roomName} (ID: ${invite.roomId})`,
            [
                {
                    text: "Từ chối",
                    style: "cancel",
                    onPress: async () => {
                        // (Scenario 1c) Xóa lời mời
                        await deleteDoc(inviteRef);
                    }
                },
                {
                    text: "Chấp nhận",
                    onPress: async () => {
                        // (Scenario 1b) Xóa lời mời VÀ chuyển trang
                        await deleteDoc(inviteRef);
                        navigation.navigate('WaitingRoom', { roomId: invite.roomId });
                    }
                }
            ]
        );
    };

    const fetchUserInfo = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('authData');

            if (jsonValue !== null) {
                // Phân tích chuỗi JSON thành đối tượng { user: {...}, token: "..." }
                const authData = JSON.parse(jsonValue);
                const userData = authData.user;
                // Cập nhật state với thông tin người dùng cần hiển thị
                setUserInfo({
                    userId: userData.userId,
                    username: userData.username,
                    fullName: userData.fullName || userData.username, // Hiển thị tên đầy đủ
                    avatar: userData.avatar,
                    role: userData.role,
                });
            }
        } catch (e) {
            console.error("Lỗi khi đọc AsyncStorage:", e);
        }
    };

    useEffect(() => {
        fetchUserInfo();
    }, []);
    
    const courseItemsData: cateItemsType[] = [
        {
            id: 1,
            mark: 'Lnk',
            icon: 'link-box-variant-outline',
            color: '#1370f2',
            displayName: 'Danh sách liên kết'
        }, 
        {
            id: 2,
            mark: 'Stk',
            icon: 'stack-overflow',
            color: '#1370f2',
            displayName: 'Ngăn xếp'
        },
        {
            id: 3,
            mark: 'Que',
            icon: 'human queue',
            color: '#1370f2',
            displayName: 'Hàng chờ'
        }, {
            id: 4,
            mark: 'Tree',
            icon: 'family-tree',
            color: '#1370f2',
            displayName: 'Cây'
        }, {
            id: 5,
            mark: 'Hash',
            icon: 'format-header-pound',
            color: '#1370f2',
            displayName: 'Bảng băm'
        }
    ]

    const skillItemsData: cateItemsType[] = [
        {
            id: 1,
            mark: 'THN',
            icon: 'eiffel-tower',
            color: '#1370f2',
            displayName: 'Tháp HN'
        }, {
            id: 2,
            mark: 'KS',
            icon: 'bag-personal-outline',
            color: '#54be3f',
            displayName: 'Knapsack'
        },
        {
            id: 3,
            mark: 'MH',
            icon: 'file-tree-outline',
            color: '#e1b60a',
            displayName: 'Max heap'
        }, {
            id: 4,
            mark: 'mH',
            icon: 'file-tree',
            color: '#f30717',
            displayName: 'Min heap'
        }, {
            id: 5,
            mark: 'MR',
            icon: 'vector-rectangle',
            color: '#f5794c',
            displayName: 'Max Rect'
        }
    ]

    const scrollY = useRef(new Animated.Value(0)).current;

    const fadeOut = scrollY.interpolate({
        inputRange: [0, 100],  // scroll từ 0 đến 100px
        outputRange: [1, 0],   // opacity từ 1 -> 0
        extrapolate: 'clamp',  // không cho vượt quá 0 hoặc 1
    });

    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem('authData');
            setUserInfo(null);
            navigation.replace('Login');
        } catch (e) {
            console.error("Lỗi khi đăng xuất:", e);
        }
    };

    
    return (
        <View style={{ flex: 1 }}>
            <View style={styles.page}>
                {userInfo && (
                    <InfoBar 
                        // TRUYỀN PROPS VÀO InfoBar
                        fullName={userInfo.fullName} 
                        // Ghép URL đầy đủ cho Avatar
                        avatarUrl={`${BASE_URL}${userInfo.avatar}`} 
                        onLogout={handleLogout} // Truyền hàm Đăng xuất
                    />
                )}
                <Animated.View style={[styles.pageRound,{opacity: fadeOut}]} />
                <Animated.ScrollView 
                contentContainerStyle={styles.container}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: true }
                )}>
                    <HomeCarousel />
                    <HomeCourses />
                    <HomeMultiplay/>
                    <HomeCategories itemsData={courseItemsData} headerText="Cấu trúc minh hoạ"/>
                    <HomeCategories itemsData={skillItemsData} headerText="Thuật toán minh hoạ"/>
                </Animated.ScrollView>
            </View>
        </View>
    );
}