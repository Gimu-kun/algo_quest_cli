import { View, Text, ImageBackground } from "react-native";
import styles from "./homeCategories.style";
import { Icon } from "react-native-paper";
import { cateItemsType } from "../../types/cateItemsType";

const HomeCategories = ({itemsData,headerText} : {itemsData:cateItemsType[], headerText:string}) => {
    const renderCateItems = (items : cateItemsType) => {
        return (
            <View key={items.id} style={styles.itemContainer}>
                <View style={styles.categoryRound}>
                    <View style={[styles.categoryShadow,{backgroundColor:items.color+'40'}]}>
                        <View style={[styles.categoryBtn,{backgroundColor:items.color}]}>
                            <Icon 
                            size={20}
                            color="#ffffff" 
                            source={items.icon} />
                        </View>
                    </View>
                </View>
                <Text style={styles.categoryTitle}>{items.displayName}</Text>
            </View>
        )
    }

    return (
        <View style={styles.categoriesBox}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>{headerText}</Text>
                <Text style={styles.seeAll}>Xem tất cả</Text>
            </View>
            <View style={styles.categoriesContainer}>
                <ImageBackground
                 style={styles.listContainer}
                 source={require('../../assets/background-pattern.jpeg')}
                 resizeMode="cover"
                 >
                    <View style={styles.overlay} />
                    {
                        itemsData.length != 0 && itemsData.map((item:cateItemsType)=>renderCateItems(item))
                    }
                </ImageBackground>
            </View>
        </View>
    );
};

export default HomeCategories;