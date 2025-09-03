import { renderItem } from "./RenderItems";
import * as React from "react";
import { Dimensions, View } from "react-native";
import { useSharedValue } from "react-native-reanimated";
import Carousel, { ICarouselInstance, Pagination } from "react-native-reanimated-carousel";
 
const defaultData = [
	"https://firebasestorage.googleapis.com/v0/b/wander-stay.appspot.com/o/%E2%99%A5%20Yoshi%20%E2%99%A5.jpeg?alt=media&token=69d07048-c874-433e-98b5-b9ad417126d2",
	"https://firebasestorage.googleapis.com/v0/b/wander-stay.appspot.com/o/Mario%20Kart.jpeg?alt=media&token=0bbd8a49-4c93-4605-a37e-f39d409b2b0e",
	"https://firebasestorage.googleapis.com/v0/b/wander-stay.appspot.com/o/Mario%20Party.jpeg?alt=media&token=0f70b62b-d909-4d50-98c9-84a2b0179ef2"
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
				autoPlay
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
 