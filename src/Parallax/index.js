import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";

import { Parallax } from "./Parallax";

export default class Example extends Component {
  state = {
    activeTab: 0
  };

  handleChangeIndex = index => {
    this.setState({ activeTab: index });
  };

  render() {
    return (
      <Parallax
        index={this.state.activeTab}
        onChangeIndex={this.handleChangeIndex}
        style={styles.screen}
      >
        <Parallax.Slide>
          <Parallax.Slide.Item level={-1}>
            <View style={styles.container}>
              <View style={[styles.placeholder, { height: 64, opacity: 1 }]} />
            </View>
          </Parallax.Slide.Item>
          <Parallax.Slide.Item level={-15}>
            <View style={styles.container}>
              <View
                style={[styles.placeholder, { height: 196, opacity: 0.8 }]}
              />
            </View>
          </Parallax.Slide.Item>
          <Parallax.Slide.Item level={-30}>
            <View style={styles.container}>
              <View
                style={[styles.placeholder, { height: 400, opacity: 0.6 }]}
              />
            </View>
          </Parallax.Slide.Item>
        </Parallax.Slide>
        <Parallax.Slide>
          <Parallax.Slide.Item level={-1}>
            <View style={styles.container}>
              <View style={[styles.placeholder, { height: 64, opacity: 1 }]} />
            </View>
          </Parallax.Slide.Item>
          <Parallax.Slide.Item level={-15}>
            <View style={styles.container}>
              <View
                style={[styles.placeholder, { height: 256, opacity: 0.8 }]}
              />
            </View>
          </Parallax.Slide.Item>
          <Parallax.Slide.Item level={-30}>
            <View style={styles.container}>
              <View
                style={[styles.placeholder, { height: 300, opacity: 0.6 }]}
              />
            </View>
          </Parallax.Slide.Item>
        </Parallax.Slide>
        <Parallax.Slide>
          <Parallax.Slide.Item level={-1}>
            <View style={styles.container}>
              <View style={[styles.placeholder, { height: 64, opacity: 1 }]} />
            </View>
          </Parallax.Slide.Item>
          <Parallax.Slide.Item level={-15}>
            <View style={styles.container}>
              <View
                style={[styles.placeholder, { height: 164, opacity: 0.8 }]}
              />
            </View>
          </Parallax.Slide.Item>
          <Parallax.Slide.Item level={-30}>
            <View style={styles.container}>
              <View
                style={[styles.placeholder, { height: 200, opacity: 0.6 }]}
              />
            </View>
          </Parallax.Slide.Item>
        </Parallax.Slide>
      </Parallax>
    );
  }
}

const styles = StyleSheet.create({
  screen: {
    paddingTop: 24
  },
  container: {
    justifyContent: "center",
    alignItems: "center"
  },
  placeholder: {
    width: 320,
    height: 164,
    backgroundColor: "#444444",
    borderRadius: 36,
    marginBottom: 24
  }
});
