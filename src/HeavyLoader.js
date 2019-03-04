import React, { Component } from "react";
import {
  Text,
  TouchableOpacity,
  Alert,
  View,
  StyleSheet,
  Dimensions
} from "react-native";

let initialPerfCount = 150;
const windowHeight = Dimensions.get("window").height;

export default class HeavyLoader extends Component {
  state = {
    progress: 0
  };

  perfCount = 0;

  sleep(miliseconds) {
    var currentTime = new Date().getTime();
    let dataSim = 0;
    while (currentTime + miliseconds >= new Date().getTime()) {
      dataSim = dataSim * 3.14;
    }
  }

  performLoad = () => {
    requestAnimationFrame(() => {
      this.sleep(120);

      this.perfCount = this.perfCount + 1;

      if (this.perfCount !== initialPerfCount) {
        this.setState(
          {
            progress: (this.perfCount / initialPerfCount) * 100
          },
          this.performLoad()
        );
      } else {
        this.perfCount = 0;
        this.setState(
          {
            progress: 0
          },
          () => Alert.alert("Load test done!")
        );
      }
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.button} onPress={this.performLoad}>
          <View
            style={[
              styles.buttonLoader,
              { width: (256 / 100) * this.state.progress }
            ]}
          />
          <Text style={styles.buttonText}>Perform Heavy Load</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: windowHeight - 128,
    right: 0,
    left: 0,
    justifyContent: "center",
    alignItems: "center",
    padding: 24
  },
  button: {
    position: "relative",
    backgroundColor: "#444444",
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: 24,
    paddingRight: 24,
    height: 54,
    width: 256,
    overflow: "hidden"
  },
  buttonText: {
    color: "#FFFFFF"
  },
  buttonLoader: {
    position: "absolute",
    top: 0,
    left: 0,
    height: 54,
    backgroundColor: "red"
  }
});
