import React, { Component } from 'react';
import { View, Image } from 'react-native';
import PropTypes from 'prop-types';
import FirebaseAPI from '../store/FirebaseAPI';
import { MainContainerStyle, LoginStyle } from '../store/Styler';

const image = require('../assets/Starfruit.png');

export default class LoginLoader extends Component {
  componentWillMount() {
    FirebaseAPI.initializeApp();
  }

  componentDidMount() {
    this.authUnsubscriber = FirebaseAPI.isLoggedIn(user => {
      const { navigation } = this.props;
      navigation.navigate(user ? 'App' : 'Auth');
    });
  }

  componentWillUnmount() {
    this.authUnsubscriber();
  }

  render() {
    return (
      <View style={MainContainerStyle}>
        <View style={LoginStyle.ChildContainer}>
          <Image source={image} style={{ width: 200, height: 200 }} />
        </View>
      </View>
    );
  }
}

LoginLoader.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
