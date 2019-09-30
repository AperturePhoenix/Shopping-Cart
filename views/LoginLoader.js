import React, { Component } from 'react'
import { View, Image } from 'react-native'
import FirebaseAPI from '../store/FirebaseAPI'
import { MainContainerStyle, LoginStyle } from '../store/Styler'

export default class LoginLoader extends Component {
    componentWillMount() {
        FirebaseAPI.initializeApp()
    }

    componentDidMount() {
        this.authUnsubscriber = FirebaseAPI.isLoggedIn( user => {
            this.props.navigation.navigate(user ? 'App' : 'Auth')
        })
    }

    componentWillUnmount() {
        this.authUnsubscriber()
    }

    render() {
        return(
            <View style={MainContainerStyle}>
                <View style={LoginStyle.ChildContainer}>
                    <Image source={require('../assets/Starfruit.png')} style={{width: 200, height: 200 }} />
                </View>
            </View>
        )
    }
}