import React, { Component } from 'react';
import { Animated, Keyboard, View, FlatList, TouchableOpacity, Text, Alert } from 'react-native';
import { Header, Button, Input } from 'react-native-elements';
import PropTypes from 'prop-types';
import { MainContainerStyle, HeaderStyle, FlatListStyle, DropDownStyle } from '../store/Styler';
import FirebaseAPI from '../store/FirebaseAPI';

export default class GroupUsers extends Component {
  constructor(props) {
    super(props);

    const { navigation } = this.props;
    this.gid = navigation.getParam('gid', '');
    this.users = navigation.getParam('users', []);
    this.state = {
      users: [],
      email: '',
      emailError: '',
      userViewIsOpen: false,
      userViewOffsetY: new Animated.Value(-500),
      listViewOffsetY: new Animated.Value(-500),
      userViewIcon: HeaderStyle.Add.Icon,
    };

    const uids = this.users.map(value => {
      return value.uid;
    });
    FirebaseAPI.getUserListInfo(uids)
      .then(users => {
        users.sort((a, b) => (a.name < b.name ? -1 : 1));
        this.users = users;
        this.setState({
          users,
        });
      })
      .catch(error => console.log(error));
  }

  goBack = () => {
    const { navigation } = this.props;
    navigation.state.params.callback(this.users);
    navigation.goBack();
  };

  validateInformation = () => {
    let isValid = true;
    const { email } = this.state;

    if (!email) {
      this.setState({
        emailError: 'Please enter an email',
      });
    } else {
      const reg = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
      if (reg.test(email) === true) {
        this.setState({
          emailError: '',
        });
      } else {
        this.setState({
          emailError: 'Please enter a valid email',
        });
        isValid = false;
      }
    }

    return isValid;
  };

  addUser = () => {
    if (this.validateInformation()) {
      const { email } = this.state;
      FirebaseAPI.getUser(email.toLowerCase())
        .then(user => {
          if (user) {
            const uids = this.users.map(value => {
              return value.uid;
            });
            if (!uids.includes(user.uid)) {
              FirebaseAPI.addUserToGroup(this.gid, user.uid).catch(error => console.log(error));

              this.users.push(user);
              this.users.sort((a, b) => (a.name < b.name ? -1 : 1));
              this.setState({ users: this.users });
            } else {
              Alert.alert('', 'User is already in the group');
            }
          } else {
            Alert.alert('', 'Email invalid or user does not exist');
          }
        })
        .catch(error => console.log(error));
    }
  };

  setUserViewLayout = event => {
    const { height } = event.nativeEvent.layout;
    const { userViewOffsetY, userViewIsOpen, listViewOffsetY } = this.state;
    this.setState({
      userViewHeight: height,
    });
    if (userViewIsOpen) {
      userViewOffsetY.setValue(0);
      listViewOffsetY.setValue(0);
    } else {
      userViewOffsetY.setValue(-(height + 55));
      listViewOffsetY.setValue(-height);
    }
  };

  toggleAddUser() {
    const { userViewOffsetY, userViewIsOpen, listViewOffsetY, userViewHeight } = this.state;
    if (userViewIsOpen) {
      Keyboard.dismiss();
      Animated.parallel([
        Animated.timing(userViewOffsetY, { toValue: -(userViewHeight + 55) }),
        Animated.timing(listViewOffsetY, { toValue: -userViewHeight }),
      ]).start();

      this.setState({
        userViewIcon: HeaderStyle.Add.Icon,
      });
    } else {
      Animated.parallel([
        Animated.timing(userViewOffsetY, { toValue: 0 }),
        Animated.timing(listViewOffsetY, { toValue: 0 }),
      ]).start();

      this.setState({
        userViewIcon: HeaderStyle.Remove.Icon,
      });
    }
    this.setState({ userViewIsOpen: !userViewIsOpen });
  }

  render() {
    const {
      users,
      emailError,
      userViewIcon,
      userViewOffsetY,
      userViewIsOpen,
      listViewOffsetY,
    } = this.state;
    return (
      <View style={MainContainerStyle}>
        <View style={HeaderStyle.ZPosition}>
          <Header
            placement="left"
            leftComponent={
              <Button
                icon={HeaderStyle.Back.Icon}
                type={HeaderStyle.Back.Type}
                onPress={() => this.goBack()}
              />
            }
            centerComponent={{ text: 'Users', style: HeaderStyle.Text }}
            rightComponent={
              <Button icon={userViewIcon} type="clear" onPress={() => this.toggleAddUser()} />
            }
            backgroundColor={HeaderStyle.BackgroundColor}
          />
        </View>

        <Animated.View
          style={{
            backgroundColor: DropDownStyle.BackgroundColor,
            transform: [{ translateY: userViewOffsetY }],
          }}
        >
          <View
            pointerEvents={!userViewIsOpen ? 'none' : 'auto'}
            onLayout={event => this.setUserViewLayout(event)}
          >
            <Input
              placeholder="Email"
              inputStyle={DropDownStyle.InputText}
              inputContainerStyle={DropDownStyle.InputContainer}
              placeholderTextColor={DropDownStyle.PlaceHolderColor}
              onChangeText={email => this.setState({ email })}
              errorStyle={DropDownStyle.Error}
              errorMessage={emailError}
            />
            <Button
              title="Add"
              titleStyle={DropDownStyle.Button.Title}
              type={DropDownStyle.Button.Type}
              onPress={() => this.addUser()}
            />
          </View>
        </Animated.View>

        <Animated.View style={{ transform: [{ translateY: listViewOffsetY }] }}>
          <FlatList
            data={users}
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
                <Text style={FlatListStyle.Text}>{item.name}</Text>
                <Text style={FlatListStyle.Subtle}>{item.email}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={index => index.uid}
          />
        </Animated.View>
      </View>
    );
  }
}

GroupUsers.propTypes = {
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
