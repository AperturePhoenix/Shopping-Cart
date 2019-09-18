import React, { Component } from 'react'
import { View, Alert, AsyncStorage } from 'react-native'
import { Header, Button, Icon, Input } from 'react-native-elements'
import { MainContainerStyle, ChildContainerStyle } from '../store/Styler'
import FirebaseAPI from '../store/FirebaseAPI'

export default class GroupView extends Component {
    static navigationOptions = {
        title: 'Groups'
    }

    constructor(props) {
        super(props)

        AsyncStorage.getItem('username')
            .then(username => {
                this.username = username
            })
        this.state = {
            groupName: '', groupNameError: '',
            username: '', usernameError: ''
        }
    }

    createGroup = (groupName) => {
        FirebaseAPI.groupExists(this.username, this.state.groupName, exists => {
            if (!exists) {
                Alert.alert( title=exists )
            }
            
        })
    }

    toggleDrawer = () => {
        this.props.navigation.toggleDrawer();
    }

    render() {
        return(
            <View style={MainContainerStyle} >
                <Header
                    placement='left'
                    leftComponent={<Button icon={<Icon name='menu' color='white' />} type='clear' onPress={() => this.toggleDrawer()} />}
                    centerComponent={{ text: 'Groups', style: { color: '#fff', fontSize: 24 } }}
                    backgroundColor='#ffd602'
                />
                <Input placeholder='Group name' onChangeText={groupName => this.setState({ groupName: groupName })} />
                <Input placeholder='Add User' onChangeText={username => this.setState({ username: username })} />
                <Button title='Add User' onPress={() => this.createGroup()} />
            </View>
        )
    }
}