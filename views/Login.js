import React, { Component } from 'react'
import { View, AsyncStorage } from 'react-native'
import { Button, Input } from 'react-native-elements'
import base64 from 'react-native-base64'

class Login extends Component {
    static navigationOptions = {
        title: 'Please Sign In'
    }

    constructor(props) {
        super(props)

        this.state = {
            username: '',
            password: ''
        }
    }

    render() {
        return(
            <View>
                <Input placeholder='Username' onChangeText={ username => this.setState({ username: username })} />
                <Input placeholder='Password' onChangeText={ password => this.setState({ password: password })} secureTextEntry={true} />
                <Button title='Sign In' onPress={ this._logIn } />
                <Button title='Register' onPress={ () => this.props.navigation.navigate('Register') } />
            </View>
        )
    }

    _logIn = () => {
        this._setLoginData()
        this.props.navigation.navigate('App')
    }

    _setLoginData = async() => {
        await AsyncStorage.setItem('username', this.state.username)
        await AsyncStorage.setItem('password', base64.encode(this.state.password))
    }

    //TODO: Log out
    // _signOutAsync = async () => {
    //     await AsyncStorage.clear();
    //     this.props.navigation.navigate('Auth');
    //   };
}

export default Login