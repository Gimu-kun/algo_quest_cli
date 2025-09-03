import { View } from "react-native";
import CachedImageWithGifPreview from "../cachedImageWithGifPreview/CachedImageWithGifPreview";

export const renderItem = ({ rounded }: { rounded?: boolean }) => {
  return ({ item }: { item: string }) => (
    <View
      style={{
        flex: 1,
        borderRadius: rounded ? 20 : 0,
        justifyContent: "center",
        alignItems: "center",
        overflow: 'hidden',
      }}
    >
      <CachedImageWithGifPreview
        imageUri={item}
        previewGifUri={require('../../assets/loading.gif')}
        style={{ width: '100%', height: '100%', borderRadius: rounded ? 20 : 0 }}
      />
    </View>
  );
};
