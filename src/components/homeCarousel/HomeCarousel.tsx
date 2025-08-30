import { renderItem } from "./RenderItems";
import * as React from "react";
import { Dimensions, View } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import Carousel, { ICarouselInstance, Pagination } from "react-native-reanimated-carousel";
 
const defaultData = [
	"https://firebasestorage.googleapis.com/v0/b/admin-4f88c.appspot.com/o/banner1.jpg?alt=media&token=3f1de09b-9e4a-4984-9238-05d0a187c173",
	"https://firebasestorage.googleapis.com/v0/b/admin-4f88c.appspot.com/o/banner2.jpg?alt=media&token=1a4dddd1-6414-4377-97b8-9c34ce062b02",
	"https://firebasestorage.googleapis.com/v0/b/admin-4f88c.appspot.com/o/banner3.jpg?alt=media&token=dcae676a-2bca-4058-ab6b-7ca6ccca80bb",
	"https://firebasestorage.googleapis.com/v0/b/admin-4f88c.appspot.com/o/banner4.jpg?alt=media&token=d78dfc4a-450b-403b-89c0-618819589495",
	"https://firebasestorage.googleapis.com/v0/b/admin-4f88c.appspot.com/o/banner5.jpg?alt=media&token=e7145fa0-63ab-4f75-9314-de032b06aa0a",
];
 
function HomeCarousel() {
    const ref = React.useRef<ICarouselInstance>(null);
	const progress = useSharedValue<number>(0);
    const width = Dimensions.get("window").width;
    const onPressPagination = (index: number) => {
    ref.current?.scrollTo({
      count: index - progress.value,
      animated: true,
    });
  };
	return (
		<View
			id="carousel-component"
		>
			<Carousel
                ref={ref}
				autoPlayInterval={2000}
				data={defaultData}
				height={258}
				loop={true}
				pagingEnabled={true}
				snapEnabled={true}
				width={width}
				style={{
					width: width,
				}}
				mode="parallax"
				modeConfig={{
					parallaxScrollingScale: 0.9,
					parallaxScrollingOffset: 50,
				}}
				onProgressChange={progress}
				renderItem={renderItem({ rounded: true })}
			/>
            <Pagination.Basic
                progress={progress}
                data={defaultData}
                dotStyle={{ backgroundColor: "rgba(0,0,0,0.2)", height:3 }}
                containerStyle={{ gap: 10, marginTop: 5 }}
                onPress={onPressPagination}
            />
		</View>
	);
}
 
export default HomeCarousel;
 