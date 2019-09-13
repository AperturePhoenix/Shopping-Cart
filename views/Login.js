import React, { Component } from 'react'
import { View, AsyncStorage, Alert } from 'react-native'
import { Button, Input } from 'react-native-elements'
import firebase from 'firebase'
import base64 from 'react-native-base64'

class Login extends Component {
    static navigationOptions = {
        title: 'Please Sign In'
    }

    constructor(props) {
        super(props)

        this.db = firebase.firestore().collection('users')
        this.state = {
            username: '', usernameError: '',
            password: '', passwordError: ''
        }
    }

    render() {
        return(
            <View>
                <Input placeholder='Username' onChangeText={ username => this.setState({ username: username })} errorStyle={{ color: 'red' }} errorMessage={this.state.usernameError} />
                <Input placeholder='Password' onChangeText={ password => this.setState({ password: password })} secureTextEntry={true} errorStyle={{ color: 'red' }} errorMessage={this.state.passwordError} />
                <Button title='Sign In' onPress={ this.logIn } />
                <Button title='Register' onPress={ () => this.props.navigation.navigate('Register') } />
            </View>
        )
    }

    validateInformation = () => {
        isValid = true
        if (!this.state.username) {
            this.setState({
                usernameError: 'Please enter a username'
            })
            isValid = false
        } else { this.setState({
            usernameError: ''
        })}
        if (!this.state.password) {
            this.setState({
                passwordError: 'Please enter a password'
            })
            isValid = false
        } else { this.setState({
            passwordError: ''
        })}

        return isValid
    }

    logIn = () => {
        if (this.validateInformation()) {
            this.db.doc(this.state.username).get()
                .then(user => {
                    if (user.exists && user.get('password') == base64.encode(this.state.password)) {
                        this._setLoginData()
                        this.props.navigation.navigate('App')
                    } else {
                        Alert.alert( message='Invalid username or password' )
                    }
                })
        }
    }

    _setLoginData = async() => {
        await AsyncStorage.setItem('username', this.state.username)
        await AsyncStorage.setItem('name', this.db.doc(this.state.username).get('name'))
        await AsyncStorage.setItem('password', base64.encode(this.state.password))
    }
}

export default Login