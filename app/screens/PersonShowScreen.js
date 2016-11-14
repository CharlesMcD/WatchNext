
import React, { Component } from 'react';
import { AppRegistry, StyleSheet, Text, View, ListView, TouchableOpacity} from 'react-native'
import ViewContainer from 'WatchNext/app/components/ViewContainer'
import StatusBarBackground from 'WatchNext/app/components/StatusBarBackground'
import _ from 'lodash'
import Icon from 'react-native-vector-icons/Ionicons'


class PersonShowScreen extends Component {

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <ViewContainer style={{backgroundColor: "aliceblue"}}>

        <StatusBarBackground />

        <TouchableOpacity onPress={() => this.props.navigator.pop() } style={{marginLeft: 20}}>
          <Icon name="ios-arrow-back" size={40}/>
        </TouchableOpacity>

        <Text style={{marginTop:100, fontSize:20, marginLeft: 20}}>{'Person show screen'}</Text>
        <Text style={styles.personName}>{_.capitalize(this.props.person.firstName)} {_.capitalize(this.props.person.lastName)} </Text>

      </ViewContainer>

    );
  }

}


const styles = StyleSheet.create({
  personName: {
    marginLeft: 25
  }


});

module.exports = PersonShowScreen
