
import React, { Component } from 'react';
import { AppRegistry, StyleSheet, Text, View, ListView, TouchableOpacity} from 'react-native'
import ViewContainer from 'WatchNext/app/components/ViewContainer'
import StatusBarBackground from 'WatchNext/app/components/StatusBarBackground'
import _ from 'lodash'
import Icon from 'react-native-vector-icons/Ionicons'

import YoutubeShowScreen from 'WatchNext/app/screens/YoutubeShowScreen'

import Swiper from 'react-native-swiper';

class SwipeShowScreen extends Component {

  constructor(props) {
    super(props)
  }

/*
  _onMomentumScrollEnd(e, state, context) {
    console.log(state, context.state)
  }
*/

  render() {
    return (

      <ViewContainer style={{backgroundColor: "aliceblue"}}>

        <Swiper style={styles.wrapper} showsButtons={true}>
          <View style={styles.slide1}>
            <Text style={styles.text}>Hello Swiper</Text>
          </View>
          <View style={styles.slide2}>
            <Text style={styles.text}>Beautiful</Text>
          </View>
          <View style={styles.slide3}>
            <YoutubeShowScreen></YoutubeShowScreen>
          </View>
        </Swiper>

      </ViewContainer>

    );
  }

}


const styles = StyleSheet.create({
  wrapper: {
  },
  slide1: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#9DD6EB',
  },
  slide2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#97CAE5',
  },
  slide3: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:"black"
  },
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  }


});

module.exports = SwipeShowScreen
