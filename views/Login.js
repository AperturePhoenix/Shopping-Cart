import React, { Component } from 'react'
import { View, KeyboardAvoidingView, Alert, Image, Text } from 'react-native'
import { Button, Input } from 'react-native-elements'
import FirebaseAPI from '../store/FirebaseAPI'
import { MainContainerStyle, LoginStyle } from '../store/Styler'

export default class Login extends Component {

    constructor(props) {
        super(props)

        this.state = {
            email: '', emailError: '',
            password: '', passwordError: ''
        }
    }

    componentDidMount() {
        this.authUnsubcriber = FirebaseAPI.isLoggedIn( user => {
            if (user) {
                this.props.navigation.navigate('App')
            }
        })
    }

    componentWillUnmount() {
        this.authUnsubcriber()
    }

    validateInformation = () => {
        isValid = true

        if (!this.state.email) {
            this.setState({
                emailError: 'Please enter an email'
            })
        } else {
            const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
            if (reg.test(this.state.email) === true){
                this.setState({
                    emailError: ''
                })
            } else {
                this.setState({
                    emailError: 'Please enter a valid email'
                })
                isValid = false
            }
        }

        if (!this.state.password) {
            this.setState({
                passwordError: 'Please enter a password'
            })
            isValid = false
        } else { 
            this.setState({
                passwordError: ''
            })
        }

        return isValid
    }

    logIn = () => {
        if (this.validateInformation()) {
            FirebaseAPI.login(this.state.email, this.state.password)
                .catch(error => {
                    console.log('Login.js: ' + error.code + ' -- ' + error.message)
                    switch (error.code) {
                        case 'auth/invalid-email':
                        case 'auth/user-not-found':
                        case 'auth/wrong-password':
                            Alert.alert(message='Incorrect email and/or password')
                            break
                        case 'auth/user-disabled':
                            Alert.alert(message='User account is disabled')
                            break
                        
                    }
                })
        }
    }

    render() {
        return(
            <View style={MainContainerStyle}>
                <KeyboardAvoidingView style={LoginStyle.ChildContainer} behavior='padding' enabled>
                    <Image source={require('../assets/Starfruit.png')} style={{width: 200, height: 200, marginBottom: 10 }} />
                    <Text style={LoginStyle.Header} >Shopping Cart</Text>
                    <Input placeholder='Email' onChangeText={ email => this.setState({ email: email })} errorStyle={LoginStyle.Error} errorMessage={this.state.emailError} />
                    <Input placeholder='Password' onChangeText={ password => this.setState({ password: password })} secureTextEntry={true} errorStyle={LoginStyle.Error} errorMessage={this.state.passwordError} />
                    <Button title='Sign In' titleStyle={LoginStyle.Button.Title} type={LoginStyle.Button.Type} onPress={ () => this.logIn() } />
                    <Button title='Register' titleStyle={LoginStyle.Button.Title} type={LoginStyle.Button.Type} onPress={ () => this.props.navigation.navigate('Register') } />
                </KeyboardAvoidingView>
            </View>
        )
    }
}