import React, { Component } from  'react'
import { Animated, Keyboard, View, FlatList, TouchableOpacity, Text, Alert } from 'react-native'
import { Header, Button, Input } from 'react-native-elements'
import { MainContainerStyle, HeaderStyle, FlatListStyle, DropDownStyle } from '../store/Styler'
import FirebaseAPI from '../store/FirebaseAPI'

export default class GroupUsers extends Component {
    constructor(props) {
        super(props)

        this.gid = this.props.navigation.getParam('gid', '')
        this.uids = this.props.navigation.getParam('uids', '')
        this.state = {
            users: [],
            email: '', emailError: '',
            userViewIsOpen: false, userViewOffsetY: new Animated.Value(-500), listViewOffsetY: new Animated.Value(-500),
            userViewIcon: HeaderStyle.Add.Icon
        }

        FirebaseAPI.getUserListInfo(this.uids)
            .then(users => {
                users.sort((a, b) => a.name < b.name ? -1 : 1)
                this.setState({
                    users: users
                })
            })
            .catch(error => console.log(error))
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
                        leftComponent={<Button icon={HeaderStyle.Back.Icon} type={HeaderStyle.Back.Type} onPress={() => this.props.navigation.goBack() } />}
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