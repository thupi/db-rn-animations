import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  ScrollView,
  Animated,
  View,
  Dimensions,
  ViewPropTypes,
  StyleSheet
} from "react-native";

import { PanGestureHandler, State } from "react-native-gesture-handler";

const windowWidth = Dimensions.get("window").width;

const USE_NATIVE_DRIVER = true;

export class Swipeable extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    disabled: PropTypes.bool,
    index: PropTypes.number,
    onChangeIndex: PropTypes.func,
    onSwitching: PropTypes.func,
    resistance: PropTypes.bool,
    slideStyle: ViewPropTypes.style,
    style: ViewPropTypes.style,
    threshold: PropTypes.number,
    containerStyle: ViewPropTypes.style,
    scrollable: PropTypes.bool,
    itemsInScreen: PropTypes.number,
    inputRange: PropTypes.array,
    skipItemsInSwipe: PropTypes.number,

    containerProps: PropTypes.object,
    animatedTension: PropTypes.number,
    animatedFriction: PropTypes.number,
    useNativeDriver: PropTypes.bool
  };

  static defaultProps = {
    index: 0,
    threshold: 5,
    resistance: false,
    disabled: false,
    itemsInScreen: 1,
    inputRange: [0, windowWidth],
    skipItemsInSwipe: 0,
    xAxisStrict: false,
    useNativeDriver: false
  };

  snapPointsFromLeft = [0, -windowWidth, -windowWidth * 2];

  constructor(props) {
    super(props);
    const START = this.snapPointsFromLeft[0];
    const END = this.snapPointsFromLeft[this.snapPointsFromLeft.length - 1];

    this.state = {
      viewWidth: windowWidth,
      lastSnap: START
    };

    this._dragX = new Animated.Value(0);
    this._onGestureEvent = Animated.event(
      [{ nativeEvent: { translationX: this._dragX } }],
      { useNativeDriver: USE_NATIVE_DRIVER }
    );

    this._translateXOffset = new Animated.Value(START);
    this._translateX = Animated.add(
      this._translateXOffset,
      this._dragX
    ).interpolate({
      inputRange: [END, START],
      outputRange: [END, START]
    });
  }

  swipeable = React.createRef();

  handleLayout = event => {
    const { width } = event.nativeEvent.layout;

    if (width) {
      this.setState({
        viewWidth: width / this.props.itemsInScreen
      });
    }
  };

  _onHandlerStateChange = ({ nativeEvent }) => {
    if (nativeEvent.oldState === State.ACTIVE) {
      let { velocityX, translationX } = nativeEvent;
      const dragToss = 0.1;
      const endOffsetX =
        this.state.lastSnap + translationX + dragToss * velocityX;

      let destSnapPoint = this.snapPointsFromLeft[0];

      for (let i = 0; i < this.snapPointsFromLeft.length; i++) {
        const snapPoint = this.snapPointsFromLeft[i];
        const distFromSnap = Math.abs(snapPoint - endOffsetX);
        if (distFromSnap < Math.abs(destSnapPoint - endOffsetX)) {
          destSnapPoint = snapPoint;
        }
      }
      this.setState({ lastSnap: destSnapPoint });
      this._translateXOffset.extractOffset();
      this._translateXOffset.setValue(translationX);
      this._translateXOffset.flattenOffset();
      this._dragX.setValue(0);
      Animated.spring(this._translateXOffset, {
        velocity: velocityX,
        tension: 68,
        friction: 12,
        toValue: destSnapPoint,
        useNativeDriver: USE_NATIVE_DRIVER
      }).start();
    }
  };

  render() {
    const {
      children,
      style,
      slideStyle,
      containerStyle,
      disabled
    } = this.props;
    const { viewWidth } = this.state;

    const START = this.snapPointsFromLeft[0];
    const END = this.snapPointsFromLeft[this.snapPointsFromLeft.length - 1];

    const childrenToRender = React.Children.map(children, (child, index) => {
      const containerProps = this.props.containerProps;
      if (this.props.scrollable) {
        return (
          <ScrollView
            ref={this.handleScrollViewRef}
            {...containerProps}
            style={[styles.slide, slideStyle, child.props.style]}
          >
            {React.cloneElement(child, {
              swipeableInjectedProps: {
                slideIndex: index,
                animatedValue: this._dragX
              }
            })}
          </ScrollView>
        );
      } else {
        return (
          <View
            {...containerProps}
            style={[styles.slide, slideStyle, child.props.style]}
          >
            {React.cloneElement(child, {
              swipeableInjectedProps: {
                slideIndex: index,
                animatedValue: this._translateX.interpolate({
                  inputRange: [END, START],
                  outputRange: [children.length - 1, 0]
                })
              }
            })}
          </View>
        );
      }
    });

    const sceneContainerStyle = {
      width: viewWidth * React.Children.count(children),
      transform: [
        {
          translateX: this._translateX
        }
      ]
    };

    return (
      <View style={[styles.root, style]} onLayout={this.handleLayout}>
        <PanGestureHandler
          ref={this.swipeable}
          shouldCancelWhenOutside={false}
          onGestureEvent={this._onGestureEvent}
          onHandlerStateChange={this._onHandlerStateChange}
        >
          <Animated.View
            style={[styles.container, containerStyle, sceneContainerStyle]}
          >
            {childrenToRender}
          </Animated.View>
        </PanGestureHandler>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    overflow: "hidden"
  },
  container: {
    flexDirection: "row"
  },
  slide: {
    flex: 1
  },
  content: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "center",
    height: 200
  }
});
