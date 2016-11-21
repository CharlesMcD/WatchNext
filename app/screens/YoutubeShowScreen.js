
import React, { Component } from 'react';
import { AppRegistry, StyleSheet, Text, View, TouchableOpacity, AlertIOS, Dimensions} from 'react-native'
import ViewContainer from 'WatchNext/app/components/ViewContainer'
import StatusBarBackground from 'WatchNext/app/components/StatusBarBackground'
import _ from 'lodash'
import { Icon } from 'react-native-elements'
import { SocialIcon } from 'react-native-elements'


var YouTube = require('react-native-youtube');


class YoutubeShowScreen extends Component {

  constructor(props) {
    super(props);
    this.onProgress = this.onProgress.bind(this);

    this.dimension = Dimensions.get('window');

  }

  state = {
    isReady: false,
    status: null,
    quality: null,
    error: null,
    isPlaying: true,
    duration: 0.0,
    currentTime: 0.0,
  };

  

  onProgress(data) {
    this.setState({duration: data.duration});
    this.setState({currentTime: data.currentTime});
  }

  getCurrentTimePercentage() {
    if (this.state.currentTime > 0) {
      return parseFloat(this.state.currentTime) / parseFloat(this.state.duration);
    } else {
      return 0;
    }
  }


  changeVideoStateHandler(e) {
    this.setState({status: e.state})

    if((e.state == "playing" || e.state == "paused")) {
      console.log(this.state.currentTime);
      this.props.handleVideoIsPlaying();
    }
    else if(e.state == "unstarted"){
      this.props.handleInvalidVideo();
    }

    else {
      //this.props.handleVideoIsStopped();
    }


    console.log(e.state)
  }


  resetCurrentTime() {
    console.log("RESET APPELÉ");
    this.setState({currentTime: 0}, console.log("VOICI LE CURRENT TIME: " + this.state.currentTime))



    //console.log("VOICI LE CURRENT TIME: " + this.state.currentTime)
  }


  render() {

    const flexCompleted = this.getCurrentTimePercentage() * 100;
    const flexRemaining = (1 - this.getCurrentTimePercentage()) * 100;

      return (

          <View style={styles.container}>
    
            <YouTube
              videoId={this.props.videoID ? this.props.videoID : "wuaLbft1rKc"}
              play={this.state.isPlaying}
              loop={true}
              hidden={true}
              playsInline={true}
              iv_load_policy={3}
              rel={false}
              showinfo={false}
              controls={0}
              onProgress={this.onProgress}
              onReady={(e)=>{this.setState({isReady: true})}}
              onChangeState={(e)=>{this.changeVideoStateHandler(e)}}
              onChangeQuality={(e)=>{this.setState({quality: e.quality})}}
              onError={(e)=>{this.setState({error: e.error})}}
              style={[this.state.currentTime > 0 ? [styles.showVideo , {height:this.dimension.height}] : styles.hideVideo]}
            />
          
          <Text style={[styles.instructions, this.state.currentTime > 0 ? styles.hideVideo : {}]}>{this.state.currentTime > 0 ? '' : 'Le lecteur est en cours de préparation...'}</Text>

            <View style={styles.controls}>
              <View style={styles.trackingControls}>
                <View style={styles.progress}>
                  <View style={[styles.innerProgressCompleted, {flex: flexCompleted}]} />
                  <View style={[styles.innerProgressRemaining, {flex: flexRemaining}]} />
                </View>
              </View>
            </View>
          </View>

      );
  }
}

var styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
  },
  controls: {
    backgroundColor: "transparent",
    borderRadius: 5,
    position: 'absolute',
    bottom: 4,
    left: 4,
    right: 4,
  },
  progress: {
    flex: 1,
    flexDirection: 'row',
    borderRadius: 3,
    overflow: 'hidden',
  },
  innerProgressCompleted: {
    height: 5,
    backgroundColor: '#cccccc',
  },
  innerProgressRemaining: {
    height: 5,
    backgroundColor: '#2C2C2C',
  },
  hideVideo: {
    width: 0,
    height: 0,
  },
  showVideo: {
    alignSelf: 'stretch',
    height: 300, 
    backgroundColor: 'black',
    marginVertical: 10
  }
});


module.exports = YoutubeShowScreen
