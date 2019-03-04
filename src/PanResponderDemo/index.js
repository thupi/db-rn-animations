import React from "react";
import { Animated, View, PanResponder } from "react-native";

export default class AnimatedBox extends React.Component {
  translateX = new Animated.Value(1);
  translateXValue = 0;
  translateY = new Animated.Value(1);
  translateYValue = 0;

  responder = PanResponder.create({
    onMoveShouldSetPanResponder: (e, gestureState) => true,
    onPanResponderGrant: () => {
      this.translateY.setOffset(this.translateYValue);
      this.translateY.setValue(0);
      this.translateX.setOffset(this.translateXValue);
      this.translateX.setValue(0);
    },
    onPanResponderMove: (e, gestureState) => {
      this.translateY.setValue(gestureState.dy);
      this.translateX.setValue(gestureState.dx);
    },
    onPanResponderRelease: (e, gestureState) => {
      this.translateY.flattenOffset();
      this.translateX.flattenOffset();
    }
  });

  componentDidMount() {
    this.translateY.addListener(({ value }) => {
      this.translateYValue = value;
    });

    this.translateX.addListener(({ value }) => {
      this.translateXValue = value;
    });
  }

  render() {
    const style = {
      height: 100,
      width: 100,
      backgroundColor: "red",
      transform: [
        {
          translateX: this.translateX
        },
        {
          translateY: this.translateY
        }
      ]
    };
    return <Animated.View style={style} {...this.responder.panHandlers} />;
  }
}
