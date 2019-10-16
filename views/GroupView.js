import React, { Component } from 'react';
import { Animated, View, Keyboard, FlatList, Text, Alert, TouchableOpacity } from 'react-native';
import { Header, Button, Input } from 'react-native-elements';
import { createStackNavigator } from 'react-navigation-stack';
import PropTypes from 'prop-types';
import FirebaseAPI from '../store/FirebaseAPI';
import { MainContainerStyle, DropDownStyle, FlatListStyle, HeaderStyle } from '../store/Styler';
import GroupItems from './GroupItems';
import GroupUsers from './GroupUsers';

export class GroupView extends Component {
  constructor(props) {
    super(props);

    FirebaseAPI.getGroupList()
      .then(groups => {
        groups.sort((a, b) => (a.groupName < b.groupName ? -1 : 1));
        this.setState({ groups });
      })
      .catch(error => {
        console.log(error);
      });
    this.state = {
      groups: [],
      groupName: '',
      groupNameError: '',
      groupViewIsOpen: false,
      groupViewOffsetY: new Animated.Value(-500),
      listViewOffsetY: new Animated.Value(-500),
      groupViewIcon: HeaderStyle.Add.Icon,
    };
  }

  validateInformation = () => {
    let isValid = true;
    const { groupName } = this.state;

    if (!groupName) {
      this.setState({ groupNameError: 'Please enter a name' });
      isValid = false;
    } else {
      this.setState({ groupNameError: '' });
    }

    return isValid;
  };

  createGroup = () => {
    if (this.validateInformation()) {
      const { groups, groupName } = this.state;
      FirebaseAPI.groupExists(groupName)
        .then(groupExists => {
          if (!groupExists) {
            FirebaseAPI.createGroup(groupName).then(group => {
              const groupJoiner = [...groups];
              groupJoiner.push(group);
              groupJoiner.sort((a, b) => (a.groupName < b.groupName ? -1 : 1));
              this.setState({ groups: groupJoiner });
            });
          } else {
            Alert.alert('', 'Group already exists');
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  };

  updateView = () => {
    FirebaseAPI.getGroupList()
      .then(groups => {
        groups.sort((a, b) => (a.groupName < b.groupName ? -1 : 1));
        this.setState({ groups });
      })
      .catch(error => {
        console.log(error);
      });
  };

  setGroupViewLayout = event => {
    const { height } = event.nativeEvent.layout;
    const { groupViewIsOpen, groupViewOffsetY, listViewOffsetY } = this.state;
    this.setState({
      groupViewHeight: height,
    });
    if (groupViewIsOpen) {
      groupViewOffsetY.setValue(0);
      listViewOffsetY.setValue(0);
    } else {
      groupViewOffsetY.setValue(-(height + 55));
      listViewOffsetY.setValue(-height);
    }
  };

  loadGroup = group => {
    const { navigation } = this.props;
    navigation.navigate('GroupItems', {
      gid: group.gid,
      groupName: group.name,
      users: group.users,
      callback: this.updateView.bind(this),
    });
  };

  toggleAddGroup = () => {
    const { groupViewIsOpen, groupViewOffsetY, groupViewHeight, listViewOffsetY } = this.state;
    if (groupViewIsOpen) {
      Keyboard.dismiss();
      Animated.parallel([
        Animated.timing(groupViewOffsetY, {
          toValue: -(groupViewHeight + 55),
        }),
        Animated.timing(listViewOffsetY, { toValue: -groupViewHeight }),
      ]).start();

      this.setState({
        groupViewIcon: HeaderStyle.Add.Icon,
      });
    } else {
      Animated.parallel([
        Animated.timing(groupViewOffsetY, { toValue: 0 }),
        Animated.timing(listViewOffsetY, { toValue: 0 }),
      ]).start();

      this.setState({
        groupViewIcon: HeaderStyle.Remove.Icon,
      });
    }
    this.setState({ groupViewIsOpen: !groupViewIsOpen });
  };

  toggleDrawer = () => {
    const { navigation } = this.props;
    navigation.toggleDrawer();
  };

  static navigationOptions = {
    title: 'Groups',
  };

  render() {
    const {
      groups,
      groupNameError,
      groupViewIcon,
      groupViewOffsetY,
      groupViewIsOpen,
      listViewOffsetY,
    } = this.state;
    return (
      <View style={MainContainerStyle}>
        <View style={HeaderStyle.ZPosition}>
          <Header
            placement="left"
            leftComponent={
              <Button
                icon={HeaderStyle.Menu.Icon}
                type={HeaderStyle.Menu.Type}
                onPress={() => this.toggleDrawer()}
              />
            }
            centerComponent={{ text: 'Groups', style: HeaderStyle.Text }}
            rightComponent={
              <Button icon={groupViewIcon} type="clear" onPress={() => this.toggleAddGroup()} />
            }
            backgroundColor={HeaderStyle.BackgroundColor}
          />
        </View>

        <Animated.View
          style={{
            backgroundColor: DropDownStyle.BackgroundColor,
            transform: [{ translateY: groupViewOffsetY }],
          }}
        >
          <View
            pointerEvents={!groupViewIsOpen ? 'none' : 'auto'}
            onLayout={event => this.setGroupViewLayout(event)}
          >
            <Input
              placeholder="Group name"
              inputStyle={DropDownStyle.InputText}
              inputContainerStyle={DropDownStyle.InputContainer}
              placeholderTextColor={DropDownStyle.PlaceHolderColor}
              onChangeText={groupName => this.setState({ groupName })}
              errorStyle={DropDownStyle.Error}
              errorMessage={groupNameError}
            />
            <Button
              title="Create Group"
              titleStyle={DropDownStyle.Button.Title}
              type={DropDownStyle.Button.Type}
              onPress={() => this.createGroup()}
            />
          </View>
        </Animated.View>

        <Animated.View style={{ transform: [{ translateY: listViewOffsetY }] }}>
          <FlatList
            data={groups}
            ItemSeparatorComponent={() => <View style={FlatListStyle.Separator} />}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  margin: 10,
                }}
                onPress={() => this.loadGroup(item)}
              >
                <Text style={FlatListStyle.Text}>{item.name}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={index => index.gid}
          />
        </Animated.View>
      </View>
    );
  }
}

GroupView.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    toggleDrawer: PropTypes.func.isRequired,
  }).isRequired,
};

export default createStackNavigator(
  {
    Groups: GroupView,
    GroupItems,
    GroupUsers,
  },
  {
    initialRouteName: 'Groups',
    defaultNavigationOptions: {
      header: null,
    },
  }
);
