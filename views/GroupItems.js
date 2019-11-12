import React, { Component } from 'react';
import { View, Text, SectionList, TouchableOpacity, RefreshControl } from 'react-native';
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

  updateItem = (index, completed) => {
    const { groupItems } = this.state;
    const notCompletedList = groupItems[0].data;
    const completedList = groupItems[1].data;
    if (completed === false) {
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
    groupItems[0].data = notCompletedList;
    groupItems[1].data = completedList;
    this.setState({ groupItems });
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
      .then(({ notCompleted, completed }) => {
        notCompleted.sort((a, b) => (a.itemName < b.itemName ? -1 : 1));
        completed.sort((a, b) => (a.itemName < b.itemName ? -1 : 1));
        this.setState({
          groupItems: [
            { title: 'Need to Buy', data: notCompleted },
            { title: 'Completed', data: completed },
          ],
          isRefreshing: false,
        });
      })
      .catch(console.log);
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

        <SectionList
          sections={groupItems}
          keyExtractor={index => index.iid}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={() => this.refreshItems()} />
          }
          renderSectionHeader={({ section: { title } }) => <Text>{title}</Text>}
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
