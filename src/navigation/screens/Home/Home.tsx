import { View , Animated } from "react-native";
import HomeCarousel from "../../../components/homeCarousel/HomeCarousel";
import InfoBar from "../../../components/infoBar/InfoBar";
import HomeCourses from "../../../components/homeCourses/HomeCourses";
import styles from "./home.style";
import HomeCategories from "../../../components/homeCategories/HomeCategories";
import { cateItemsType } from "../../../types/cateItemsType";
import { useRef } from "react";

export const Home = () => {
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
    return (
        <View style={{ flex: 1 }}>
            <View style={styles.page}>
                <InfoBar />
                <Animated.View style={[styles.pageRound,{opacity: fadeOut}]} />
                <Animated.ScrollView 
                contentContainerStyle={styles.container}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: true }
                )}>
                    <HomeCarousel />
                    <HomeCourses />
                    <HomeCategories itemsData={courseItemsData} headerText="Cấu trúc minh hoạ"/>
                    <HomeCategories itemsData={skillItemsData} headerText="Thuật toán minh hoạ"/>
                </Animated.ScrollView>
            </View>
        </View>
    );
}
