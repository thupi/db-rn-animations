import React from 'react';
import PropTypes from 'prop-types';
import { View, ViewPropTypes } from 'react-native';

const propTypes = {
	// eslint-disable-next-line react/no-unused-prop-types
  level: PropTypes.number,
  style: ViewPropTypes.style
};

export const ParallaxSlideItem = (props) => {
  return (
    <View {...props} />
  );
};

ParallaxSlideItem.propTypes = propTypes;
