
import React, { Component } from 'react';
import { AppRegistry, StyleSheet, Text, View, ListView, TouchableOpacity, Navigator, RefreshControl, Image, Dimensions, InteractionManager, Animated} from 'react-native'
import ViewContainer from 'WatchNext/app/components/ViewContainer'
import StatusBarBackground from 'WatchNext/app/components/StatusBarBackground'
//import SwipeOutComponent from 'WatchNext/app/components/SwipeOutComponent'
import _ from 'lodash'
import Icon from 'react-native-vector-icons/FontAwesome'
import SQLite from 'react-native-sqlite-storage'


import Button from 'react-native-button';

var database_name = "WatchNext.db";
var database_version = "1.0";
var database_displayname = "SQLite Test Database";
var database_size = 200000;
var db;

var movieList = [];

class FavoriteListScreen extends Component {

  constructor(props) {
    super(props)

    this.queryEmployees = this.queryEmployees.bind(this);

    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 != r2})

    this.state = {
      movieDataSource : ds.cloneWithRows(movieList),
      fadeAnim: new Animated.Value(0)
    }

  }

  componentDidMount() {
    console.log("MONTER!");

    InteractionManager.runAfterInteractions(() => {
      this.loadAndQueryDB();
      fadeIn(this);
    });

    function fadeIn(_that)
    {
        that = _that;

        Animated.timing(          // Uses easing functions
            that.state.fadeAnim,    // The value to drive
            {toValue: 1}            // Configuration
        ).start();
    }
    
  }


  loadAndQueryDB(){
    movieList = [];
    var that = this;
    SQLite.openDatabase({name : database_name, createFromLocation : "~/db/watchnext.db"}).then((DB) => {
          db = DB;
          DB.transaction(that.queryEmployees).then(() => {
          console.log("Processing completed");
    });

      }).catch((error) => {
          console.log(error);
      });
  }

  queryEmployees(tx) {
        var that = this;
        console.log("Executing movie query");

        tx.executeSql('SELECT movie_name, movie_summary, movie_year, poster_path, youtube_id FROM MyList').then(([tx,results]) => {
            var len = results.rows.length;
            for (let i = 0; i < len; i++) {
                let row = results.rows.item(i);
                movieList.push({movieName: row.movie_name, releaseYear: row.movie_year, summary: row.movie_summary, posterPath: row.poster_path, youtube_id: row.youtube_id});
            }

            that.setState({movieDataSource: that.getDataSource(movieList) });

            console.log(movieList);
        }).catch((error) => { 
            console.log(error);
        });
    }

    getDataSource(movies) {
        return this.state.movieDataSource.cloneWithRows(movies);
    }

    refreshList() {
        this.loadAndQueryDB();   
    }


  render() {
    return (
      <ViewContainer >

        <StatusBarBackground />

        <TouchableOpacity style={styles.ButtonIcon}>
          <Button backgroundColor="#5c97ce" onPress={() => this.refreshList()}>
              Rafraichir
          </Button>
        </TouchableOpacity>

        <Animated.View style={{opacity: this.state.fadeAnim}}>
         <ListView
          style={{marginTop:20}}
          dataSource={this.state.movieDataSource}
          renderRow={(person) => { return this._renderPersonRow(person)} }
          renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator} />}
          enableEmptySections={true}
          />
        </Animated.View>

      </ViewContainer>

    );
  }

  _renderPersonRow(movie) {

    return (
        <TouchableOpacity style={styles.movieRow} onPress={ (event) => this._navigateToMovieShow(movie)}>
                <View>
                    <Image style={styles.image} source={{uri: 'https://image.tmdb.org/t/p/w500' + movie.posterPath}}/>
                </View>

                <View>
                    <Text style={styles.movieName}>
                        {_.capitalize(movie.movieName)}
                    </Text>
                    <Text style={styles.movieYear}>
                        ({movie.releaseYear})
                    </Text>
                    <View style={{flex: 1}}>
                        <Text style={styles.movieSummary}>
                            {_.truncate(movie.summary, {'length': 120})}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
    )
  }

  _navigateToMovieShow(movie) {
    this.props.navigator.push({
      ident: "MovieShow",
      movie: movie
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
  movieRow: {
        flexDirection: "row",
        justifyContent: "flex-start",
        marginBottom: 10,
        marginLeft: 10,
        marginTop: 10
    },
    listView : {
        marginBottom: 50
    },
    movieName: {
        fontSize: 20,
        color: "black",
        width: Dimensions.get('window').width - 125
    },
    movieYear: {

    },
    movieSummary: {
        width: Dimensions.get('window').width - 125
    },
    image: {
        width: 90,
        height: 125,
        resizeMode: 'cover',
        marginRight: 10
    },

  separator: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#8E8E8E',
  }


});

module.exports = FavoriteListScreen
