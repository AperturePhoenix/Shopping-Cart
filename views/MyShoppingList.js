import React, { Component } from 'react'
import { View, Text, StyleSheet, FlatList, Alert, Animated } from 'react-native'
import { Button, Input, Header, Icon } from 'react-native-elements'
import FirebaseAPI from '../store/FirebaseAPI'

export default class MyShoppingList extends Component {
    static navigationOptions = {
        title: 'My Shopping List'
    }

    constructor(props) {
        super(props)

        this.username = FirebaseAPI.username
        this.state = {
            items: [],
            item: '', itemError: '',
            quantity: 0, quantityError: '',
            isOpen: true, offsetY: new Animated.Value(0)
        }
        FirebaseAPI.getItems(this.username)
            .then(items => { this.setState({ items: items }) })
            .catch(error => { console.log(error) })
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
            FirebaseAPI.itemExists(this.username, this.state.item)
                .then(exists => {
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
                .catch(error => { console.log(error) })
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

    toggleAddItem() {
        console.log("TRYING TO DO STUFF" + this.state.isOpen)
        if (this.state.isOpen) {
            
            Animated.timing(
                this.state.offsetY,
                { toValue: -225 }
              ).start();
        } else {
            Animated.timing(
                this.state.offsetY,
                { toValue: 0 }
              ).start();
        }

        this.setState({ isOpen: !this.state.isOpen })
    }

    toggleDrawer = () => {
        this.props.navigation.toggleDrawer();
    }

    render() {
        return (
            <View style={ styles.MainContainer }>
                <View style={{ elevation: 100, zIndex: 100 }} >
                    <Header
                        placement='left'
                        leftComponent={<Button icon={<Icon name='menu' color='white' />} type='clear' onPress={() => this.toggleDrawer()} />}
                        centerComponent={{ text: 'My Shopping List', style: { color: '#fff', fontSize: 24 } }}
                        rightComponent={<Button icon={<Icon name='add' color='white' />} type='clear' onPress={() => this.toggleAddItem() } />}
                        backgroundColor='#ffd602'
                    />
                </View>

                <Animated.View style={{ transform: [{translateY: this.state.offsetY}] }} >
                    <View pointerEvents={!this.state.isOpen ? 'none' : 'auto'}>
                        <Input placeholder='Item' onChangeText={ item => {this.setState({ item: item})}} errorStyle={{ color: '#f5624b' }} errorMessage={this.state.itemError} />
                        <Input placeholder='Quantity' onChangeText={ quantity => {this.setState({ quantity: quantity})}} errorStyle={{ color: '#f5624b' }} errorMessage={this.state.quantityError} />
                        <Button title='Add' onPress={ () => this.addItem() } />
                        <Button title='Close' onPress= { () => this.toggleAddItem() } />
                    </View>
                </Animated.View>

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