import { View } from 'react-native';
import {styles} from './infoBar.styles'
import { Avatar, IconButton } from 'react-native-paper';
import { Text } from 'react-native-paper';

const InfoBar = () => {
    return(
        <View style={styles.infoBar}>
            <View style={styles.infoBox}>
                <View style={styles.avatarBox}>
                    <Avatar.Image size={55} source={{uri:"https://firebasestorage.googleapis.com/v0/b/wander-stay.appspot.com/o/avatar.jpeg?alt=media&token=d3b66e5d-2143-47ea-bc3a-29a7f3956f43"}} />
                </View>
                <View>
                    <Text style={styles.accName} variant="labelLarge">Nghiem Le</Text>
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