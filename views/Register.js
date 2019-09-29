import React, { Component } from 'react'
import { View, KeyboardAvoidingView, Alert } from 'react-native'
import { Button, Input } from 'react-native-elements'
import FirebaseAPI from '../store/FirebaseAPI'
import { MainContainerStyle, LoginStyle } from '../store/Styler'

export default class Register extends Component {

    constructor(props) {
        super(props)

        this.state = {
            name: '', nameError: '',
            email: '', emailError: '',
            password: '', passwordError: '',
            passwordConfirm: ''
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

    registerAccount = () => {
        if (this.validateInformation()) {
            FirebaseAPI.register(this.state.name, this.state.email, this.state.password)
                .catch(error => {
                    console.log('Register.js: ' + error.code + ' -- ' + error.message)
                    
                    switch(error.code) {
                        case 'auth/email-already-in-use':
                            Alert.alert(message='Email is already taken')
                            break
                        case 'auth/invalid-email':
                                Alert.alert(message='Invalid email')
                            break
                        case 'auth/operation-not-allowed':
                                Alert.alert(message='Email authorization not enabled. Please email support to enable feature')
                            break
                        case 'auth/weak-password':
                                Alert.alert(title='Weak Password', message='Please enter a stronger password')
                            break
                    }
                })
        }
    }

    validateInformation = () => {
        isValid = true

        if (!this.state.name) {
            this.setState({
                nameError: 'Please enter a name'
            })
            isValid = false
        } else { 
            this.setState({
                nameError: ''
            })
        }

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
            if (this.state.password === this.state.passwordConfirm) {
                this.setState({
                    passwordError: ''
                })
            } else {
                this.setState({
                    passwordError: 'Passwords do not match'
                })
            }
        }

        return isValid
    }

    render() {
        return(
            <View style={MainContainerStyle}>
            <KeyboardAvoidingView style={LoginStyle.ChildContainer} behavior='padding' enabled>
                <Input placeholder='First Name' onChangeText={ name => this.setState({ name: name })} errorStyle={LoginStyle.Error} errorMessage={this.state.nameError} />
                <Input placeholder='Email' onChangeText={ email => {this.setState({ email: email })}} errorStyle={LoginStyle.Error} errorMessage={this.state.emailError} />
                <Input placeholder='Password' onChangeText={ password => this.setState({ password: password })} secureTextEntry={true} errorStyle={LoginStyle.Error} errorMessage={this.state.passwordError}/>
                <Input placeholder='Confirm Password' onChangeText={ password => this.setState({ passwordConfirm: password })} secureTextEntry={true} />
                <Button title='Register' titleStyle={LoginStyle.Button.Title} type={LoginStyle.Button.Type} onPress={ () => this.registerAccount() } />
                <Button title='Back' titleStyle={LoginStyle.Button.Title} type={LoginStyle.Button.Type} onPress={ () => this.props.navigation.goBack() } />
            </KeyboardAvoidingView>
            </View>
        )
    }
}