import React, { Component } from 'react';
import { View, KeyboardAvoidingView, Alert, Image, Text } from 'react-native';
import { Button, Input } from 'react-native-elements';
import PropTypes from 'prop-types';
import FirebaseAPI from '../store/FirebaseAPI';
import { MainContainerStyle, LoginStyle } from '../store/Styler';

const image = require('../assets/Starfruit.png');

export default class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      emailError: '',
      password: '',
      passwordError: '',
    };
  }

  validateInformation = () => {
    let isValid = true;
    const { email, password } = this.state;

    if (!email) {
      this.setState({
        emailError: 'Please enter an email',
      });
    } else {
      const reg = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
      if (reg.test(email) === true) {
        this.setState({
          emailError: '',
        });
      } else {
        this.setState({
          emailError: 'Please enter a valid email',
        });
        isValid = false;
      }
    }

    if (!password) {
      this.setState({
        passwordError: 'Please enter a password',
      });
      isValid = false;
    } else {
      this.setState({
        passwordError: '',
      });
    }

    return isValid;
  };

  logIn = () => {
    if (this.validateInformation()) {
      const { email, password } = this.state;
      FirebaseAPI.login(email, password)
        .then(() => {
          const { navigation } = this.props;
          navigation.navigate('App');
        })
        .catch(error => {
          console.log(`Login.js: ${error.code} -- ${error.message}`);
          switch (error.code) {
            case 'auth/invalid-email':
            case 'auth/user-not-found':
            case 'auth/wrong-password':
              Alert.alert('', 'Incorrect email and/or password');
              break;
            case 'auth/user-disabled':
              Alert.alert('', 'User account is disabled');
              break;
            default:
              break;
          }
        });
    }
  };

  render() {
    const { emailError, passwordError } = this.state;
    const { navigation } = this.props;
    return (
      <View style={MainContainerStyle}>
        <KeyboardAvoidingView style={LoginStyle.ChildContainer} behavior="padding" enabled>
          <Image source={image} style={{ width: 200, height: 200, marginBottom: 10 }} />
          <Text style={LoginStyle.Header}>Shopping Cart</Text>
          <Input
            placeholder="Email"
            onChangeText={email => this.setState({ email })}
            errorStyle={LoginStyle.Error}
            errorMessage={emailError}
          />
          <Input
            placeholder="Password"
            onChangeText={password => this.setState({ password })}
            secureTextEntry
            errorStyle={LoginStyle.Error}
            errorMessage={passwordError}
          />
          <Button
            title="Sign In"
            titleStyle={LoginStyle.Button.Title}
            type={LoginStyle.Button.Type}
            onPress={() => this.logIn()}
          />
          <Button
            title="Register"
            titleStyle={LoginStyle.Button.Title}
            type={LoginStyle.Button.Type}
            onPress={() => navigation.navigate('Register')}
          />
        </KeyboardAvoidingView>
      </View>
    );
  }
}

Login.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
