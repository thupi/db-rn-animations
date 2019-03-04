import React from "react";
import { Swipeable } from "./Swipeable";
import { ParallaxSlide } from "./ParallaxSlide";

export const Parallax = props => {
  return <Swipeable {...props} useNativeDriver={true} />;
};

Parallax.propTypes = Swipeable.propTypes;

Parallax.Slide = ParallaxSlide;
