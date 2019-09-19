import React, { Component } from 'react'
import { View, Text, AsyncStorage, StyleSheet, FlatList, Alert } from 'react-native'
import { Button, Input, Header, Icon } from 'react-native-elements'
import FirebaseAPI from '../store/FirebaseAPI'

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

    validateInformation = () => {
        isValid = true
        if (!this.state.item) {
            this.setState({ itemError: 'Please enter an item'})
            isValid=false
        } else {
            this.setState({ itemError: ''})
        } 
        if (!this.state.quantity) {
            this.setState({ quantityError: 'Please enter a quantity' })
            isValid=false
        } else if (isNaN(this.state.quantity)) {
            this.setState({ quantityError: 'Please enter a number'})
            isValid=false
        } else {
            this.setState({ quantityError: ''})
        }

        return isValid
    }

    addItem = () => {
        if (this.validateInformation()) {
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

    toggleDrawer = () => {
        this.props.navigation.toggleDrawer();
    }

    render() {
        return (
            <View style={ styles.MainContainer }>
                <Header
                    placement='left'
                    leftComponent={<Button icon={<Icon name='menu' color='white' />} type='clear' onPress={() => this.toggleDrawer()} />}
                    centerComponent={{ text: 'My Shopping List', style: { color: '#fff', fontSize: 24 } }}
                    rightComponent={<Button icon={<Icon name='add' color='white' />} type='clear' onPress={() => this.addItem()} />}
                    backgroundColor='#ffd602'
                />
                <Button title='Reset Data' onPress= { () => this.reset() } />
                <Input placeholder='Item' onChangeText={ item => {this.setState({ item: item})}} errorStyle={{ color: '#f5624b' }} errorMessage={this.state.itemError} />
                <Input placeholder='Quantity' onChangeText={ quantity => {this.setState({ quantity: quantity})}} errorStyle={{ color: '#f5624b' }} errorMessage={this.state.quantityError} />
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