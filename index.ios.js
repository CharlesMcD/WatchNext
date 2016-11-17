
import React, { Component } from 'react';
import { AppRegistry, StyleSheet, Navigator, Text} from 'react-native'

import PeopleIndexScreen from './app/screens/PeopleIndexScreen'
import MovieShowScreen from './app/screens/MovieShowScreen'
import VideoShowScreen from './app/screens/VideoShowScreen'
import SwipeShowScreen from './app/screens/SwipeShowScreen'
import YoutubeShowScreen from './app/screens/YoutubeShowScreen'
import SwipeOutComponent from './app/components/SwipeOutComponent'
import TabBarComponent from './app/components/TabBarComponent'
//import VideoShowScreen from './app/screens/TestVideoShowScreen'

class WatchNext extends Component {


  _renderScene( route, navigator) {

    var globalNavigatorProps = { navigator }

    switch (route.ident) {

      case "HomeShow":
        return (
          <TabBarComponent
          {...globalNavigatorProps}/>
        )

      case "PeopleIndex":
        return (
          <PeopleIndexScreen {...globalNavigatorProps} />
        )

      case "MovieShow":
        return (
          <MovieShowScreen
          {...globalNavigatorProps}
          movie={route.movie}/>
        )

      case "SwipeShow":
        return (
          <SwipeOutComponent
          {...globalNavigatorProps}
          videoArray={route.videoArray}/>
        )

      default:
        return (
          <Text>{'Mauvaise route'}</Text>
        )
      }
  }


  render() {
    return (
      <Navigator
      initialRoute={{ident: "HomeShow"}}
      ref="appNavigator"
      style={styles.navigatorStyles}
      renderScene={this._renderScene}
      configureScene={(route) => ({
        ...route.sceneConfig || Navigator.SceneConfigs.FloatFromRight })} />
    )
  }

}


const styles = StyleSheet.create({

  navigatorStyles: {

  }

});

AppRegistry.registerComponent('WatchNext', () => WatchNext);
