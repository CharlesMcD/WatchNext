
import React, { Component } from 'react';
import { AppRegistry, StyleSheet, Text, View, TouchableOpacity, Navigator, Image, ListView} from 'react-native'
import ViewContainer from 'WatchNext/app/components/ViewContainer'
import StatusBarBackground from 'WatchNext/app/components/StatusBarBackground'
import Icon from 'react-native-vector-icons/Ionicons'
import SQLite from 'react-native-sqlite-storage'

SQLite.DEBUG(true);
SQLite.enablePromise(true);

var database_name = "WatchNext.db";
var database_version = "1.0";
var database_displayname = "SQLite WatchNext Database";
var database_size = 200000;
var db;

class OptionScreen extends Component {

  constructor(props) {
    super(props);
    this.runDemo = this.runDemo.bind(this);
    this.errorCB = this.errorCB.bind(this);
    this.populateDB = this.populateDB.bind(this);
    this.deleteDatabase = this.deleteDatabase.bind(this);
    this.queryEmployees = this.queryEmployees.bind(this);
    this.loadAndQueryDB = this.loadAndQueryDB.bind(this);
    this.closeDatabase = this.closeDatabase.bind(this);

  }

  state = {
    progress: [],
    dataSource: new ListView.DataSource({ rowHasChanged: (row1, row2) => { row1 !== row2; },})
  };

  
   componentWillUnmount(){
        this.closeDatabase();
    }

    errorCB(err) {
        console.log("error: ",err);
        this.state.progress.push("Error " + (err.message || err));
        this.setState(this.state);
    }

    populateDatabase(db){
        var that = this;
        that.state.progress.push("Database integrity check");
        that.setState(that.state);
        db.executeSql('SELECT 1 FROM Version LIMIT 1').then(() =>{
            that.state.progress.push("Database is ready ... executing query ...");
            that.setState(that.state);
            db.transaction(that.queryEmployees).then(() => {
                that.state.progress.push("Processing completed");
                that.setState(that.state);
            });
        }).catch((error) =>{
            console.log("Received error: ", error)
            that.state.progress.push("Database not yet ready ... populating data");
            that.setState(that.state);
            db.transaction(that.populateDB).then(() =>{
                that.state.progress.push("Database populated ... executing query ...");
                that.setState(that.state);
                db.transaction(that.queryEmployees).then((result) => { 
                    console.log("Transaction is now finished"); 
                    that.state.progress.push("Processing completed");
                    that.setState(that.state);
                    that.closeDatabase()});
            });
        });
    }

    populateDB(tx) {
        var that = this;

        tx.executeSql('DROP TABLE IF EXISTS MyList;');

        this.state.progress.push("Executing CREATE stmts");
        this.setState(this.state);

        tx.executeSql('CREATE TABLE IF NOT EXISTS Version( '
            + 'version_id INTEGER PRIMARY KEY NOT NULL); ').catch((error) => {  
            that.errorCB(error) 
        });

        tx.executeSql('CREATE TABLE IF NOT EXISTS MyList( '
            + 'movie_id INTEGER PRIMARY KEY NOT NULL, '
            + 'movie_name VARCHAR(150), '
            + 'movie_summary VARCHAR(10000), '
            + 'movie_year INTEGER(10), '
            + 'poster_path VARCHAR(400), '
            + 'youtube_id VARCHAR(30));').catch((error) => {  
            that.errorCB(error) 
        });

        this.state.progress.push("Executing INSERT stmts");
        this.setState(this.state);

/*
        tx.executeSql('INSERT INTO MyList (movie_name, movie_summary, movie_year, poster_path, youtube_id) VALUES ("Teaser Trailer: Pirates of the Caribbean: Dead Men Tell No Tales", "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas ultrices dictum ultrices. Nunc blandit et nulla vel finibus. Pellentesque vitae dolor sed orci finibus malesuada et eget augue. Mauris scelerisque tristique pharetra. Nulla facilisi. Pellentesque scelerisque gravida leo, in pharetra libero posuere id. Aenean sit amet ornare leo.", "1969", "/xfWac8MTYDxujaxgPVcRD9yZaul.jpg" , "1xo3af_6_Jk");');

        tx.executeSql('INSERT INTO MyList (movie_name, movie_summary, movie_year, poster_path, youtube_id) VALUES ("Les aventure de Felix", "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas ultrices dictum ultrices. Nunc blandit et nulla vel finibus. Pellentesque vitae dolor sed orci finibus malesuada et eget augue. Mauris scelerisque tristique pharetra. Nulla facilisi. Pellentesque scelerisque gravida leo, in pharetra libero posuere id. Aenean sit amet ornare leo.", "2010", "/WLQN5aiQG8wc9SeKwixW7pAR8K.jpg" , "1xo3af_6_Jk");');
*/
        console.log("all config SQL done");
    }

    queryEmployees(tx) {
        var that = this;
        console.log("Executing movie query");

        tx.executeSql('SELECT movie_name, poster_path FROM MyList').then(([tx,results]) => {
            that.state.progress.push("Query completed");
            that.setState(that.state);
            var len = results.rows.length;
            for (let i = 0; i < len; i++) {
                let row = results.rows.item(i);
                that.state.progress.push(`MOVIE_NAME: ${row.movie_name}, MOVIE_ID: ${row.poster_path}`);
            }
            that.setState(that.state);
        }).catch((error) => { 
            console.log(error);
        });
    }

    loadAndQueryDB(){
        var that = this;
        that.state.progress.push("Plugin integrity check ...");
        that.setState(that.state);
        SQLite.echoTest().then(() => {
            that.state.progress.push("Integrity check passed ...");
            that.setState(that.state);
            that.state.progress.push("Opening database ...");
            that.setState(that.state);
            SQLite.openDatabase({name : database_name, createFromLocation : "~/db/watchnext.db"}).then((DB) => {
                db = DB;
                that.state.progress.push("Database OPEN");
                that.setState(that.state);
                that.populateDatabase(DB);
            }).catch((error) => {
                console.log(error);
            });
        }).catch(error => {
            that.state.progress.push("echoTest failed - plugin not functional");
            that.setState(that.state);
        });
    }

    closeDatabase(){
        var that = this;
        if (db) {
            console.log("Closing database ...");
            that.state.progress.push("Closing DB");
            that.setState(that.state);
            db.close().then((status) => {
                that.state.progress.push("Database CLOSED");
                that.setState(that.state);
            }).catch((error) => {
                that.errorCB(error);
            });
        } else {
            that.state.progress.push("Database was not OPENED");
            that.setState(that.state);
        }
    }

    deleteDatabase(){
        var that = this;
        that.state.progress = ["Deleting database"];
        that.setState(that.state);
        SQLite.deleteDatabase(database_name).then(() => {
            console.log("Database DELETED");
            that.state.progress.push("Database DELETED");
            that.setState(that.state);
        }).catch((error) => {
            that.errorCB(error);
        });
    }

    runDemo(){
        this.state.progress = ["Starting SQLite Demo"];
        this.setState(this.state);
        this.loadAndQueryDB();
    }

    renderProgressEntry(entry){
        return (<View style={listStyles.li}>
            <View>
                <Text style={listStyles.title}>{entry}</Text>
            </View>
        </View>)
    }

    render(){
        var ds = new ListView.DataSource({rowHasChanged: (row1, row2) => { row1 !== row2;}});
        return (<View style={styles.mainContainer}>
            <View style={styles.toolbar}>
                <Text style={styles.toolbarButton} onPress={this.runDemo}>
                    Run Demo
                </Text>
                <Text style={styles.toolbarButton} onPress={this.closeDatabase}>
                    Close DB
                </Text>
                <Text style={styles.toolbarButton} onPress={this.deleteDatabase}>
                    Delete DB
                </Text>
            </View>
            <ListView
                dataSource={ds.cloneWithRows(this.state.progress)}
                renderRow={this.renderProgressEntry}
                style={listStyles.liContainer}
                enableEmptySections={true} />
        </View>);
    }
};

var listStyles = StyleSheet.create({
    li: {
        borderBottomColor: '#c8c7cc',
        borderBottomWidth: 0.5,
        paddingTop: 15,
        paddingRight: 15,
        paddingBottom: 15,
    },
    liContainer: {
        backgroundColor: '#fff',
        flex: 1,
        paddingLeft: 15,
    },
    liIndent: {
        flex: 1,
    },
    liText: {
        color: '#333',
        fontSize: 17,
        fontWeight: '400',
        marginBottom: -3.5,
        marginTop: -3.5,
    },
});

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  toolbar: {
      backgroundColor: '#51c04d',
      paddingTop: 30,
      paddingBottom: 10,
      flexDirection: 'row'
  },
  toolbarButton: {
      color: 'blue',
      textAlign: 'center',
      flex: 1
  },
  mainContainer: {
      flex: 1
  }
});


module.exports = OptionScreen
