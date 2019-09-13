import React, { Component } from 'react'
import { View, Text, AsyncStorage } from 'react-native'
import { Button } from 'react-native-elements'

class MyShoppingList extends Component {
    static navigationOptions = {
        title: 'My Shopping List'
    }

    render() {
        return (
            <View>
                <Text>This is My Shopping List</Text>
                <Button title='Reset Data' onPress={ AsyncStorage.clear } />
            </View>
        )
    }

    _reset = () => {
        this._clearData()
        this.props.navigation.navigate('App')
    }

    _clearData = async() => {
        await AsyncStorage.clear()
    }
}

export default MyShoppingList