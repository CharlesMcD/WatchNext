import React, { Component } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native'

import Overlay from 'react-native-overlay'

import { BlurView, VibrancyView } from 'react-native-blur';



class LoadingOverlay extends Component {

    

constructor(props) {
    super(props);

    console.log(props);
}   


  render() {
    return (
      <Overlay isVisible={this.props.isVisible}>
        <BlurView style={styles.background} blurType="dark">
          <ActivityIndicator
            size="large"
            animating={true}
            style={styles.spinner} />
        </BlurView>
      </Overlay>
    );
  }
}

var styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
  },
})

module.exports = LoadingOverlay;