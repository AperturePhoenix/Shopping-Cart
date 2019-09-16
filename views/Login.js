import React, { Component } from 'react'
import { View, KeyboardAvoidingView, AsyncStorage, Alert, Image, Text } from 'react-native'
import { Button, Input } from 'react-native-elements'
import FirebaseAPI from './../store/FirebaseAPI'
import base64 from 'react-native-base64'
import { MainContainerStyle, ChildContainerStyle, TextHeaderStyle, ButtonTextStyle } from './../store/Styler'

export default class Login extends Component {
    static navigationOptions = {
        header: null
    }

    constructor(props) {
        super(props)

        this.state = {
            username: '', usernameError: '',
            password: '', passwordError: ''
        }
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
            FirebaseAPI.usernameExists(this.state.username, (exists) => {
                if (exists) {
                    FirebaseAPI.login(this.state.username, this.state.password, (success) => {
                        if (success) {
                            this._setLoginData()
                            this.props.navigation.navigate('App')
                        } else {
                            Alert.alert( message='Invalid username or password' )
                        }
                    })
                } else {
                    Alert.alert( message='Invalid username or password' )
                }
            })
        }
    }

    _setLoginData = async() => {
        await AsyncStorage.setItem('username', this.state.username)
        FirebaseAPI.getField(this.state.username, 'name', (name) => {
            AsyncStorage.setItem('name', name)
        })
        await AsyncStorage.setItem('password', base64.encode(this.state.password))
    }

    render() {
        return(
            <View style={MainContainerStyle}>
                <KeyboardAvoidingView style={ChildContainerStyle} behavior='padding' enabled>
                    <Image source={require('../assets/Starfruit.png')} style={{width: 200, height: 200, marginBottom: 10 }} />
                    <Text style={ TextHeaderStyle } >Shopping Cart</Text>
                    <Input placeholder='Username' onChangeText={ username => this.setState({ username: username })} errorStyle={{ color: 'red' }} errorMessage={this.state.usernameError} />
                    <Input placeholder='Password' onChangeText={ password => this.setState({ password: password })} secureTextEntry={true} errorStyle={{ color: 'red' }} errorMessage={this.state.passwordError} />
                    <Button title='Sign In' type='clear' titleStyle={ButtonTextStyle} onPress={ () => this.logIn() } />
                    <Button title='Register' type='clear' titleStyle={ButtonTextStyle} onPress={ () => this.props.navigation.navigate('Register') } />
                </KeyboardAvoidingView>
            </View>
        )
    }
}