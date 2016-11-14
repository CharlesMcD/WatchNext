import React from 'react';
import {Image, StyleSheet} from 'react-native';

import { Icon } from 'react-native-elements'

var btnsDefault = [ { text: 'Button' } ];

var btnsTypes = [
  { text: 'Primary',    type: 'primary',   },
  { text: 'Secondary',  type: 'secondary', },
  { text: 'Delete',     type: 'delete',    }
];

var rows = [
  {
    text: "Buttons de Charleshfdshfjksdfjsdfdsjjkshfdhjfshsddsjkdshfjkshdjkshfjskhjk",
    backgroundColor: '#009933',
    left: [
      {
        text: 'Dislike',
        onPress: function(){ alert('Refusé!') },
        type: 'primary',
      }
    ],
    right: [
      {
        backgroundColor: '#009933',
        component: <Icon name='heart' style={{flex: 1}} type='font-awesome' color='#ad4c4c' /> ,
        onPress: function(){ alert('Ajouté aux favoris!') },
      }
    ],
    autoClose: true
  },
];

module.exports = rows
