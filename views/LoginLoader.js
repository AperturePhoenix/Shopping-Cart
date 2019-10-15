import React, { Component } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import { SplashScreen } from 'expo';
import FirebaseAPI from '../store/FirebaseAPI';
import { MainContainerStyle, LoginStyle } from '../store/Styler';

export default class LoginLoader extends Component {
  componentWillMount() {
    FirebaseAPI.initializeApp();
  }

  componentDidMount() {
    SplashScreen.preventAutoHide();
    this.authUnsubscriber = FirebaseAPI.isLoggedIn(user => {
      const { navigation } = this.props;
      navigation.navigate(user ? 'App' : 'Auth');
      SplashScreen.hide();
    });
  }

  componentWillUnmount() {
    this.authUnsubscriber();
  }

  render() {
    return (
      <View style={MainContainerStyle}>
        <View style={LoginStyle.ChildContainer} />
      </View>
    );
  }
}

LoginLoader.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
