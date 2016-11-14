//  include react-native-swipeout
import Swipeout from 'react-native-swipeout';

import React, { Component } from 'react';
import { AppRegistry, StyleSheet, Text, View, Navigator, TouchableOpacity, Dimensions} from 'react-native'

import YoutubeShowScreen from 'WatchNext/app/screens/YoutubeShowScreen'
import Orientation from 'react-native-orientation';
import { Icon } from 'react-native-elements'

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
    }

    state = {
        scrollEnabled: false,
        dimension: Dimensions.get('window'),
        currentVideoID: "",
        videoArray: this.props.videoArray,
        currentVideoIndex: 0,
        pageNumber: 1
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

      if(nextIndex == 20)
      {
        nextIndex = 0;
        nextPageNumber = this.state.pageNumber + 1;
        this.setState({ pageNumber: nextPageNumber });

        this.getMoviesListFromApi();
      }

      function stateCallBack()
      {
        this.SetYoutubeIdFromApi(this.state.videoArray[this.state.currentVideoIndex].id);
      }

      this.setState({ currentVideoIndex: nextIndex }, stateCallBack);
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
      tx.executeSql('INSERT INTO MyList (movie_name, youtube_id) VALUES ("' + currentVideo.title + '", "1xo3af_6_Jk");');
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

      try {
        let response = await fetch('https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&page=' + this.state.pageNumber + ' &api_key=9a08e0161bf22bda67444f5d7fe41bc0');
        let responseJson = await response.json();

        this.setState({ videoArray: responseJson.results });

      } catch(error) {
        console.error(error);
      }
    }

    async SetYoutubeIdFromApi(imdbVideoId) {

      try {
        let response = await fetch('https://api.themoviedb.org/3/movie/' + imdbVideoId + '/videos?api_key=9a08e0161bf22bda67444f5d7fe41bc0&language=en-US');
        let responseJson = await response.json();

        //Aller chercher le trailer officiel parmis la liste de video (s'il existe)
        var bestTrailerIndex = this.getBestTrailerIndex(responseJson.results);

        this.setState({ currentVideoID: responseJson.results[bestTrailerIndex].key });

        console.log("nouveau ID");
        console.log(responseJson.results[bestTrailerIndex].key);

      } catch(error) {
        console.error(error);
      }
    }

    getBestTrailerIndex(trailerList) {
      var index = 0;

      for (i = 0; i < trailerList.length; i++) { 
        let name = trailerList[i].name.toLowerCase()

        if(name.includes("trailer") && name.includes("official")) {
          index = i;
          break;
        }
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
                <YoutubeShowScreen videoID={this.state.currentVideoID}/>
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
  }
})

module.exports = SwipeOutComponent
