import React, { Component } from 'react'
import { View, Text, AsyncStorage, StyleSheet, FlatList } from 'react-native'
import { Button, Input } from 'react-native-elements'
import FirebaseAPI from './../store/FirebaseAPI'

export default class MyShoppingList extends Component {
    static navigationOptions = {
        title: 'My Shopping List'
    }

    constructor(props) {
        super(props)

        this.itemJoiner = []
        this.state = {
            items: [],
            item: '', itemError: '',
            quantity: 0, quantityError: ''
        }
    }

    addItem = () => { 
        this.itemJoiner.push({ name: this.state.item, quantity: this.state.quantity })
        this.setState({ items: [...this.itemJoiner] })
        console.log('calling add item')
        FirebaseAPI.addItem('Aperture Phoenix', this.state.item, this.state.quantity)
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
                    renderItem={ ({ item }) => <Text>{item.name}: {item.quantity}</Text> }
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