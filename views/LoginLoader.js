import React, { Component } from 'react'
import { View, Image, AsyncStorage } from 'react-native'
import { MainContainerStyle, ChildContainerStyle } from './../store/Styler'
import firebase from 'firebase'
import '@firebase/firestore';

export default class LoginLoader extends Component {
    componentWillMount() {
        const firebaseConfig = {
            apiKey: "AIzaSyCJLiH1KdAcmdySrvEiydkNxRonH9QCvKg",
            authDomain: "shopping-cart-d8b09.firebaseapp.com",
            databaseURL: "https://shopping-cart-d8b09.firebaseio.com",
            projectId: "shopping-cart-d8b09",
            storageBucket: "shopping-cart-d8b09.appspot.com",
            messagingSenderId: "925913407970",
            appId: "1:925913407970:web:011a4a3e494627b62f19bb"
          }
        firebase.initializeApp(firebaseConfig)
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