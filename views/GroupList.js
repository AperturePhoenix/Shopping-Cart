import React, { Component } from 'react'
import { View, Text, FlatList, TouchableOpacity } from 'react-native'
import { Header, Button } from 'react-native-elements'
import { MainContainerStyle, HeaderStyle, FlatListStyle } from '../store/Styler'
import FirebaseAPI from '../store/FirebaseAPI'

export default class GroupList extends Component {
    constructor(props) {
        super(props)

        this.gid = this.props.navigation.getParam('gid', '')
        this.groupName = this.props.navigation.getParam('groupName', 'Group Usernames')
        this.uids = this.props.navigation.getParam('uids', '')
        this.state = {
            groupItems: []
        }
        FirebaseAPI.getGroupItems(this.uids)
            .then(groupItems => {
                this.setState({ groupItems: groupItems })
            })
            .catch(error => console.log(error))
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
                    data={ this.state.groupItems }
                        ItemSeparatorComponent={ () => (
                                <View style={FlatListStyle.Separator} />
                            )}
                        renderItem={ ({ item }) => (
                            <TouchableOpacity style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', margin: 10 }} >
                                <Text style={FlatListStyle.Text}>{item.itemName}</Text>
                                <Text style={FlatListStyle.Subtle}>{item.name}</Text>
                            </TouchableOpacity>
                        )}
                        keyExtractor={ (index) => index.iid.toString() }
                />
            </View>
        )
    }
}