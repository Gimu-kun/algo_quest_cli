import { TouchableOpacity, View } from 'react-native';
import {styles} from './infoBar.styles'
import { Avatar, IconButton } from 'react-native-paper';
import { Text } from 'react-native-paper';

interface InfoBarProps {
    fullName: string;
    avatarUrl: string;
    onLogout: () => void;
}

const InfoBar = ({ fullName, avatarUrl, onLogout }: InfoBarProps) => {
    return(
        <View style={styles.infoBar}>
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
                            onPress={onLogout} // <-- Gọi hàm Đăng xuất
                            style={styles.logoutButton} // <-- Style mới
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