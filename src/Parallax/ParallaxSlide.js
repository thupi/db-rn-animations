import React, { Component } from "react";
import PropTypes from "prop-types";
import { View, Animated, Dimensions } from "react-native";
import { ParallaxSlideItem } from "./ParallaxSlideItem";

const windowWidth = Dimensions.get("window").width;

export class ParallaxSlide extends Component {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.element,
      PropTypes.arrayOf(PropTypes.element)
    ]).isRequired,
    swipeableInjectedProps: PropTypes.object
  };

  static Item = ParallaxSlideItem;

  getTransform = (index, offset, level) => {
    const isFirstPage = index === 0;
    const statRange = (isFirstPage ? 0 : index - 1);
    const endRange = isFirstPage ? 1 : index;
    const startOpacity = isFirstPage ? 1 : 0;
    const endOpacity = isFirstPage ? 1 : 1;
    const leftPosition = isFirstPage ? 0 : 1 / 3;
    const rightPosition = isFirstPage ? -1 / 3 : 0;
    const transform = [
      {
        transform: [
          {
            translateX: this.props.swipeableInjectedProps.animatedValue.interpolate(
              {
                inputRange: [statRange, endRange],
                outputRange: [
                  isFirstPage ? leftPosition : leftPosition - offset * level,
                  isFirstPage ? rightPosition + offset * level : rightPosition
                ]
              }
            )
          }
        ]
      },
      {
        opacity: this.props.swipeableInjectedProps.animatedValue.interpolate({
          inputRange: [statRange, endRange],
          outputRange: [startOpacity, endOpacity]
        })
      }
    ];
    return {
      transform
    };
  };

  getFallbackLevel = index => {
    return -index * 10 - 1;
  };

  renderChild = (child, pageIndex, index) => {
    const level = child.props.level || this.getFallbackLevel(index);
    const { transform } = this.getTransform(pageIndex, 10, level);
    const root = child.props.children;
    let nodes = child;
    if (Array.isArray(root)) {
      nodes = root.map((node, i) =>
        this.renderChild(node, pageIndex, `${index}_${i}`)
      );
    }
    let animatedChild = child;
    if (level !== 0) {
      animatedChild = (
        <Animated.View style={[child.props.style, transform]}>
          {nodes}
        </Animated.View>
      );
    } else {
      animatedChild = <View style={child.props.style}>{nodes}</View>;
    }
    return animatedChild;
  };

  render() {
    return React.Children.map(this.props.children, (child, i) => {
      return this.renderChild(
        child,
        this.props.swipeableInjectedProps.slideIndex,
        i
      );
    });
  }
}
