import React from "react";
import { SafeAreaView, TouchableOpacity, Text } from "react-native";

import HeavyLoader from "./src/HeavyLoader";

import AnimatedDemo from "./src/AnimatedDemo";
import PanResponderDemo from "./src/PanResponderDemo";

// import SwipeableRow from "./src/SwipeableRow";
// import BottomSheet from "./src/BottomSheet";
// import Swipeable from "./src/Swipeable";

import Parallax from "./src/Parallax";
import OriginalParallax from "./src/OriginalParallax";

export default class App extends React.Component {
  render() {
    return (
      <SafeAreaView>
        <PanResponderDemo />
      </SafeAreaView>
    );
  }
}
