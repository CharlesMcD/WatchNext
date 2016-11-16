
import React, { Component } from 'react';
import { AppRegistry, StyleSheet, Text, View, TouchableOpacity, Navigator, Image} from 'react-native'
import ViewContainer from 'WatchNext/app/components/ViewContainer'
import StatusBarBackground from 'WatchNext/app/components/StatusBarBackground'
import Icon from 'react-native-vector-icons/Ionicons'

class HomeScreen extends Component {

  constructor(props) {
    super(props)

    this.state = {
      videoArray: []
    }
  }

  render() {
    return (
      <ViewContainer>

        <StatusBarBackground />

        <TouchableOpacity style={styles.ButtonIcon}>
          <Icon.Button name="ios-videocam" backgroundColor="#5c97ce" onPress={() => this._navigateToVideo()}>
              Commencer le visionnement!
          </Icon.Button>
        </TouchableOpacity>

        <TouchableOpacity style={styles.ButtonIcon}>
          <Icon.Button name="ios-videocam" backgroundColor="#5c97ce" onPress={() => this.getBestTrailerIndex()}>
              Test API
          </Icon.Button>
        </TouchableOpacity>

      </ViewContainer>

    );
  }

  _navigateToVideo() {

    this.getMoviesFromApi().then(() => {
        this.props.navigator.push({
          ident: "SwipeShow",
          videoArray: this.state.videoArray, 
          sceneConfig:Navigator.SceneConfigs.FloatFromBottom
        })
    });
  }

  async getMoviesFromYoutube() {
    try {
      let response = await fetch('https://www.googleapis.com/youtube/v3/videos?id=Div0iP65aZo&key=AIzaSyCyXlAeJMx9mSt3oLDDflXLHoPsnnOOVPo&part=snippet,statistics');
      let responseJson = await response.json();
      console.log(responseJson.items[0]);
      //return responseJson.movies;
    } catch(error) {
      console.error(error);
    }
  }




  getBestTrailerIndex(trailerList) {

    var index = 0;

    for (i = 0; i < trailerArray.length; i++) { 
      let name = trailerArray[i].toLowerCase()

      if(name.includes("trailer") && name.includes("official")) {
        index = i;
        break;
      }
    }
  }


  async getMoviesFromApi() {

      try {
        let response = await fetch('https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=9a08e0161bf22bda67444f5d7fe41bc0');
        let responseJson = await response.json();

        this.setState({ videoArray: responseJson.results });

      } catch(error) {
        console.error(error);
      }
    }

}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },

  ButtonIcon: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100
  }


});

module.exports = HomeScreen
