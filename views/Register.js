import React, { Component } from 'react'
import { View, AsyncStorage, Alert } from 'react-native'
import { Button, Input } from 'react-native-elements'
import firebase from 'firebase'
import base64 from 'react-native-base64'

class Register extends Component {
    static navigationOptions = {
        title: 'Register an Account'
    }

    constructor(props) {
        super(props)

        this.db = firebase.firestore().collection('users')
        this.state = {
            username: '', usernameError: '',
            name: '', nameError: '',
            password: '', passwordError: ''
        }


    }

    registerAccount = () => {
        if (this.validateInformation()) {
            this.db.doc(this.state.username).get()
                .then(user => {
                    if (!user.exists) {
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
        this.db.doc(this.state.username).set({
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
            <View>
                <Input placeholder='Username' onChangeText={ username => {this.setState({ username: username })}} errorStyle={{ color: 'red' }} errorMessage={this.state.usernameError} />
                <Input placeholder='Name' onChangeText={ name => this.setState({ name: name })} errorStyle={{ color: 'red' }} errorMessage={this.state.nameError} />
                <Input placeholder='Password' onChangeText={ password => this.setState({ password: password })} secureTextEntry={true} errorStyle={{ color: 'red' }} errorMessage={this.state.passwordError}/>
                <Button title='Register' onPress={ () => this.registerAccount() } />
            </View>
        )
    }
}

export default Register