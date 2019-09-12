import React, { Component } from 'react'
import { View, Text } from 'react-native'

class MyShoppingList extends Component {
    static navigationOptions = {
        title: 'My Shopping List'
    }
    render() {
        return (
            <View>
                <Text>This is My Shopping List</Text>
            </View>
        )
    }
}

export default MyShoppingList