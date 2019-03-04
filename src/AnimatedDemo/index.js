import React from "react";
import { Animated, TouchableOpacity, Text } from "react-native";

export default class AnimatedBox extends React.Component {
  animatedValue = new Animated.Value(0);

  handlePress = () => {
    Animated.spring(this.animatedValue, {
      toValue: 100,
      tension: 30,
      friction: 12,
      useNativeDriver: true
    }).start();
  };

  render() {
    const style = {
      height: 100,
      width: 100,
      backgroundColor: "red"
    };
    const animatedStyle = {
      transform: [
        {
          translateX: this.animatedValue
        }
      ]
    };

    return (
      <Animated.View style={animatedStyle}>
        <TouchableOpacity style={style} onPress={this.handlePress}>
          <Text>Press here</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  }
}
