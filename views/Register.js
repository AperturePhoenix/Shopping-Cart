import React, { Component } from 'react';
import { View, KeyboardAvoidingView, Alert } from 'react-native';
import { Button, Input } from 'react-native-elements';
import PropTypes from 'prop-types';
import FirebaseAPI from '../store/FirebaseAPI';
import { MainContainerStyle, LoginStyle } from '../store/Styler';

export default class Register extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      nameError: '',
      email: '',
      emailError: '',
      password: '',
      passwordError: '',
      passwordConfirm: '',
    };
  }

  registerAccount = () => {
    if (this.validateInformation()) {
      const { name, email, password } = this.state;
      FirebaseAPI.register(name, email, password)
        .then(() => {
          const { navigation } = this.props;
          navigation.navigate('App');
        })
        .catch(error => {
          console.log(`Register.js: ${error.code} -- ${error.message}`);

          switch (error.code) {
            case 'auth/email-already-in-use':
              Alert.alert('', 'Email is already taken');
              break;
            case 'auth/invalid-email':
              Alert.alert('', 'Invalid email');
              break;
            case 'auth/operation-not-allowed':
              Alert.alert(
                '',
                'Email authorization not enabled. Please email support to enable feature'
              );
              break;
            case 'auth/weak-password':
              Alert.alert('Weak Password', 'Please enter a stronger password');
              break;
            default:
              break;
          }
        });
    }
  };

  validateInformation = () => {
    let isValid = true;

    const { name, email, password, passwordConfirm } = this.state;

    if (!name) {
      this.setState({
        nameError: 'Please enter a name',
      });
      isValid = false;
    } else {
      this.setState({
        nameError: '',
      });
    }

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
    } else if (password === passwordConfirm) {
      this.setState({
        passwordError: '',
      });
    } else {
      this.setState({
        passwordError: 'Passwords do not match',
      });
      isValid = false;
    }

    return isValid;
  };

  render() {
    const { nameError, emailError, passwordError } = this.state;
    const { navigation } = this.props;
    return (
      <View style={MainContainerStyle}>
        <KeyboardAvoidingView style={LoginStyle.ChildContainer} behavior="padding" enabled>
          <Input
            placeholder="First Name"
            onChangeText={name => this.setState({ name })}
            errorStyle={LoginStyle.Error}
            errorMessage={nameError}
          />
          <Input
            placeholder="Email"
            onChangeText={email => {
              this.setState({ email });
            }}
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
          <Input
            placeholder="Confirm Password"
            onChangeText={password => this.setState({ passwordConfirm: password })}
            secureTextEntry
          />
          <Button
            title="Register"
            titleStyle={LoginStyle.Button.Title}
            type={LoginStyle.Button.Type}
            onPress={() => this.registerAccount()}
          />
          <Button
            title="Back"
            titleStyle={LoginStyle.Button.Title}
            type={LoginStyle.Button.Type}
            onPress={() => navigation.goBack()}
          />
        </KeyboardAvoidingView>
      </View>
    );
  }
}

Register.propTypes = {
  navigation: PropTypes.shape({
    goBack: PropTypes.func.isRequired,
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};
