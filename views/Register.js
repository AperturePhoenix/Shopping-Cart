import React, { Component } from 'react'
import { View, KeyboardAvoidingView, Alert } from 'react-native'
import { Button, Input } from 'react-native-elements'
import FirebaseAPI from '../store/FirebaseAPI'
import { MainContainerStyle, ChildContainerStyle, ButtonTextStyle, ErrorStyle } from '../store/Styler'

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
            FirebaseAPI.register(this.state.name, this.state.username, this.state.password)
                .then(success => {
                    if (success) {
                        this.props.navigation.navigate('App')
                    } else {
                        Alert.alert(title='Error', message='username is already taken')
                    }
                })
                .catch(error => {
                    console.log(error)
                })
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
                <Input placeholder='First Name' onChangeText={ name => this.setState({ name: name })} errorStyle={ErrorStyle} errorMessage={this.state.nameError} />
                <Input placeholder='Username' onChangeText={ username => {this.setState({ username: username })}} errorStyle={ErrorStyle} errorMessage={this.state.usernameError} />
                <Input placeholder='Password' onChangeText={ password => this.setState({ password: password })} secureTextEntry={true} errorStyle={ErrorStyle} errorMessage={this.state.passwordError}/>
                <Button title='Register' type='clear' titleStyle={ButtonTextStyle} onPress={ () => this.registerAccount() } />
                <Button title='Back' type='clear' titleStyle={ButtonTextStyle} onPress={ () => this.props.navigation.goBack() } />
            </KeyboardAvoidingView>
            </View>
        )
    }
}