import React, { Component } from 'react'
import { View, AsyncStorage } from 'react-native'
import { Button, Input} from 'react-native-elements'
import firebase, { database } from 'firebase'
import base64 from 'react-native-base64'

class Register extends Component {
    static navigationOptions = {
        title: 'Register an Account'
    }

    constructor(props) {
        super(props)

        this.db = firebase.firestore().collection('users')
        this.state = {
            username: '',
            name: '',
            password: ''
        }


    }

    _registerAccount = () => {
        this._setLoginData()
        this.props.navigation.navigate('App')
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

    render() {
        return(
            <View>
                <Input placeholder='Username' onChangeText={ username => this.setState({ username: username })} />
                <Input placeholder='Name' onChangeText={ name => this.setState({ name: name })} />
                <Input placeholder='Password' onChangeText={ password => this.setState({ password: password })} secureTextEntry={true} />
                <Button title='Register' onPress={ () => this._registerAccount() } />
            </View>
        )
    }
}

export default Register