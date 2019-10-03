import React, { Component } from  'react'
import { View, FlatList, TouchableOpacity, Text } from 'react-native'
import { Header, Button } from 'react-native-elements'
import { MainContainerStyle, HeaderStyle, FlatListStyle } from '../store/Styler'
import FirebaseAPI from '../store/FirebaseAPI'

export default class GroupUsers extends Component {
    constructor(props) {
        super(props)

        this.gid = this.props.navigation.getParam('gid', '')
        this.uids = this.props.navigation.getParam('uids', '')
        this.state = {
            users: []
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

    render() {
        return(
            <View style={MainContainerStyle} >
                <View style={HeaderStyle.ZPosition} >
                    <Header
                        placement='left'
                        leftComponent={<Button icon={HeaderStyle.Back.Icon} type={HeaderStyle.Back.Type} onPress={() => this.props.navigation.goBack() } />}
                        centerComponent={{ text: 'Users', style: HeaderStyle.Text }}
                        backgroundColor={HeaderStyle.BackgroundColor}
                    />

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
                </View>
            </View>
        )
    }
}