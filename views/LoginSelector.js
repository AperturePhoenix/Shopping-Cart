import React, { Component } from 'react'
import { View } from 'react-native'
import { Button } from 'react-native-elements'

export default class LoginSelector extends Component {
    static navigationOptions = {
        header: null
    }

    render() {
        return (
            <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <View>
                    <Button title='Sign In' />
                    <Button title='Register' />
                </View>
            </View>
        )
    }
}