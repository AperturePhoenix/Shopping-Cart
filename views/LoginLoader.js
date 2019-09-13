import React, { Component } from 'react'
import { View, Text, AsyncStorage } from 'react-native'

class LoginLoader extends Component {
    componentDidMount() {
        this._bootstrapAsync()
    }

    // Fetch the token from storage then navigate to our appropriate place
    _bootstrapAsync = async() => {
        const username = await AsyncStorage.getItem('username')

        //If user is already logged in go to app else go to login screen
        this.props.navigation.navigate(username ? 'App' : 'Auth');
    }

    render() {
        return(
            //TODO: Loading image
            <View>
                <Text>This is the LoginLoader</Text>
            </View>
        )
    }
}

export default LoginLoader