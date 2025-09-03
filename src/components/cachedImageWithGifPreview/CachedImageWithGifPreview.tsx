import React, { useState } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

const CachedImageWithGifPreview = ({ imageUri, previewGifUri, style }:{ imageUri:string, previewGifUri:string, style:{} }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <View style={[styles.container, style]}>
      {!loaded && (
        <WebView
          source={typeof previewGifUri === 'string' ? { uri: previewGifUri } : previewGifUri}
          style={[StyleSheet.absoluteFill, style]}
          scalesPageToFit
          javaScriptEnabled
          scrollEnabled={false}
        />
      )}
      <Image
        source={{ uri: imageUri }}
        style={[StyleSheet.absoluteFill, style]}
        onLoadEnd={() => setLoaded(true)}
        resizeMode="cover"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
});

export default CachedImageWithGifPreview;
