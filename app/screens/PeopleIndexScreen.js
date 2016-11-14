
import React, { Component } from 'react';
import { AppRegistry, StyleSheet, Text, View, ListView, TouchableOpacity, Navigator, Image, TouchableHighlight} from 'react-native'
import ViewContainer from 'WatchNext/app/components/ViewContainer'
import StatusBarBackground from 'WatchNext/app/components/StatusBarBackground'
//import SwipeOutComponent from 'WatchNext/app/components/SwipeOutComponent'
import _ from 'lodash'
import Icon from 'react-native-vector-icons/Ionicons'
import ActionButton from 'react-native-action-button';


import Button from 'react-native-button';

class PeopleIndexScreen extends Component {

  constructor(props) {
    super(props)

    this.state = {
    }
  }


  render() {
    return (
      <ViewContainer>

        <StatusBarBackground />

        <TouchableOpacity style={styles.ButtonIcon}>
          <Icon.Button name="ios-videocam" backgroundColor="#5c97ce" onPress={() => this._navigateToSwipe()}>
              Commencer le visionnement! 
          </Icon.Button>
        </TouchableOpacity>

      </ViewContainer>

    );
  }




  _navigateToSwipe() {

    console.log(this.props)

    this.props.navigator.push({
      ident: "SwipeShow",
      sceneConfig:Navigator.SceneConfigs.FloatFromBottom
    })
  }


}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  personRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    height:40
  },

  personName: {
    marginLeft: 25
  },

  personIcon: {
    marginRight: 25
  },

  ButtonIcon: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100
  }


});

module.exports = PeopleIndexScreen
