import React, { Component } from 'react'
import { View, KeyboardAvoidingView, Alert, Image, Text } from 'react-native'
import { Button, Input } from 'react-native-elements'
import FirebaseAPI from '../store/FirebaseAPI'
import { MainContainerStyle, ChildContainerStyle, TextHeaderStyle, ButtonTextStyle, ErrorStyle } from '../store/Styler'

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
            FirebaseAPI.login(this.state.username, this.state.password)
                .then(success => {
                    if (success) {
                        this.props.navigation.navigate('App')
                    } else {
                        Alert.alert( message='Invalid username or password' )
                    }
                })
                .catch(error => { console.log(error) })
        }
    }

    render() {
        return(
            <View style={MainContainerStyle}>
                <KeyboardAvoidingView style={ChildContainerStyle} behavior='padding' enabled>
                    <Image source={require('../assets/Starfruit.png')} style={{width: 200, height: 200, marginBottom: 10 }} />
                    <Text style={ TextHeaderStyle } >Shopping Cart</Text>
                    <Input placeholder='Username' onChangeText={ username => this.setState({ username: username })} errorStyle={ErrorStyle} errorMessage={this.state.usernameError} />
                    <Input placeholder='Password' onChangeText={ password => this.setState({ password: password })} secureTextEntry={true} errorStyle={ErrorStyle} errorMessage={this.state.passwordError} />
                    <Button title='Sign In' type='clear' titleStyle={ButtonTextStyle} onPress={ () => this.logIn() } />
                    <Button title='Register' type='clear' titleStyle={ButtonTextStyle} onPress={ () => this.props.navigation.navigate('Register') } />
                </KeyboardAvoidingView>
            </View>
        )
    }
}