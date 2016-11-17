
import React, { Component } from 'react';
import { AppRegistry, StyleSheet, Text, View, ListView, TouchableOpacity, Image, findNodeHandle, ActivityIndicator, Switch, Animated} from 'react-native'
import ViewContainer from 'WatchNext/app/components/ViewContainer'
import StatusBarBackground from 'WatchNext/app/components/StatusBarBackground'
import _ from 'lodash'
import Icon from 'react-native-vector-icons/Ionicons'

import Overlay from 'react-native-overlay'

import { BlurView, VibrancyView } from 'react-native-blur'

import LoadingOverlay from '../components/LoadingOverlay';


class MovieShowScreen extends Component {

  constructor(props) {
    super(props)
    this.state = {
      showBlurs: true,
      fadeAnim: new Animated.Value(100),
    }
  }

  imageLoaded() {
    this.setState({viewRef: findNodeHandle(this.refs.backgroundImage)})
  }


  fadeIn(_that, value)
  {
      that = _that;

      if(value == true) {
        that.setState({showBlurs: value})

          Animated.timing(
            that.state.fadeAnim,
            {toValue: 1,
            duration: 0}
        ).start();
      }
      else {
          Animated.timing(
            that.state.fadeAnim,
            {toValue: 0,
            duration: 1000}
        ).start(() => that.setState({showBlurs: value}));
      }
  }

  render() {
    return (
        
      <ViewContainer style={{backgroundColor: "white"}}>

        <StatusBarBackground />

        <View style={styles.blurToggle}>
          <Switch
            onValueChange={(value) => this.fadeIn(this, value)}
            value={this.state.showBlurs} />
        </View>


        <TouchableOpacity onPress={() => this.props.navigator.pop() } style={{marginLeft: 20}}>
          <Icon name="ios-arrow-back" size={40}/>
        </TouchableOpacity>


        <Text style={{marginTop:20, fontSize:20, marginLeft: 20}}>{'Person show screen'}</Text>
        <Text style={styles.personName}>{_.capitalize(this.props.movie.movieName)} {_.capitalize(this.props.movie.releaseYear)} </Text>


        <View style={styles.container}>
          
          <Image source={require('../images/movieDummey.jpg')} resizeMode='cover' style={styles.img} />

          {(this.state.showBlurs

            ? <View style={styles.container}>
            
              <Animated.View style={[{opacity: this.state.fadeAnim}, styles.container]}>  
                <BlurView blurType="dark" blurAmount={10} style={[styles.blurContainer, styles.container]}>
                  <ActivityIndicator
                  size="large"
                  animating={true}
                  style={styles.spinner} />
                </BlurView>
              </Animated.View>

              </View>

            : null
          )}

        </View>

      </ViewContainer>

    );
  }

}


const styles = StyleSheet.create({
  personName: {
    marginLeft: 25
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: 'transparent',
  },
  blurContainer: {
    paddingHorizontal: 20,
  },
  img: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    height: null,
    width: null,
  },
  welcome: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 10,
    color: 'white',
  }


});

module.exports = MovieShowScreen
