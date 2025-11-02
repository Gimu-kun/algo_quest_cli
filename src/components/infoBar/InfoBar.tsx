import { TouchableOpacity, View } from 'react-native';
import {styles} from './infoBar.styles'
import { Avatar, Dialog, IconButton, Portal,Button } from 'react-native-paper';
import { Text } from 'react-native-paper';
import { useState } from 'react';

interface InfoBarProps {
    fullName: string;
    avatarUrl: string;
    onLogout: () => void;
}

const InfoBar = ({ fullName, avatarUrl, onLogout }: InfoBarProps) => {

    const [visible, setVisible] = useState(false);

    const showDialog = () => setVisible(true);
    const hideDialog = () => setVisible(false);

    const handleConfirm = () => {
        onLogout();
        hideDialog();
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
                <View style={styles.avatarBox}>
                    <Avatar.Image size={55} source={{ uri: avatarUrl }} />
                </View>
                <View>
                    <Text style={styles.accName} variant="labelLarge">{fullName}</Text>
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
                            icon="book-clock-outline"
                            iconColor="#E0E0E0"
                            style={styles.toolIcon}
                            size={25}
                            onPress={() => console.log('Pressed')}
                        />
                        <View style={styles.toolLine}/>
                        <IconButton
                            icon="camera"
                            iconColor="#E0E0E0"
                            style={styles.toolIcon}
                            size={25}
                            onPress={() => console.log('Pressed')}
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