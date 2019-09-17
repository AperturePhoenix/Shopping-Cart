import React, { Component } from 'react'
import { View, Text, AsyncStorage, StyleSheet, FlatList, Alert } from 'react-native'
import { Button, Input } from 'react-native-elements'
import FirebaseAPI from './../store/FirebaseAPI'

export default class MyShoppingList extends Component {
    static navigationOptions = {
        title: 'My Shopping List'
    }

    constructor(props) {
        super(props)

        AsyncStorage.getItem('username')
            .then(username => {
                this.username = username
                FirebaseAPI.getItems(this.username, (items) => {
                    this.setState({ items: items})
                })
            })
        this.state = {
            items: [],
            item: '', itemError: '',
            quantity: 0, quantityError: ''
        }
    }

    addItem = () => {
        FirebaseAPI.itemExists(this.username, this.state.item, (exists) => {
            if (!exists) {
                itemJoiner = [...this.state.items]
                itemJoiner.push({ name: this.state.item, quantity: this.state.quantity })
                this.setState({ items: [...itemJoiner] })
                FirebaseAPI.addItem(this.username, this.state.item, this.state.quantity)
            }
            else {
                Alert.alert(message='Item is already in the cart')
            }
        })
     }

     removeItem = (item) => {
        let itemRemover = [...this.state.items]
        let prevIndex = this.state.items.findIndex(itemName => itemName === item);
        itemRemover.splice(prevIndex, 1)
        this.setState({ items: itemRemover })
        FirebaseAPI.removeItem(this.username, item)
     }

    reset = () => {
        this._clearData()
        this.props.navigation.navigate('App')
    }

    _clearData = async() => {
        await AsyncStorage.clear()
    }

    render() {
        return (
            <View style={ styles.MainContainer }>
                <Button title='Reset Data' onPress= { AsyncStorage.clear } />
                <Input placeholder='Item' onChangeText={ item => {this.setState({ item: item})}} errorStyle={{ color: 'red' }} errorMessage={this.state.itemError} />
                <Input placeholder='Quantity' onChangeText={ quantity => {this.setState({ quantity: quantity})}} errorStyle={{ color: 'red' }} errorMessage={this.state.quantityError} />
                <Button title='Add Item' onPress={() => this.addItem()} />
                <FlatList
                    data={ this.state.items }
                    renderItem={ ({ item }) => (
                        <Text onPress={ this.removeItem.bind(this, item.name ) }>{item.name}: {item.quantity}</Text> 
                    )}
                    keyExtractor={ (index) => index.toString() }
                />
            </View>
        )
    }
}

const styles=StyleSheet.create({
    MainContainer: {
        flex: 1,
        flexDirection: 'column'
    }
})