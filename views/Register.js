import React, { Component } from 'react'
import { View, KeyboardAvoidingView, AsyncStorage, Alert } from 'react-native'
import { Button, Input } from 'react-native-elements'
import FirebaseAPI from './../store/FirebaseAPI'
import base64 from 'react-native-base64'
import { MainContainerStyle, ChildContainerStyle, ButtonTextStyle } from './../store/Styler'

export default class Register extends Component {
    static navigationOptions = {
        header: null
    }

    constructor(props) {
        super(props)

        this.state = {
            username: '', usernameError: '',
            name: '', nameError: '',
            password: '', passwordError: ''
        }


    }

    registerAccount = () => {
        if (this.validateInformation()) {
            FirebaseAPI.usernameExists(this.state.username, (exists) => {
                if (!exists) {
                    this._setLoginData()
                    this.props.navigation.navigate('App')
                } else {
                    Alert.alert(title='Error', message='username is already taken')
                }
            })
        }
    }

    _setLoginData = async() => {
        await AsyncStorage.setItem('username', this.state.username)
        FirebaseAPI.setFields(this.state.username, {
            name: this.state.name,
            password: base64.encode(this.state.password)
        })
        await AsyncStorage.setItem('name', this.state.name)
        await AsyncStorage.setItem('password', base64.encode(this.state.password))
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
        if (!this.state.name) {
            this.setState({
                nameError: 'Please enter a name'
            })
            isValid = false
        } else { this.setState({
            nameError: ''
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

    render() {
        return(
            <View style={MainContainerStyle}>
            <KeyboardAvoidingView style={ChildContainerStyle} behavior='padding' enabled>
                <Input placeholder='Name' onChangeText={ name => this.setState({ name: name })} errorStyle={{ color: 'red' }} errorMessage={this.state.nameError} />
                <Input placeholder='Username' onChangeText={ username => {this.setState({ username: username })}} errorStyle={{ color: 'red' }} errorMessage={this.state.usernameError} />
                <Input placeholder='Password' onChangeText={ password => this.setState({ password: password })} secureTextEntry={true} errorStyle={{ color: 'red' }} errorMessage={this.state.passwordError}/>
                <Button title='Register' type='clear' titleStyle={ButtonTextStyle} onPress={ () => this.registerAccount() } />
                <Button title='Back' type='clear' titleStyle={ButtonTextStyle} onPress={ () => this.props.navigation.goBack() } />
            </KeyboardAvoidingView>
            </View>
        )
    }
}