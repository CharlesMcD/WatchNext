import React, { Component } from 'react';

import {
  Text,StyleSheet, View, ScrollView
} from 'react-native';

import HomeScreen from '../screens/HomeScreen'
import FavoriteListScreen from '../screens/FavoriteListScreen'
import OptionScreen from '../screens/OptionScreen'

import SwipeOutComponent from './SwipeOutComponent'

import ScrollableTabView, {DefaultTabBar, } from 'react-native-scrollable-tab-view';

class TabBarComponent extends Component {

  constructor(props) {
    super(props)
  }

  render() {

    return <ScrollableTabView
      style={{marginTop: 20, }}
      renderTabBar={() => <DefaultTabBar />}
      tabBarPosition='bottom'
      initialPage={1}
    >

      <ScrollView tabLabel="Options" >
        <View >
          <OptionScreen navigator={this.props.navigator} />
        </View>
      </ScrollView>

      <ScrollView tabLabel="Accueil" >
        <View >
          <HomeScreen navigator={this.props.navigator} />
        </View>
      </ScrollView>

      <ScrollView tabLabel="Ma liste" >
        <View >
          <FavoriteListScreen navigator={this.props.navigator} />
        </View>
      </ScrollView>

    </ScrollableTabView>
    ;
  }

}


const styles = StyleSheet.create({
  tabView: {
    flex: 1,
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.01)',
  }
});


module.exports = TabBarComponent