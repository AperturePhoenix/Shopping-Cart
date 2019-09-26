import React, { Component } from 'react'
import { Animated, View, FlatList, Text, Alert, TouchableOpacity } from 'react-native'
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
            groupViewIsOpen: false, groupViewOffsetY: new Animated.Value(-500), listViewOffsetY: new Animated.Value(-500),
            groupViewIcon: HeaderStyle.Add.Icon
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
        this.setState({
            groupViewHeight: height
        })
        if (this.state.groupViewIsOpen) {
            this.state.groupViewOffsetY.setValue(0)
            this.state.listViewOffsetY.setValue(0)
        } else {
            this.state.groupViewOffsetY.setValue(-(height + 55))
            this.state.listViewOffsetY.setValue(-height)
        }
    }

    removeGroup = (group) => {
        Alert.alert( message='Are you sure?' )
    }

    toggleAddGroup = () => {
        if (this.state.groupViewIsOpen) {
            Animated.parallel([
                Animated.timing(
                    this.state.groupViewOffsetY,
                    { toValue: -(this.state.groupViewHeight + 55) }
                ),
                Animated.timing(
                    this.state.listViewOffsetY,
                    { toValue: -(this.state.groupViewHeight) }
                )
            ]).start()
            
            this.setState({
                groupViewIcon: HeaderStyle.Add.Icon
            })
        } else {
            Animated.parallel([
                Animated.timing(
                    this.state.groupViewOffsetY,
                    { toValue: 0 }
                ),
                Animated.timing(
                    this.state.listViewOffsetY,
                    { toValue: 0 }
                )
            ]).start()
            
            this.setState({
                groupViewIcon: HeaderStyle.Remove.Icon
            })
        }
        this.setState({ groupViewIsOpen: !this.state.groupViewIsOpen })
    }

    toggleDrawer = () => {
        this.props.navigation.toggleDrawer();
    }

    render() {
        return(
            <View style={MainContainerStyle} >
                <View style={HeaderStyle.ZPosition} >
                <Header
                        placement='left'
                        leftComponent={<Button icon={HeaderStyle.Menu.Icon} type={HeaderStyle.Menu.Type} onPress={() => this.toggleDrawer()} />}
                        centerComponent={{ text: 'Groups', style: HeaderStyle.Text }}
                        rightComponent={<Button icon={this.state.groupViewIcon} type='clear' onPress={() => this.toggleAddGroup()} />}
                        backgroundColor={HeaderStyle.BackgroundColor}
                    />
                </View>

                <Animated.View style={{ backgroundColor: DropDownStyle.BackgroundColor, transform: [{translateY: this.state.groupViewOffsetY}] }} >
                    <View pointerEvents={!this.state.groupViewIsOpen ? 'none' : 'auto'} onLayout={ event => this.setGroupViewLayout(event) }>
                        <Input placeholder='Group name' inputStyle={DropDownStyle.InputText} inputContainerStyle={DropDownStyle.InputContainer} placeholderTextColor={DropDownStyle.PlaceHolderColor} onChangeText={groupName => this.setState({ groupName: groupName })} errorStyle={DropDownStyle.Error} errorMessage={this.state.groupNameError} />
                        <Input placeholder='Username' inputStyle={DropDownStyle.InputText} inputContainerStyle={DropDownStyle.InputContainer} placeholderTextColor={DropDownStyle.PlaceHolderColor} onChangeText={username => this.setState({ username: username })} errorStyle={DropDownStyle.Error} errorMessage={this.state.usernameError} />
                        <Button title='Add User' titleStyle={DropDownStyle.Button.Title} type={DropDownStyle.Button.Type} onPress={() => this.createGroup()} />
                    </View>
                </Animated.View>

                <Animated.View style={{ transform: [{translateY: this.state.listViewOffsetY}] }} >
                    <FlatList
                        data={ this.state.groups }
                        ItemSeparatorComponent={ () => (
                                <View style={FlatListStyle.Separator} />
                            )}
                        renderItem={ ({ item }) => (
                            <TouchableOpacity style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', margin: 10 }} onPress={ this.removeGroup.bind(this, item.name ) } >
                                <Text style={FlatListStyle.Text}>{item.name}</Text>
                            </TouchableOpacity>
                        )}
                        keyExtractor={ (index) => index.toString() }
                    />
                </Animated.View>
            </View>
        )
    }
}