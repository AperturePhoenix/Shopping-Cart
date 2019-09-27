import React, { Component } from 'react'
import { View, Text, FlatList, Alert, Animated, TouchableOpacity } from 'react-native'
import { Button, Input, Header } from 'react-native-elements'
import FirebaseAPI from '../store/FirebaseAPI'
import { MainContainerStyle, DropDownStyle, FlatListStyle, HeaderStyle } from '../store/Styler'

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
            itemViewIsOpen: false, itemViewOffsetY: new Animated.Value(-500), listViewOffsetY: new Animated.Value(-500),
            itemViewIcon: HeaderStyle.Add.Icon
        }
        FirebaseAPI.getItems(this.username)
            .then(items => { this.setState({ items: items }) })
            .catch(error => { console.log(error) })
    }

    validateInformation = () => {
        let isValid = true
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

    setItemViewLayout = (event) => {
        let { height } = event.nativeEvent.layout
        this.setState({
            itemViewHeight: height
        })
        if (this.state.itemViewIsOpen) {
            this.state.itemViewOffsetY.setValue(0)
            this.state.listViewOffsetY.setValue(0)
        } else {
            this.state.itemViewOffsetY.setValue(-(height + 55))
            this.state.listViewOffsetY.setValue(-height)
        }
    }

    toggleAddItem() {
        if (this.state.itemViewIsOpen) {
            Animated.parallel([
                Animated.timing(
                    this.state.itemViewOffsetY,
                    { toValue: -(this.state.itemViewHeight + 55) }
                ),
                Animated.timing(
                    this.state.listViewOffsetY,
                    { toValue: -(this.state.itemViewHeight) }
                )
            ]).start()
            
            this.setState({
                itemViewIcon: HeaderStyle.Add.Icon
            })
        } else {
            Animated.parallel([
                Animated.timing(
                    this.state.itemViewOffsetY,
                    { toValue: 0 }
                ),
                Animated.timing(
                    this.state.listViewOffsetY,
                    { toValue: 0 }
                )
            ]).start()
            
            this.setState({
                itemViewIcon: HeaderStyle.Remove.Icon
            })
        }
        this.setState({ itemViewIsOpen: !this.state.itemViewIsOpen })
    }

    toggleDrawer = () => {
        this.props.navigation.toggleDrawer();
    }

    render() {
        return (
            <View style={MainContainerStyle}>
                <View style={HeaderStyle.ZPosition} >
                    <Header
                        placement='left'
                        leftComponent={<Button icon={HeaderStyle.Menu.Icon} type={HeaderStyle.Menu.Type} onPress={() => this.toggleDrawer()} />}
                        centerComponent={{ text: 'My Shopping List', style: HeaderStyle.Text }}
                        rightComponent={<Button icon={this.state.itemViewIcon} type='clear' onPress={() => this.toggleAddItem() } />}
                        backgroundColor={HeaderStyle.BackgroundColor}
                    />
                </View>

                <Animated.View style={{ backgroundColor: DropDownStyle.BackgroundColor, transform: [{translateY: this.state.itemViewOffsetY}] }} >
                    <View pointerEvents={!this.state.itemViewIsOpen ? 'none' : 'auto'} onLayout={ event => this.setItemViewLayout(event) } >
                        <Input placeholder='Item' inputStyle={DropDownStyle.InputText} inputContainerStyle={DropDownStyle.InputContainer} placeholderTextColor={DropDownStyle.PlaceHolderColor} onChangeText={ item => this.setState({ item: item})} errorStyle={DropDownStyle.Error} errorMessage={this.state.itemError} />
                        <Input placeholder='Quantity' inputStyle={DropDownStyle.InputText} inputContainerStyle={DropDownStyle.InputContainer} placeholderTextColor={DropDownStyle.PlaceHolderColor} onChangeText={ quantity => this.setState({ quantity: quantity})} errorStyle={DropDownStyle.Error} errorStyle={DropDownStyle.Error} errorMessage={this.state.quantityError} />
                        <Button title='Add' titleStyle={DropDownStyle.Button.Title} type={DropDownStyle.Button.Type} onPress={ () => this.addItem() } />
                    </View>
                </Animated.View>
                
                <Animated.View style={{ transform: [{translateY: this.state.listViewOffsetY}] }} >
                    <FlatList
                        data={ this.state.items }
                        ItemSeparatorComponent={ () => (
                            <View style={FlatListStyle.Separator} />
                        )}
                        renderItem={ ({ item }) => (
                            <TouchableOpacity style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', margin: 10 }} onPress={ this.removeItem.bind(this, item.name ) }>
                                <Text style={FlatListStyle.Text}>{item.name}</Text> 
                                <Text style={FlatListStyle.Subtle}>{item.quantity}</Text>
                            </TouchableOpacity>
                        )}
                        keyExtractor={ (index) => index.toString() }
                    />
                </Animated.View>
            </View>
        )
    }
}