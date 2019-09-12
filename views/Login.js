import React, { Component } from 'react'
import { View, Text } from 'react-native'
import { Button } from 'react-native-elements'

class Login extends Component {
    static navigationOptions = {
        title: 'Please Log In'
    }
    render() {
        return(
            <View>
                <Text>This is the Login Screen</Text>
                <Button title='Go to My Shopping List' onPress={ () => this.props.navigation.navigate('Home')} />
            </View>
        )
    }
}

export default Login