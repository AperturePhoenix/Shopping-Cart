import React, { Component } from 'react'
import { View, Text } from 'react-native'
import { Header, Button } from 'react-native-elements'
import { MainContainerStyle, HeaderStyle, LoginStyle } from '../store/Styler'
import FirebaseAPI from '../store/FirebaseAPI'

export default class Profile extends Component {
    constructor(props) {
        super(props)
        this.state = {
            name: FirebaseAPI.userName,
            email: FirebaseAPI.auth.currentUser.email
        }
    }

    toggleDrawer = () => {
        this.props.navigation.toggleDrawer();
    }

    signOut = () => {
        FirebaseAPI.signOut()
            .catch(error => { console.log(error) })
        this.props.navigation.navigate('Auth')
    }

    render() {
        return (
            <View style={MainContainerStyle} >
                <Header
                    placement='left'
                    leftComponent={<Button icon={HeaderStyle.Menu.Icon} type={HeaderStyle.Menu.Type} onPress={() => this.toggleDrawer()} />}
                    centerComponent={{ text: 'My Profile', style: HeaderStyle.Text }}
                    backgroundColor={HeaderStyle.BackgroundColor}
                />

                <View style={LoginStyle.ChildContainer} >
                    <Text>{this.state.name}</Text>
                    <Text>{this.state.email}</Text>
                    <Button title='Sign Out' onPress={() => this.signOut() } />
                </View>
            </View>
        )
    }
}