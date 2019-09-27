import React, { Component } from 'react'
import { View, Text, FlatList, TouchableOpacity } from 'react-native'
import { Header, Button } from 'react-native-elements'
import { MainContainerStyle, HeaderStyle, FlatListStyle } from '../store/Styler'
import FirebaseAPI from '../store/FirebaseAPI'

export default class GroupList extends Component {
    constructor(props) {
        super(props)

        this.username = FirebaseAPI.username
        this.groupName = this.props.navigation.getParam('groupName', 'Group Usernames')
        FirebaseAPI.getGroupUsernames(this.username, this.groupName)
            .then(usernames => {
                usernames.push(this.username)
                this.setState({ usernames: usernames })
                this.getItems()
            })
            .catch(error => console.log(error))
        this.state = {
            usernames: [],
            items: []
        }
    }

    getItems = async() => {
        let itemJoiner = []
        for (let username of this.state.usernames) {
            itemJoiner.push(...await FirebaseAPI.getItems(username))
        }
        this.setState({ items: [...itemJoiner] })
    }

    render() {
        return (
            <View style={MainContainerStyle}>
                <View style={HeaderStyle.ZPosition} >
                    <Header
                        placement='left'
                        leftComponent={<Button icon={HeaderStyle.Back.Icon} type={HeaderStyle.Back.Type} onPress={() => this.props.navigation.goBack() } />}
                        centerComponent={{ text: this.groupName, style: HeaderStyle.Text }}
                        backgroundColor={HeaderStyle.BackgroundColor}
                    />
                </View>

                <FlatList 
                    data={ this.state.items }
                        ItemSeparatorComponent={ () => (
                                <View style={FlatListStyle.Separator} />
                            )}
                        renderItem={ ({ item }) => (
                            <TouchableOpacity style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', margin: 10 }} >
                                <Text style={FlatListStyle.Text}>{item.name}</Text>
                                <Text style={FlatListStyle.Subtle}>{item.username}</Text>
                            </TouchableOpacity>
                        )}
                        keyExtractor={ (index) => index.toString() }
                />
            </View>
        )
    }
}