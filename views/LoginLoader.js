import React, { Component } from 'react'
import { View, Image, AsyncStorage } from 'react-native'
import FirebaseAPI from './../store/FirebaseAPI'
import { MainContainerStyle, ChildContainerStyle } from './../store/Styler'

export default class LoginLoader extends Component {
    componentWillMount() {
        FirebaseAPI.initializeApp()
    }

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
            <View style={MainContainerStyle}>
                <View style={ChildContainerStyle}>
                    <Image source={require('../assets/Starfruit.png')} style={{width: 200, height: 200 }} />
                </View>
            </View>
        )
    }
}