//  include react-native-swipeout
import Swipeout from 'react-native-swipeout';

import React, { Component } from 'react';
import { AppRegistry, StyleSheet, Text, View, Navigator, TouchableOpacity, Dimensions, ActivityIndicator, Switch, Animated} from 'react-native'

import YoutubeShowScreen from 'WatchNext/app/screens/YoutubeShowScreen'

import Orientation from 'react-native-orientation';
import { Icon } from 'react-native-elements'
import { BlurView, VibrancyView } from 'react-native-blur'

import SQLite from 'react-native-sqlite-storage'

SQLite.enablePromise(true);
var db;
var database_name = "WatchNext.db";

class SwipeOutComponent extends Component {

    constructor(props) {
      super(props);
      this._orientationDidChange = this._orientationDidChange.bind(this);
      this._loadAndAddMovieToDB = this._loadAndAddMovieToDB.bind(this);
      this._AddToBD = this._AddToBD.bind(this);
      this._SetNextMovie = this._SetNextMovie.bind(this);
      this._handleVideoIsPlaying = this._handleVideoIsPlaying.bind(this);
      this._handleVideoIsStopped = this._handleVideoIsStopped.bind(this);
      this._handleInvalidVideo = this._handleInvalidVideo.bind(this);
      
      
      

      this.SetYoutubeIdFromApi(this.state.videoArray[this.state.currentVideoIndex].id);

      this.likeBtn = [{
        backgroundColor: '#009933',
        text: 'Ajouter à \n ma liste' ,
        onPress: () => this._loadAndAddMovieToDB(),
      }];

      this.dislikeBtn = [{
        backgroundColor: '#ffad99',
        text: 'Refuser' ,
        onPress: () => this._declineVideo(),
      }];

      //console.log(this.refs.fieldEditor1.state)

    }

    state = {
        scrollEnabled: false,
        dimension: Dimensions.get('window'),
        currentVideoID: "",
        videoArray: this.props.videoArray,
        currentVideoIndex: 0,
        pageNumber: 1,
        showBlurs: true,
        fadeAnim: new Animated.Value(100),
      };


    _orientationDidChange(orientation) {
      this.setState({ dimension: Dimensions.get('window') });
    }

    componentDidMount() {
      Orientation.addOrientationListener(this._orientationDidChange);
    }

    componentWillUnmount() {
      Orientation.removeOrientationListener(this._orientationDidChange);
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
              duration: 1200}
          ).start(() => that.setState({showBlurs: value}));
        }
    }


    _loadAndAddMovieToDB() {
        var that = this;
        SQLite.openDatabase({name : database_name, createFromLocation : "~/db/watchnext.db"}).then((DB) => {
            db = DB;
            that._AddMovieToMyList(DB);

        }).catch((error) => {
            console.log(error);
        });
    }

    _SetNextMovie() {
      var nextIndex = this.state.currentVideoIndex + 1;

      console.log("INDEX: " + nextIndex);

      function stateCallBack()
      {
        this.SetYoutubeIdFromApi(this.state.videoArray[this.state.currentVideoIndex].id);
      }

      if(nextIndex == 20)
      {
        nextIndex = 0;
        nextPageNumber = this.state.pageNumber + 1;

        this.state.pageNumber = nextPageNumber;

        var that = this;
        this.getMoviesListFromApi().then(function(){ that.setState({ currentVideoIndex: nextIndex }, stateCallBack)});

      }
      else {
          this.setState({ currentVideoIndex: nextIndex }, stateCallBack);
      }
      
    }

    _declineVideo() {
      this._SetNextMovie();
    } 

    _AddMovieToMyList(db) {
      var that = this;
        db.transaction(that._AddToBD).then(() =>{
            that._CloseDatabase();
            //alert('Ajouté!')

            that._SetNextMovie();
        });
    }

    _AddToBD(tx) {
      var currentVideo = this.state.videoArray[this.state.currentVideoIndex];
      console.log(currentVideo);

      tx.executeSql('INSERT INTO MyList (movie_name, movie_summary, movie_year, poster_path, youtube_id) VALUES ("' + currentVideo.title.replace(/[\""]/g, '') + '", "' + 
      currentVideo.overview.replace(/[\""]/g, '') + '", "' + currentVideo.release_date + '", "' + currentVideo.poster_path + '", "' + this.state.currentVideoID + '");');
    }

    _CloseDatabase(){
        var that = this;
        if (db) {
            console.log("Closing database ...");
            db.close().then((status) => {
                console.log("fermé");
            }).catch((error) => {
                console.log(error);
            });
        } else {
            console.log("DB pas ouverte");
        }
    }


    async getMoviesListFromApi() {

      console.log("Nouvelle liste");

      try {
        let response = await fetch('https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&page=' + this.state.pageNumber + ' &api_key=9a08e0161bf22bda67444f5d7fe41bc0');
        let responseJson = await response.json();

        this.setState({ videoArray: responseJson.results });

      } catch(error) {
        console.error(error);
      }
    }

    async SetYoutubeIdFromApi(imdbVideoId) {

      console.log(imdbVideoId);

      try {
        let response = await fetch('https://api.themoviedb.org/3/movie/' + imdbVideoId + '/videos?api_key=9a08e0161bf22bda67444f5d7fe41bc0&language=en-US');
        let responseJson = await response.json();

        //Aller chercher le trailer officiel parmis la liste de video (s'il existe)
        var bestTrailerIndex = this.getBestTrailerIndex(responseJson.results);

        while(bestTrailerIndex == -1) {
          
        }

        this.setState({ currentVideoID: responseJson.results[bestTrailerIndex].key }, this._handleVideoIsStopped);
          

      } catch(error) {
        console.error(error);
      }
    }

    getBestTrailerIndex(trailerList) {
      var index = 0;

      if(trailerList.length != 0) {

        for (i = 0; i < trailerList.length; i++) { 
          let name = trailerList[i].name.toLowerCase()

          if(name.includes("trailer") && name.includes("official")) {
            index = i;
            break;
          }
        }

      }
      else {
        index = -1
      }

      return index;
    }


    _renderButtons() {
      return (
        <View pointerEvents='box-none' style={[styles.sideSignWrapper, {width: this.state.dimension.width, height: this.state.dimension.height }]}>
          <View>
            <Text style={[styles.signText, {color:'#ffad99'}]}>›</Text>
          </View>

          <View>
            <Text style={[styles.signText, {color:'#009933'}]}>‹</Text>
          </View>

        </View>
      )
    }

    _handleVideoIsPlaying() {
      //this.setState({ showBlurs: false });
      this.fadeIn(this, false);
      console.log("La video à starté!")
    } 

    _handleVideoIsStopped() {
      //this.setState({ showBlurs: true });
      this.fadeIn(this, true);
      console.log("La video à arreté!")
    } 

    _handleInvalidVideo() {
      console.log(this);
      this._declineVideo();
      console.log("La video invalide on switch!")
    } 

/*
    _handleSwitchVideo() {
      this.refs.YoutubePlayer.resetCurrentTime();
      console.log("RESET du current time")
    } 
*/

    render() {
      return (
        <View style={styles.container}>
          <View style={styles.fullScreen}>

            <Swipeout
              backgroundColor= 'black'
              right={this.likeBtn}
              left={this.dislikeBtn}
              autoClose={true}>

              <View style={{height:this.state.dimension.height}}>
                
                <View style={styles.bContainer}>
                  <YoutubeShowScreen ref="YoutubePlayer" handleVideoIsPlaying={this._handleVideoIsPlaying} handleVideoIsStopped={this._handleVideoIsStopped} handleInvalidVideo={this._handleInvalidVideo} videoID={this.state.currentVideoID}/>

                  {(this.state.showBlurs

                    ? <View style={styles.bContainer}>
                    
                      <Animated.View style={[{opacity: this.state.fadeAnim}, styles.bContainer]}>  
                        <BlurView blurType="dark" blurAmount={20} style={[styles.blurContainer, styles.bContainer]}>
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

                <Text style={styles.titleText}>
                  {this.state.videoArray[this.state.currentVideoIndex].title}
                </Text>
              </View>
              
            </Swipeout>

            {this._renderButtons()}

          </View>
        </View>
      );
    }

}

var styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  fullScreen: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  sideSignWrapper: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    position: 'absolute',
    top: 0,
    left: 0,
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 10,
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  titleText: {
    backgroundColor: 'transparent',
    color: '#fff',
    position: 'absolute',
    top: 15,
    marginLeft: 15
  },
  signText: {
    fontSize: 50,
    color: '#007aff',
    fontFamily: 'Arial',
  },
  liContainer: {
    flex: 2,
  },
  liText: {
    color: '#333',
    fontSize: 16,
  },
  navbar: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomColor: '#eee',
    borderColor: 'transparent',
    borderWidth: 1,
    justifyContent: 'center',
    height: 44,
  },
  navbarTitle: {
    color: '#444',
    fontSize: 16,
    fontWeight: "500",
  },
  statusbar: {
    backgroundColor: '#fff',
    height: 22,
  },
  bContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: 'transparent',
  },
  blurContainer: {
    paddingHorizontal: 20,
  },
})

module.exports = SwipeOutComponent
