import React, { Component } from 'react';
import {
  Dimensions,
  View,
  Text,
  Alert,
  Animated,
  TouchableOpacity,
  Keyboard,
  RefreshControl,
  SectionList,
} from 'react-native';
import { Button, Input, Header } from 'react-native-elements';
import PropTypes from 'prop-types';
import FirebaseAPI from '../store/FirebaseAPI';
import { MainContainerStyle, DropDownStyle, FlatListStyle, HeaderStyle } from '../store/Styler';

export default class MyShoppingList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      items: [],
      item: '',
      itemError: '',
      quantity: 0,
      quantityError: '',
      itemViewIsOpen: false,
      itemViewOffsetY: new Animated.Value(-500),
      listViewOffsetY: new Animated.Value(-500),
      itemViewIcon: HeaderStyle.Add.Icon,
      isRefresing: false,
    };
    this.getItems();
  }

  validateInformation = () => {
    let isValid = true;
    const { item, quantity } = this.state;
    if (!item) {
      this.setState({ itemError: 'Please enter an item' });
      isValid = false;
    } else {
      this.setState({ itemError: '' });
    }
    if (!quantity) {
      this.setState({ quantityError: 'Please enter a quantity' });
      isValid = false;
    } else if (Number.isNaN(quantity)) {
      this.setState({ quantityError: 'Please enter a number' });
      isValid = false;
    } else {
      this.setState({ quantityError: '' });
    }

    return isValid;
  };

  addItem = () => {
    if (this.validateInformation()) {
      const { items, item, quantity } = this.state;
      const notCompletedList = items[0].data;
      FirebaseAPI.itemExists(item)
        .then(exists => {
          if (!exists) {
            FirebaseAPI.addItem(item, quantity).then(itemEntry => {
              notCompletedList.push(itemEntry);
              notCompletedList.sort((a, b) => (a.itemName < b.itemName ? -1 : 1));
              items[0].data = notCompletedList;
              this.setState({ items });
            });
          } else {
            Alert.alert('', 'Item is already in the cart');
          }
        })
        .catch(console.log);
    }
  };

  removeItem = iid => {
    const { items } = this.state;
    const itemRemover = [...items];
    const prevIndex = items.findIndex(itemElement => itemElement.iid === iid);
    itemRemover.splice(prevIndex, 1);
    this.setState({ items: itemRemover });
    FirebaseAPI.removeItem(iid);
  };

  updateItem = (index, completed) => {
    const { items } = this.state;
    const notCompletedList = items[0].data;
    const completedList = items[1].data;
    if (completed) {
      FirebaseAPI.removeItem(completedList[index].iid);
      completedList.splice(index, 1);
    } else {
      const item = notCompletedList[index];
      item.completed = true;
      item.completedByUID = FirebaseAPI.auth.currentUser.uid;
      item.completedByName = FirebaseAPI.userName;
      notCompletedList.splice(index, 1);
      completedList.push(item);
      completedList.sort((a, b) => (a.itemName < b.itemName ? -1 : 1));
      FirebaseAPI.updateItem(item.iid, {
        completed: true,
        completedByUID: FirebaseAPI.auth.currentUser.uid,
        completedByName: FirebaseAPI.userName,
      });
    }
    items[0].data = notCompletedList;
    items[1].data = completedList;
    this.setState({ items });
  };

  setItemViewLayout = event => {
    const { height } = event.nativeEvent.layout;
    const { itemViewOffsetY, itemViewIsOpen, listViewOffsetY } = this.state;
    this.setState({
      itemViewHeight: height,
    });
    if (itemViewIsOpen) {
      itemViewOffsetY.setValue(0);
      listViewOffsetY.setValue(0);
    } else {
      itemViewOffsetY.setValue(-(height + 55));
      listViewOffsetY.setValue(-height);
    }
  };

  toggleDrawer = () => {
    const { navigation } = this.props;
    navigation.toggleDrawer();
  };

  refreshItems = () => {
    this.setState({ isRefresing: true });
    this.getItems();
  };

  getItems = () => {
    FirebaseAPI.getItems()
      .then(({ notCompleted, completed }) => {
        notCompleted.sort((a, b) => (a.itemName < b.itemName ? -1 : 1));
        completed.sort((a, b) => (a.itemName < b.itemName ? -1 : 1));
        this.setState({
          items: [
            { title: 'Need to Buy', data: notCompleted },
            { title: 'Completed', data: completed },
          ],
          isRefresing: false,
        });
      })
      .catch(console.log);
  };

  toggleAddItem() {
    const { itemViewOffsetY, itemViewIsOpen, listViewOffsetY, itemViewHeight } = this.state;
    if (itemViewIsOpen) {
      Keyboard.dismiss();
      Animated.parallel([
        Animated.timing(itemViewOffsetY, { toValue: -(itemViewHeight + 55) }),
        Animated.timing(listViewOffsetY, { toValue: -itemViewHeight }),
      ]).start();

      this.setState({
        itemViewIcon: HeaderStyle.Add.Icon,
      });
    } else {
      Animated.parallel([
        Animated.timing(itemViewOffsetY, { toValue: 0 }),
        Animated.timing(listViewOffsetY, { toValue: 0 }),
      ]).start();

      this.setState({
        itemViewIcon: HeaderStyle.Remove.Icon,
      });
    }
    this.setState({ itemViewIsOpen: !itemViewIsOpen });
  }

  static navigationOptions = {
    title: 'My Shopping List',
  };

  render() {
    const {
      items,
      itemError,
      quantityError,
      itemViewIcon,
      itemViewOffsetY,
      itemViewIsOpen,
      listViewOffsetY,
      isRefresing: isRefreshing,
      flatListHeight,
    } = this.state;
    return (
      <View style={MainContainerStyle}>
        <View style={HeaderStyle.ZPosition}>
          <Header
            onLayout={({
              nativeEvent: {
                layout: { height },
              },
            }) => {
              const screenHeight = Dimensions.get('window').height;
              this.setState({ flatListHeight: screenHeight - height });
            }}
            placement="left"
            leftComponent={
              <Button
                icon={HeaderStyle.Menu.Icon}
                type={HeaderStyle.Menu.Type}
                onPress={() => this.toggleDrawer()}
              />
            }
            centerComponent={{ text: 'My Shopping List', style: HeaderStyle.Text }}
            rightComponent={
              <Button icon={itemViewIcon} type="clear" onPress={() => this.toggleAddItem()} />
            }
            backgroundColor={HeaderStyle.BackgroundColor}
          />
        </View>

        <Animated.View
          style={{
            backgroundColor: DropDownStyle.BackgroundColor,
            transform: [{ translateY: itemViewOffsetY }],
          }}
        >
          <View
            pointerEvents={!itemViewIsOpen ? 'none' : 'auto'}
            onLayout={event => this.setItemViewLayout(event)}
          >
            <Input
              placeholder="Item"
              inputStyle={DropDownStyle.InputText}
              inputContainerStyle={DropDownStyle.InputContainer}
              placeholderTextColor={DropDownStyle.PlaceHolderColor}
              onChangeText={item => this.setState({ item })}
              errorStyle={DropDownStyle.Error}
              errorMessage={itemError}
            />
            <Input
              placeholder="Quantity"
              inputStyle={DropDownStyle.InputText}
              inputContainerStyle={DropDownStyle.InputContainer}
              placeholderTextColor={DropDownStyle.PlaceHolderColor}
              onChangeText={quantity => this.setState({ quantity })}
              errorStyle={DropDownStyle.Error}
              errorMessage={quantityError}
            />
            <Button
              title="Add"
              titleStyle={DropDownStyle.Button.Title}
              type={DropDownStyle.Button.Type}
              onPress={() => this.addItem()}
            />
          </View>
        </Animated.View>

        <Animated.View style={{ flex: 1, transform: [{ translateY: listViewOffsetY }] }}>
          <View height={flatListHeight}>
            <SectionList
              sections={items}
              keyExtractor={index => index.iid}
              refreshControl={
                <RefreshControl refreshing={isRefreshing} onRefresh={() => this.refreshItems()} />
              }
              renderSectionHeader={({ section: { title, data } }) =>
                data.length > 0 ? <Text>{title}</Text> : null
              }
              renderItem={({ index, item }) => (
                <TouchableOpacity
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    margin: 10,
                  }}
                  onPress={() => this.updateItem(index, item.completed)}
                >
                  <Text style={FlatListStyle.Text}>{item.itemName}</Text>
                  <Text style={FlatListStyle.Subtle}>
                    {item.completedByUID ? item.completedByName : item.itemQuantity}
                  </Text>
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => <View style={FlatListStyle.Separator} />}
            />
          </View>
        </Animated.View>
      </View>
    );
  }
}

MyShoppingList.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    toggleDrawer: PropTypes.func.isRequired,
  }).isRequired,
};
