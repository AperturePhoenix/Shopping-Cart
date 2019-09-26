import React, { Component } from 'react'
import { Animated, View, FlatList, Text, Alert } from 'react-native'
import { Header, Button, Input } from 'react-native-elements'
import FirebaseAPI from '../store/FirebaseAPI'
import { MainContainerStyle, DropDownStyle, FlatListStyle, HeaderStyle } from '../store/Styler'

export default class GroupView extends Component {
    static navigationOptions = {
        title: 'Groups'
    }

    constructor(props) {
        super(props)

        this.username = FirebaseAPI.username
        FirebaseAPI.getGroupList(this.username)
            .then(groups => { this.setState({groups: groups})})
            .catch(error => { console.log(error) })
        this.state = {
            groups: [],
            groupName: '', groupNameError: '',
            username: '', usernameError: '',
        }
    }

    validateInformation = () => {
        isValid = true
        //insert logic
        return isValid
    }

    createGroup = () => {
        if (this.validateInformation) {
            FirebaseAPI.groupExists(this.username, this.state.groupName)
            .then(groupExists => {
                if (!groupExists) {
                    FirebaseAPI.usernameExists(this.state.username)
                        .then(usernameExists => {
                            if (usernameExists) {
                                FirebaseAPI.addUserToGroup(this.username, this.state.groupName, this.state.username)
                                    .then(usernames => {
                                        groupJoiner = this.state.groups
                                        groupJoiner.push({name: this.state.groupName, usernames: usernames})
                                        this.setState({
                                            groups: [...groupJoiner]
                                        })
                                    })
                            } else {
                                Alert.alert( message='Username does not exist' )
                            }
                        })
                } else {
                    Alert.alert( message='Group already exists' )
                }
            })
            .catch(error => { console.log(error) })
        }
    }

    setGroupViewLayout = (event) => {
        let { height } = event.nativeEvent.layout
    }

    toggleAddGroup = () => {

    }

    toggleDrawer = () => {
        this.props.navigation.toggleDrawer();
    }

    render() {
        return(
            <View style={MainContainerStyle} >
                <Header
                    placement='left'
                    leftComponent={<Button icon={HeaderStyle.Menu.Icon} type={HeaderStyle.Menu.Type} onPress={() => this.toggleDrawer()} />}
                    centerComponent={{ text: 'Groups', style: HeaderStyle.Text }}
                    rightComponent={<Button icon={this.groupViewIcon} type='clear' onPress={() => this.toggleAddGroup()} />}
                    backgroundColor={HeaderStyle.BackgroundColor}
                />

                <Input placeholder='Group name' onChangeText={groupName => this.setState({ groupName: groupName })} />
                <Input placeholder='Add User' onChangeText={username => this.setState({ username: username })} />
                <Button title='Add User' onPress={() => this.createGroup()} />

                <FlatList
                    data={ this.state.groups }
                    renderItem={ ({ item }) => (
                        <Text>{item.name}: {item.usernames}</Text> 
                    )}
                    keyExtractor={ (index) => index.toString() }
                />
            </View>
        )
    }
}