
import React, { Component } from 'react';
import { AppRegistry, StyleSheet, Text, View, ListView, TouchableOpacity, Navigator, RefreshControl} from 'react-native'
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
      movieDataSource : ds.cloneWithRows(movieList)
    }

    this.loadAndQueryDB();
  }

  componentDidMount() {
    console.log("MONTER!");
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

        tx.executeSql('SELECT movie_name, youtube_id FROM MyList').then(([tx,results]) => {
            var len = results.rows.length;
            for (let i = 0; i < len; i++) {
                let row = results.rows.item(i);
                movieList.push({firstName: row.movie_name, lastName: row.youtube_id, number: null});
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


  render() {
    return (
      <ViewContainer >

        <StatusBarBackground />

        <TouchableOpacity style={styles.ButtonIcon}>
          <Button backgroundColor="#5c97ce" onPress={() => this.loadAndQueryDB()}>
              Rafraichir
          </Button>
        </TouchableOpacity>

        <ListView
          style={{marginTop:20}}
          dataSource={this.state.movieDataSource}
          renderRow={(person) => { return this._renderPersonRow(person)} }
          renderSeparator={(sectionId, rowId) => <View key={rowId} style={styles.separator} />}
          enableEmptySections={true}
          />

      </ViewContainer>

    );
  }

  _renderPersonRow(person) {
    return (
        <TouchableOpacity style={styles.personRow} onPress={ (event) => this._navigateToPersonShow(person)}>
          <View style={{flex: 1}}>
            <Text style={styles.personName}>
              {_.capitalize(person.firstName)} {_.capitalize(person.lastName)}
            </Text>
          </View>
        </TouchableOpacity>
    )
  }

  _navigateToPersonShow(person) {
    this.props.navigator.push({
      ident: "PersonShow",
      person: person,
      //sceneConfig:Navigator.SceneConfigs.FloatFromBottom
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
    padding: 12,
    flexDirection: "row",
    justifyContent: "flex-start",
  },

  personName: {
    alignItems:'center',
  },

  personIcon: {
    marginRight: 25,
    position: 'absolute',
    right: 0
  },

  separator: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#8E8E8E',
  }


});

module.exports = FavoriteListScreen
