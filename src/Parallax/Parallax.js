import React from "react";
import { Swipeable } from "../Swipeable/Swipeable";
import { ParallaxSlide } from "./ParallaxSlide";

export const Parallax = props => {
  return <Swipeable {...props} />;
};

Parallax.propTypes = Swipeable.propTypes;

Parallax.Slide = ParallaxSlide;
