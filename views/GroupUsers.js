import React, { Component } from  'react'
import { Animated, Keyboard, View, FlatList, TouchableOpacity, Text, Alert } from 'react-native'
import { Header, Button, Input } from 'react-native-elements'
import { MainContainerStyle, HeaderStyle, FlatListStyle, DropDownStyle } from '../store/Styler'
import FirebaseAPI from '../store/FirebaseAPI'

export default class GroupUsers extends Component {
    constructor(props) {
        super(props)

        this.gid = this.props.navigation.getParam('gid', '')
        this.users = this.props.navigation.getParam('users', [])
        this.state = {
            users: [],
            email: '', emailError: '',
            userViewIsOpen: false, userViewOffsetY: new Animated.Value(-500), listViewOffsetY: new Animated.Value(-500),
            userViewIcon: HeaderStyle.Add.Icon
        }

        uids = this.users.map((value) => { return value.uid })
        FirebaseAPI.getUserListInfo(uids)
            .then(users => {
                users.sort((a, b) => a.name < b.name ? -1 : 1)
                this.users = users
                this.setState({
                    users: users
                })
            })
            .catch(error => console.log(error))
    }

    goBack = () => {
        this.props.navigation.state.params.callback(this.users)
        this.props.navigation.goBack()
    }

    validateInformation = () => {
        isValid = true

        if (!this.state.email) {
            this.setState({
                emailError: 'Please enter an email'
            })
        } else {
            const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
            if (reg.test(this.state.email) === true){
                this.setState({
                    emailError: ''
                })
            } else {
                this.setState({
                    emailError: 'Please enter a valid email'
                })
                isValid = false
            }
        }

        return isValid
    }

    addUser = () => {
        if (this.validateInformation()) {
            FirebaseAPI.getUser(this.state.email.toLowerCase())
                .then(user => {
                    if (user) {
                        uids = this.users.map((value) => {return value.uid})
                        if (!uids.includes(user.uid)) {
                            FirebaseAPI.addUserToGroup(this.gid, user.uid)
                                .catch(error => console.log(error))
                            
                            this.users.push(user)
                            this.users.sort((a, b) => a.name < b.name ? -1 : 1)
                            this.setState({users: this.users})
                        }
                        else {
                            Alert.alert(message='User is already in the group')
                        }
                    }
                    else {
                        Alert.alert(message='Email invalid or user does not exist')
                    }
                })
                .catch(error => console.log(error)) 
        }
    }

    setUserViewLayout = (event) => {
        let { height } = event.nativeEvent.layout
        this.setState({
            userViewHeight: height
        })
        if (this.state.userViewIsOpen) {
            this.state.userViewOffsetY.setValue(0)
            this.state.listViewOffsetY.setValue(0)
        } else {
            this.state.userViewOffsetY.setValue(-(height + 55))
            this.state.listViewOffsetY.setValue(-height)
        }
    }

    toggleAddUser() {
        if (this.state.userViewIsOpen) {
            Keyboard.dismiss()
            Animated.parallel([
                Animated.timing(
                    this.state.userViewOffsetY,
                    { toValue: -(this.state.userViewHeight + 55) }
                ),
                Animated.timing(
                    this.state.listViewOffsetY,
                    { toValue: -(this.state.userViewHeight) }
                )
            ]).start()
            
            this.setState({
                userViewIcon: HeaderStyle.Add.Icon
            })
        } else {
            Animated.parallel([
                Animated.timing(
                    this.state.userViewOffsetY,
                    { toValue: 0 }
                ),
                Animated.timing(
                    this.state.listViewOffsetY,
                    { toValue: 0 }
                )
            ]).start()
            
            this.setState({
                userViewIcon: HeaderStyle.Remove.Icon
            })
        }
        this.setState({ userViewIsOpen: !this.state.userViewIsOpen })
    }

    render() {
        return(
            <View style={MainContainerStyle} >
                <View style={HeaderStyle.ZPosition} >
                    <Header
                        placement='left'
                        leftComponent={<Button icon={HeaderStyle.Back.Icon} type={HeaderStyle.Back.Type} onPress={() => this.goBack() } />}
                        centerComponent={{ text: 'Users', style: HeaderStyle.Text }}
                        rightComponent={<Button icon={this.state.userViewIcon} type='clear' onPress={() => this.toggleAddUser() } />}
                        backgroundColor={HeaderStyle.BackgroundColor}
                    />
                </View>

                <Animated.View style={{ backgroundColor: DropDownStyle.BackgroundColor, transform: [{translateY: this.state.userViewOffsetY}] }} >
                    <View pointerEvents={!this.state.userViewIsOpen ? 'none' : 'auto'} onLayout={ event => this.setUserViewLayout(event) } >
                        <Input placeholder='Email' inputStyle={DropDownStyle.InputText} inputContainerStyle={DropDownStyle.InputContainer} placeholderTextColor={DropDownStyle.PlaceHolderColor} onChangeText={ email => this.setState({ email: email})} errorStyle={DropDownStyle.Error} errorMessage={this.state.emailError} />
                        <Button title='Add' titleStyle={DropDownStyle.Button.Title} type={DropDownStyle.Button.Type} onPress={ () => this.addUser() } />
                    </View>
                </Animated.View>

                <Animated.View style={{ transform: [{translateY: this.state.listViewOffsetY}] }} >
                    <FlatList 
                        data={ this.state.users }
                        ItemSeparatorComponent={ () => (
                            <View style={FlatListStyle.Separator} />
                        )}
                        renderItem={ ({ item }) => (
                            <TouchableOpacity style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', margin: 10 }} >
                                <Text style={FlatListStyle.Text}>{item.name}</Text> 
                                <Text style={FlatListStyle.Subtle}>{item.email}</Text>
                            </TouchableOpacity>
                        )}
                        keyExtractor={ (index) => index.uid }
                    />
                </Animated.View>
            </View>
        )
    }
}