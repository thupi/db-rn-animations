import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  Animated,
  Dimensions,
  PanResponder,
  StyleSheet,
  View,
  ViewPropTypes,
  ScrollView
} from "react-native";

const RESISTANCE_COEF = 0.7;
const X_AXIS_CAPTURE_THRESHOLD = 3;
const ANIMATED_TENSION = 68;
const ANIMATED_FRICTION = 12;

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
    inputRange: [0, 1],
    skipItemsInSwipe: 0,
    xAxisStrict: false,
    useNativeDriver: false
  };

  scrollViewsRefs = null;

  constructor(props) {
    super(props);

    this.state = {
      indexLatest: props.index,
      indexCurrent: new Animated.Value(props.index),
      viewWidth: Dimensions.get("window").width
    };
  }

  componentWillMount() {
    this.panResponder = PanResponder.create({
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => {
        const dx = Math.abs(gestureState.dx);
        const dy = Math.abs(gestureState.dy);

        return dx > dy && dx > X_AXIS_CAPTURE_THRESHOLD;
      },
      onMoveShouldSetPanResponder: () => false,
      onPanResponderTerminationRequest: () => false,
      onPanResponderRelease: this.handleTouchEnd,
      onPanResponderTerminate: this.handleTouchEnd,
      onPanResponderMove: this.handleTouchMove,
      onPanResponderGrant: this.handleTouchStart
    });
  }

  componentWillReceiveProps(nextProps) {
    const { index } = nextProps;

    if (typeof index === "number" && index !== this.props.index) {
      if (
        this.props.scrollable &&
        this.scrollViewsRefs &&
        this.props.index !== index
      ) {
        this.scrollViewsRefs[this.props.index].scrollTo({
          x: 0,
          animated: true
        });
      }

      this.setState(
        {
          indexLatest: index
        },
        () => {
          Animated.spring(this.state.indexCurrent, {
            toValue: index,
            tension: this.props.animatedTension || ANIMATED_TENSION,
            friction: this.props.animatedFriction || ANIMATED_FRICTION,
            useNativeDriver: this.props.useNativeDriver
          }).start();
        }
      );
    }
  }

  selectNewIndex = (vx, indexCurrent, indexStart) => {
    let indexNew;

    // Quick movement
    if (Math.abs(vx) * 10 > this.props.threshold) {
      if (vx > 0) {
        indexNew = Math.floor(indexCurrent) - this.props.skipItemsInSwipe;
      } else {
        indexNew = Math.ceil(indexCurrent) + this.props.skipItemsInSwipe;
      }
    } else {
      // Some hysteresis with indexStart
      if (Math.abs(indexStart - indexCurrent) > 0.6) {
        indexNew = Math.round(indexCurrent);
      } else {
        indexNew = indexStart;
      }
    }

    const indexMax = React.Children.count(this.props.children) - 1;

    if (indexNew < 0) {
      indexNew = 0;
    } else if (indexNew > indexMax) {
      indexNew = indexMax;
    }
    return indexNew;
  };

  resetScrollView = (indexStart, indexNew) => {
    if (
      this.props.scrollable &&
      this.scrollViewsRefs &&
      indexStart !== indexNew
    ) {
      this.scrollViewsRefs[indexStart].scrollTo({ x: 0, animated: true });
    }
  };

  transtionToSlide = indexNew => {
    this.setState(
      {
        indexLatest: indexNew
      },
      () => {
        Animated.spring(this.state.indexCurrent, {
          toValue: indexNew,
          tension: this.props.animatedTension || ANIMATED_TENSION,
          friction: this.props.animatedFriction || ANIMATED_FRICTION,
          useNativeDriver: this.props.useNativeDriver
        }).start();

        if (this.props.onSwitching) {
          this.props.onSwitching(indexNew, "end");
        }

        if (this.props.onChangeIndex) {
          this.props.onChangeIndex(indexNew);
        }
      }
    );
  };

  handleTouchStart = (event, gestureState) => {
    this.startX = gestureState.x0;
  };

  handleTouchMove = (event, gestureState) => {
    const { moveX } = gestureState;

    let index =
      this.state.indexLatest + (this.startX - moveX) / this.state.viewWidth;

    const indexMax = React.Children.count(this.props.children) - 1;

    if (!this.props.resistance) {
      // Reset the starting point
      if (index < 0) {
        index = 0;
        this.startX = moveX;
      } else if (index > indexMax) {
        index = indexMax;
        this.startX = moveX;
      }
    } else {
      if (index < 0) {
        index = Math.exp(index * RESISTANCE_COEF) - 1;
      } else if (index > indexMax) {
        index = indexMax + 1 - Math.exp((indexMax - index) * RESISTANCE_COEF);
      }
    }

    this.state.indexCurrent.setValue(index);

    if (this.props.onSwitching) {
      this.props.onSwitching(index, "move");
    }
  };

  handleTouchEnd = (event, gestureState) => {
    const { vx, moveX } = gestureState;

    const indexStart = this.state.indexLatest;
    const indexCurrent =
      indexStart + (this.startX - moveX) / this.state.viewWidth;

    const indexNew = this.selectNewIndex(vx, indexCurrent, indexStart);
    this.resetScrollView(indexStart, indexNew);

    this.transtionToSlide(indexNew);
  };

  handleLayout = event => {
    const { width } = event.nativeEvent.layout;

    if (width) {
      this.setState({
        viewWidth: width / this.props.itemsInScreen
      });
    }
  };

  handleScrollViewRef = ref => {
    if (this.props.scrollable) {
      if (this.scrollViewsRefs === null) {
        this.scrollViewsRefs = [];
      }
      this.scrollViewsRefs.push(ref);
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
    const { indexCurrent, viewWidth } = this.state;

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
                animatedValue: this.state.indexCurrent
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
                animatedValue: this.state.indexCurrent
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
          translateX: indexCurrent.interpolate({
            inputRange: this.props.inputRange,
            outputRange: [0, -viewWidth]
          })
        }
      ]
    };

    const panHandlers = disabled ? {} : this.panResponder.panHandlers;

    return (
      <View style={[styles.root, style]} onLayout={this.handleLayout}>
        <Animated.View
          {...panHandlers}
          style={[styles.container, containerStyle, sceneContainerStyle]}
        >
          {childrenToRender}
        </Animated.View>
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
  }
});
