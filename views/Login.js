import React, { Component } from 'react'
import { View, Text, AsyncStorage } from 'react-native'
import { Button } from 'react-native-elements'

class Login extends Component {
    constructor(props) {
        super(props)

        this.state = {
            username: '',
            password: ''
        }
    }

    static navigationOptions = {
        title: 'Please Sign In'
    }

    render() {
        return(
            <View>
                <Text>This is the Login Screen</Text>
                <Button title='Go to My Shopping List' onPress={ () => this.props.navigation.navigate('Home')} />
            </View>
        )
    }

    _logInAsync = async() => {
        await AsyncStorage.setItem('username', this.state.username)
        this.props.navigate.navigate('App')
    }

    //TODO: Log out
    // _signOutAsync = async () => {
    //     await AsyncStorage.clear();
    //     this.props.navigation.navigate('Auth');
    //   };
}

export default Login