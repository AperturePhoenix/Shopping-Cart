import React, { Component } from 'react';
import { View, Text, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { Header, Button } from 'react-native-elements';
import PropTypes from 'prop-types';
import { MainContainerStyle, HeaderStyle, FlatListStyle } from '../store/Styler';
import FirebaseAPI from '../store/FirebaseAPI';

export default class GroupItems extends Component {
  constructor(props) {
    super(props);

    const { navigation } = this.props;

    this.gid = navigation.getParam('gid', '');
    this.groupName = navigation.getParam('groupName', 'Group Usernames');
    this.users = navigation.getParam('users', []);
    this.state = {
      groupItems: [],
      isRefreshing: false,
    };

    this.updateItems();
  }

  navigateUserView = () => {
    const { navigation } = this.props;
    navigation.navigate('GroupUsers', {
      gid: this.gid,
      users: this.users,
      callback: this.updateUsers.bind(this),
    });
  };

  updateUsers = users => {
    const { navigation } = this.props;
    navigation.state.params.callback();
    this.users = users;
    this.updateItems();
  };

  refreshItems = () => {
    this.setState({ isRefreshing: true });
    this.updateItems();
  };

  updateItems = () => {
    const uids = this.users.map(value => {
      return value.uid;
    });
    FirebaseAPI.getGroupItems(uids)
      .then(groupItems => {
        groupItems.sort((a, b) => (a.itemName < b.itemName ? -1 : 1));
        this.setState({ groupItems, isRefreshing: false });
      })
      .catch(error => console.log(error));
  };

  render() {
    const { groupItems, isRefreshing } = this.state;
    const { navigation } = this.props;
    return (
      <View style={MainContainerStyle}>
        <View style={HeaderStyle.ZPosition}>
          <Header
            placement="left"
            leftComponent={
              <Button
                icon={HeaderStyle.Back.Icon}
                type={HeaderStyle.Back.Type}
                onPress={() => navigation.goBack()}
              />
            }
            centerComponent={{ text: this.groupName, style: HeaderStyle.Text }}
            rightComponent={
              <Button
                icon={HeaderStyle.Settings.Icon}
                type="clear"
                onPress={() => this.navigateUserView()}
              />
            }
            backgroundColor={HeaderStyle.BackgroundColor}
          />
        </View>

        <FlatList
          data={groupItems}
          ItemSeparatorComponent={() => <View style={FlatListStyle.Separator} />}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-between',
                margin: 10,
              }}
            >
              <Text style={FlatListStyle.Text}>
                {item.itemName} {item.itemQuantity > 1 && `(${item.itemQuantity})`}
              </Text>
              <Text style={FlatListStyle.Subtle}>{item.name}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={index => index.iid}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={() => this.refreshItems()} />
          }
        />
      </View>
    );
  }
}

GroupItems.propTypes = {
  navigation: PropTypes.shape({
    getParam: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
    navigate: PropTypes.func.isRequired,
    state: PropTypes.shape({
      params: PropTypes.shape({
        callback: PropTypes.func,
      }),
    }),
  }).isRequired,
};
