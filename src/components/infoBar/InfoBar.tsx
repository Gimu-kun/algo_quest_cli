import { View, Image } from 'react-native';
import {styles} from './infoBar.styles'
import { Avatar, IconButton, MD3Colors } from 'react-native-paper';
import { Text } from 'react-native-paper';

const InfoBar = () => {
    return(
        <View style={styles.infoBar}>
            <View style={styles.infoBox}>
                <View style={styles.avatarBox}>
                    <Avatar.Image size={55} source={{uri:"https://firebasestorage.googleapis.com/v0/b/admin-4f88c.appspot.com/o/rabbit.jpg?alt=media&token=dad80004-dc3a-455c-92fc-53ce5b0b36c3"}} />
                </View>
                <View>
                    <Text style={styles.accName} variant="labelLarge">Nghiem Le</Text>
                    <View style={styles.toolBox}>
                        <IconButton
                            icon="fire"
                            iconColor={MD3Colors.error50}
                            style={styles.toolIcon}
                            size={25}
                            onPress={() => console.log('Pressed')}
                        />
                        <View style={styles.toolLine}/>
                        <IconButton
                            icon="book-clock-outline"
                            iconColor={MD3Colors.secondary100}
                            style={styles.toolIcon}
                            size={25}
                            onPress={() => console.log('Pressed')}
                        />
                        <View style={styles.toolLine}/>
                        <IconButton
                            icon="camera"
                            iconColor={MD3Colors.secondary100}
                            style={styles.toolIcon}
                            size={25}
                            onPress={() => console.log('Pressed')}
                        />
                    </View>
                </View>
            </View>
            <View style={styles.notiBox}>
                <View style={styles.infoIconShadow}>
                    <IconButton
                        icon="headphones"
                        iconColor={MD3Colors.secondary100}
                        style={styles.notiIcon}
                        size={25}
                        onPress={() => console.log('Pressed')}
                    />
                </View>
                <View style={styles.infoIconShadow}>
                    <IconButton
                        icon="bell"
                        iconColor={MD3Colors.secondary100}
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