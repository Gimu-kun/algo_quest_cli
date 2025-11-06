import { TouchableOpacity, View } from 'react-native';
import {styles} from './infoBar.styles'
import { Avatar, Dialog, IconButton, Portal,Button } from 'react-native-paper';
import { Text } from 'react-native-paper';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';

interface InfoBarProps {
    fullName: string;
    avatarUrl: string;
    onLogout: () => void;
}

type InfoBarNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

const InfoBar = ({ fullName, avatarUrl, onLogout }: InfoBarProps) => {

    const [visible, setVisible] = useState(false);
    const navigation = useNavigation<InfoBarNavigationProp>();

    const showDialog = () => setVisible(true);
    const hideDialog = () => setVisible(false);

    const handleConfirm = () => {
        onLogout();
        hideDialog();
    };

    const navigateToProfile = () => {
        navigation.navigate('ProfileScreen');
    };

    // (THÊM HÀM)
    const navigateToAchievement = () => {
        navigation.navigate('AchievementScreen');
    };

    return(
        <View style={styles.infoBar}>
            <Portal>
                <Dialog visible={visible} onDismiss={hideDialog}>
                <Dialog.Icon icon="logout" />
                <Dialog.Title style={{textAlign:'center'}}>Xác nhận</Dialog.Title>
                <Dialog.Content>
                    <Text style={{textAlign:'center'}}>Bạn có chắc chắn muốn đăng xuất không?</Text>
                </Dialog.Content>
                <Dialog.Actions style={{display:'flex',flexDirection:'row-reverse',justifyContent:'center',gap:30}}>
                    <Button style={{paddingHorizontal:20, backgroundColor:'#7e7e7e7e'}} onPress={hideDialog}>
                        <Text style={{color:'#FFFFFF'}}>Hủy</Text>
                    </Button>
                    <Button style={{paddingHorizontal:20, backgroundColor:'#e74c3c'}} onPress={handleConfirm}>
                        <Text style={{color:'#FFFFFF'}}>Đồng ý</Text>
                    </Button>
                </Dialog.Actions>
                </Dialog>
            </Portal>
            <View style={styles.infoBox}>
                <TouchableOpacity onPress={navigateToProfile}> {/* <-- THÊM onPress */}
                    <View style={styles.avatarBox}>
                        <Avatar.Image size={55} source={{ uri: avatarUrl }} />
                    </View>
                </TouchableOpacity>
                <View>
                    <TouchableOpacity onPress={navigateToProfile}> {/* <-- THÊM onPress */}
                        <Text style={styles.accName} variant="labelLarge">{fullName}</Text>
                    </TouchableOpacity>
                    <View style={styles.toolBox}>
                        <IconButton
                            icon="fire"
                            iconColor="#FFA07A"
                            style={styles.toolIcon}
                            size={25}
                            onPress={() => console.log('Pressed')}
                        />
                        <View style={styles.toolLine}/>
                        <IconButton
                            icon="trophy-outline"
                            iconColor="#E0E0E0"
                            style={styles.toolIcon}
                            size={25}
                            onPress={navigateToAchievement} // <-- THÊM onPress
                        />
                        <View style={styles.toolLine}/>
                        <TouchableOpacity 
                            onPress={showDialog}
                            style={styles.logoutButton}
                        >
                            <IconButton
                                icon="logout"
                                iconColor="#fff" // Màu trắng cho icon Đăng xuất
                                style={styles.logoutIcon}
                                size={20}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <View style={styles.notiBox}>
                <View style={styles.infoIconShadow}>
                    <IconButton
                        icon="headphones"
                        iconColor="#E0E0E0"
                        style={styles.notiIcon}
                        size={25}
                        onPress={() => console.log('Pressed')}
                    />
                </View>
                <View style={styles.infoIconShadow}>
                    <IconButton
                        icon="bell"
                        iconColor="#E0E0E0"
                        style={styles.notiIcon}
                        size={25}
                        onPress={() => console.log('Pressed')}
                    />
                </View>
            </View>
        </View>
    );
};

export default InfoBar;