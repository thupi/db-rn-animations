import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Swipeable } from "./Swipeable";

export default class Example extends Component {
  state = {
    activeTab: 1
  };

  handleChangeIndex = index => {
    this.setState({ activeTab: index });
  };

  render() {
    return (
      <Swipeable
        index={this.state.activeTab}
        onChangeIndex={this.handleChangeIndex}
      >
        <View style={styles.content}>
          <Text>Tab 1</Text>
        </View>
        <View style={styles.content}>
          <Text>Tab 2</Text>
        </View>
        <View style={styles.content}>
          <Text>Tab 3</Text>
        </View>
      </Swipeable>
    );
  }
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "center",
    height: 200
  }
});
