import React, { Component } from 'react'
import { Animated, View, Keyboard, FlatList, Text, Alert, TouchableOpacity } from 'react-native'
import { Header, Button, Input } from 'react-native-elements'
import { createStackNavigator} from 'react-navigation-stack'
import FirebaseAPI from '../store/FirebaseAPI'
import { MainContainerStyle, DropDownStyle, FlatListStyle, HeaderStyle } from '../store/Styler'
import GroupItems from './GroupItems'
import GroupUsers from './GroupUsers'

export class GroupView extends Component {
    static navigationOptions = {
        title: 'Groups',
    }

    constructor(props) {
        super(props)

        FirebaseAPI.getGroupList()
            .then(groups => {
                groups.sort((a, b) => a.groupName < b.groupName ? -1 : 1)
                this.setState({groups: groups})
            })
            .catch(error => { console.log(error) })
        this.state = {
            groups: [],
            groupName: '', groupNameError: '',
            groupViewIsOpen: false, groupViewOffsetY: new Animated.Value(-500), listViewOffsetY: new Animated.Value(-500),
            groupViewIcon: HeaderStyle.Add.Icon
        }
    }

    validateInformation = () => {
        isValid = true
        if (!this.state.groupName) {
            this.setState({ groupNameError: 'Please enter a name' })
            isValid = false
        } else {
            this.setState({ groupNameError: '' })
        }

        return isValid
    }

    createGroup = () => {
        if (this.validateInformation()) {
            FirebaseAPI.groupExists(this.state.groupName)
            .then(groupExists => {
                if (!groupExists) {
                    FirebaseAPI.createGroup(this.state.groupName)
                        .then(group => {
                            groupJoiner = [...this.state.groups]
                            groupJoiner.push(group)
                            groupJoiner.sort((a, b) => a.groupName < b.groupName ? -1 : 1)
                            this.setState({ groups: groupJoiner })
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

    loadGroup = (group) => {
        this.props.navigation.navigate('GroupItems', {
            gid: group.gid,
            groupName: group.groupName,
            uids: group.uids
        })
    }

    removeGroup = (group) => {
        Alert.alert( message='Are you sure?' )
    }

    toggleAddGroup = () => {
        if (this.state.groupViewIsOpen) {
            Keyboard.dismiss()
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
                        <Button title='Create Group' titleStyle={DropDownStyle.Button.Title} type={DropDownStyle.Button.Type} onPress={() => this.createGroup()} />
                    </View>
                </Animated.View>

                <Animated.View style={{ transform: [{translateY: this.state.listViewOffsetY}] }} >
                    <FlatList
                        data={ this.state.groups }
                        ItemSeparatorComponent={ () => (
                                <View style={FlatListStyle.Separator} />
                            )}
                        renderItem={ ({ item }) => (
                            <TouchableOpacity style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', margin: 10 }} onPress={ this.loadGroup.bind(this, item) } >
                                <Text style={FlatListStyle.Text}>{item.groupName}</Text>
                            </TouchableOpacity>
                        )}
                        keyExtractor={ (index) => index.gid }
                    />
                </Animated.View>
            </View>
        )
    }
}

export default createStackNavigator({ 
    Groups: GroupView, 
    GroupItems: GroupItems,
    GroupUsers: GroupUsers
    }, {
    initialRouteName: 'Groups',
    defaultNavigationOptions: {
        header: null
    }
})