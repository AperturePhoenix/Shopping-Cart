import React, { Component } from 'react'
import { View, Image } from 'react-native'
import FirebaseAPI from '../store/FirebaseAPI'
import { MainContainerStyle, ChildContainerStyle } from '../store/Styler'

export default class LoginLoader extends Component {
    componentWillMount() {
        FirebaseAPI.initializeApp()
    }

    componentDidMount() {
        this.bootstrap()
    }

    bootstrap = () => {
        FirebaseAPI.loadAsyncStorage()
            .then(success => {
                this.props.navigation.navigate(success ? 'App' : 'Auth')
            })
            .catch(error => { console.log(error) })
    }

    render() {
        return(
            <View style={MainContainerStyle}>
                <View style={ChildContainerStyle}>
                    <Image source={require('../assets/Starfruit.png')} style={{width: 200, height: 200 }} />
                </View>
            </View>
        )
    }
}