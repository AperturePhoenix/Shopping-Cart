import React, { Component } from 'react'
import { View, Text } from 'react-native'
import { MainContainerStyle, ChildContainerStyle } from '../store/Styler'

export default class GroupView extends Component {
    static navigationOptions = {
        title: 'Groups'
    }

    constructor(props) {
        super(props)
    }

    render() {
        return(
            <View style={MainContainerStyle} >
                <View style={ChildContainerStyle} >
                    <Text>This is my Groups</Text>
                </View>
            </View>
        )
    }
}