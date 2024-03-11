import React, { useRef, useState } from "react";
import { View, Image, StyleSheet, PanResponder, Animated } from "react-native";
import { styles } from "./Styles.js";

const ZoomableImage = ({ imageUrl }) => {
  const imageRef = useRef(null);
  const [pan] = useState(new Animated.ValueXY());
  const [scale] = useState(new Animated.Value(1));

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        pan.setValue({ x: gestureState.dx, y: gestureState.dy });
      },
      onPanResponderRelease: () => {},
    })
  ).current;

  const handleZoom = (event) => {
    const touches = event.nativeEvent.touches;
    if (touches.length === 2) {
      const dx = touches[0].pageX - touches[1].pageX;
      const dy = touches[0].pageY - touches[1].pageY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const newScale = distance / 100;
      const minScale = 1;
      const maxScale = 3;
      const constrainedScale = Math.min(maxScale, Math.max(minScale, newScale));
      scale.setValue(constrainedScale);
    }
  };

  return (
    <View style={styles.zoomableImageContainer}>
      <Animated.Image
        ref={imageRef}
        source={{ uri: imageUrl }}
        style={[
          styles.zoomableImage,
          {
            transform: [
              { translateX: pan.x },
              { translateY: pan.y },
              { scale: scale },
            ],
          },
        ]}
        {...panResponder.panHandlers}
        onTouchMove={handleZoom}
      />
    </View>
  );
};

export default ZoomableImage;
