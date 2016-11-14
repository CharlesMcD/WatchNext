import React, { Component } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native'

import SQLite from 'react-native-sqlite-storage'

SQLite.enablePromise(true);
var db;
var database_name = "Test.db";

class AddMovieComponent extends Component {

    constructor(props) {
        super(props)

        this.queryEmployees = this.queryEmployees.bind(this);

        this.state = {
        }

        this.loadAndAddMovieToDB();
    }

    loadAndAddMovieToDB(){
        var that = this;
        SQLite.openDatabase({name : database_name, createFromLocation : "~/db/andrew.db"}).then((DB) => {
            db = DB;
            that.AddMovieToMyList(DB);

        }).catch((error) => {
            console.log(error);
        });
    }

    AddMovieToMyList(db){
        db.transaction(that.AddToBD).then(() =>{
            that.closeDatabase();
        });
    }

    AddToBD(tx) {
        var that = this;
        tx.executeSql('INSERT INTO MyList (movie_name, youtube_id) VALUES ("Teaser Trailer: Pirates of the Caribbean: Dead Men Tell No Tales", "1xo3af_6_Jk");');
        console.log("insertion dans les fav faite!");
    }

    render() {
        return (
            <View style={styles.statusBarBackground}>

            </View>
        )
    }
}

const styles = StyleSheet.create({

statusBarBackground: {
  height: 20,
  backgroundColor: "white"
}

})

module.exports = AddMovieComponent
